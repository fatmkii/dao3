<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Jobs\ProcessAdminActive;
use App\Jobs\ProcessIncomeStatement;
use App\Models\Accuse;
use App\Models\Admin;
use App\Models\Forum;
use App\Models\Post;
use App\Models\Thread;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Redis;
use Laravel\Sanctum\Sanctum;
use ReflectionProperty;
use Tests\TestCase;

class AdminDeletedPostPenaltyTest extends TestCase
{
    use RefreshDatabase;

    private Forum $forum;
    private Thread $thread;
    private User $admin;
    private User $target;

    protected function setUp(): void
    {
        parent::setUp();

        Bus::fake([ProcessAdminActive::class, ProcessIncomeStatement::class]);

        $this->target = User::factory()->create([
            'binggan' => 'target_binggan',
            'coin' => 5000,
        ]);

        $this->admin = User::factory()->admin()->create(['binggan' => 'admin_binggan']);

        $this->forum = Forum::create([
            'name' => '测试板块',
            'description' => 'test forum',
            'status' => 1,
            'accessible_coin' => 0,
        ]);

        $adminPermission = new Admin();
        $adminPermission->user_id = $this->admin->id;
        $adminPermission->name = '测试管理员';
        $adminPermission->forums = [$this->forum->id];
        $adminPermission->save();

        $this->thread = new Thread();
        $this->thread->forum_id = $this->forum->id;
        $this->thread->title = '测试主题';
        $this->thread->sub_title = '[测试]';
        $this->thread->is_delay = 0;
        $this->thread->is_deleted = 0;
        $this->thread->is_private = false;
        $this->thread->locked_by_coin = 0;
        $this->thread->created_binggan = $this->target->binggan;
        $this->thread->save();

        Redis::del($this->penaltyKey($this->target));

        Sanctum::actingAs($this->admin, ['forum_admin']);
    }

    public function test_five_penalty_post_deletions_lock_user_with_auto_reason(): void
    {
        for ($i = 1; $i <= 5; $i++) {
            $post = $this->createTargetPost('被删除回复 ' . $i);

            $this->deleteJson('/api/admin/post_delete/' . $post->id, [
                'thread_id' => $this->thread->id,
                'content' => '管理员删帖理由',
                'reduce_olo' => true,
            ])->assertJson(['code' => ResponseCode::SUCCESS]);
        }

        $this->target->refresh();
        $this->assertSame(1, $this->target->locked_count);
        $this->assertNotNull($this->target->locked_until);
        $this->assertTrue(Carbon::parse($this->target->locked_until)->gt(Carbon::now()->addDays(2)));
        $this->assertSame(5, (int) Redis::get($this->penaltyKey($this->target)));
        $this->assertGreaterThan(0, Redis::ttl($this->penaltyKey($this->target)));

        Bus::assertDispatched(ProcessAdminActive::class, function (ProcessAdminActive $job) {
            $payload = $this->adminActivePayload($job);

            return $payload['active_type'] === 'user_lock'
                && $payload['content'] === '24h被删帖5次'
                && $payload['user_id_target'] === $this->target->id;
        });
    }

    public function test_protective_deletions_do_not_count_toward_auto_lock(): void
    {
        for ($i = 1; $i <= 5; $i++) {
            $post = $this->createTargetPost('保护性删除回复 ' . $i);

            $this->deleteJson('/api/admin/post_delete/' . $post->id, [
                'thread_id' => $this->thread->id,
                'content' => '保护性删帖',
                'reduce_olo' => false,
            ])->assertJson(['code' => ResponseCode::SUCCESS]);
        }

        $this->target->refresh();
        $this->assertSame(0, $this->target->locked_count);
        $this->assertNull($this->target->locked_until);
        $this->assertFalse((bool) Redis::exists($this->penaltyKey($this->target)));
    }

    public function test_delete_all_counts_as_three_penalty_deletions(): void
    {
        $firstPost = $this->createTargetPost('批量删除基准回复');
        $this->createTargetPost('批量删除同作者回复');

        $this->postJson('/api/admin/post_delete_all', [
            'thread_id' => $this->thread->id,
            'post_id' => $firstPost->id,
            'content' => '批量删除',
            'reduce_olo' => true,
        ])->assertJson(['code' => ResponseCode::SUCCESS]);

        $this->assertSame(3, (int) Redis::get($this->penaltyKey($this->target)));

        for ($i = 1; $i <= 2; $i++) {
            $post = $this->createTargetPost('补足阈值回复 ' . $i);
            $this->deleteJson('/api/admin/post_delete/' . $post->id, [
                'thread_id' => $this->thread->id,
                'content' => '管理员删帖理由',
                'reduce_olo' => true,
            ])->assertJson(['code' => ResponseCode::SUCCESS]);
        }

        $this->target->refresh();
        $this->assertSame(1, $this->target->locked_count);
    }

    public function test_accuse_delete_action_uses_same_auto_lock_rule(): void
    {
        $reporter = User::factory()->create(['binggan' => 'reporter_binggan']);

        for ($i = 1; $i <= 5; $i++) {
            $post = $this->createTargetPost('举报删除回复 ' . $i);

            Sanctum::actingAs($reporter);
            $this->postJson('/api/accuses', [
                'thread_id' => $this->thread->id,
                'post_id' => $post->id,
                'floor' => $post->floor,
                'reason' => '这是一个有效举报理由',
            ])->assertJson(['code' => ResponseCode::SUCCESS]);

            $accuse = Accuse::where('post_id', $post->id)->firstOrFail();

            Sanctum::actingAs($this->admin, ['forum_admin']);
            $this->postJson('/api/accuses/' . $accuse->id . '/handle', [
                'action' => 'delete',
                'reason' => '举报成立',
                'reduce_olo' => true,
            ])->assertJson(['code' => ResponseCode::SUCCESS]);
        }

        $this->target->refresh();
        $this->assertSame(1, $this->target->locked_count);
    }

    public function test_auto_lock_does_not_repeat_when_user_is_already_locked(): void
    {
        $this->target->locked_count = 1;
        $this->target->locked_until = Carbon::now()->addDay();
        $this->target->save();

        for ($i = 1; $i <= 5; $i++) {
            $post = $this->createTargetPost('已封禁期间删除回复 ' . $i);

            $this->deleteJson('/api/admin/post_delete/' . $post->id, [
                'thread_id' => $this->thread->id,
                'content' => '管理员删帖理由',
                'reduce_olo' => true,
            ])->assertJson(['code' => ResponseCode::SUCCESS]);
        }

        $this->target->refresh();
        $this->assertSame(1, $this->target->locked_count);
    }

    private function createTargetPost(string $content): Post
    {
        return Post::withoutEvents(fn () => Post::create([
            'forum_id' => $this->forum->id,
            'thread_id' => $this->thread->id,
            'content' => $content,
            'created_binggan' => $this->target->binggan,
        ]));
    }

    private function penaltyKey(User $user): string
    {
        return 'deleted_post_penalty_count_' . $user->id;
    }

    private function adminActivePayload(ProcessAdminActive $job): array
    {
        $property = new ReflectionProperty($job, 'admin_active');
        $property->setAccessible(true);

        return $property->getValue($job);
    }
}
