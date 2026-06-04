<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Jobs\ProcessAdminActive;
use App\Models\Accuse;
use App\Models\Admin;
use App\Models\Forum;
use App\Models\Post;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AccuseTest extends TestCase
{
    use RefreshDatabase;

    private Forum $forum;
    private Thread $thread;
    private Post $post;
    private User $reporter;
    private User $target;

    protected function setUp(): void
    {
        parent::setUp();

        Bus::fake([ProcessAdminActive::class]);

        $this->reporter = User::factory()->create(['binggan' => 'reporter_binggan']);
        $this->target = User::factory()->create(['binggan' => 'target_binggan']);

        $this->forum = Forum::create([
            'name' => '测试板块',
            'description' => 'test forum',
            'status' => 1,
            'accessible_coin' => 0,
        ]);

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

        $this->post = Post::withoutEvents(fn () => Post::create([
            'forum_id' => $this->forum->id,
            'thread_id' => $this->thread->id,
            'content' => '被举报回复内容',
            'created_binggan' => $this->target->binggan,
        ]));
    }

    public function test_user_can_create_accuse_and_list_is_anonymous(): void
    {
        Sanctum::actingAs($this->reporter);

        $response = $this->postJson('/api/accuses', $this->payload());

        $response->assertJson([
            'code' => ResponseCode::SUCCESS,
            'data' => [
                'thread_id' => $this->thread->id,
                'post_id' => $this->post->id,
                'status' => 'pending',
            ],
        ]);

        $list = $this->getJson('/api/accuses')->json('data.data.0');

        $this->assertArrayNotHasKey('handled_by', $list);
        $this->assertArrayNotHasKey('handle_note', $list);
        $this->assertNull($list['target_recent_count']);
        $this->assertNull($list['reasons'][0]['reporter_recent_count']);
        $this->assertStringNotContainsString($this->reporter->binggan, json_encode($list));
        $this->assertStringNotContainsString($this->target->binggan, json_encode($list));
    }

    public function test_index_accepts_numeric_pending_only_query(): void
    {
        Sanctum::actingAs($this->reporter);

        $this->getJson('/api/accuses?page=1&pending_only=0')
            ->assertJson(['code' => ResponseCode::SUCCESS]);

        $this->getJson('/api/accuses?page=1&pending_only=1')
            ->assertJson(['code' => ResponseCode::SUCCESS]);
    }

    public function test_same_user_cannot_accuse_same_post_twice(): void
    {
        Sanctum::actingAs($this->reporter);

        $this->postJson('/api/accuses', $this->payload())->assertJson(['code' => ResponseCode::SUCCESS]);
        $this->postJson('/api/accuses', $this->payload())->assertJson(['code' => ResponseCode::USER_CANNOT]);

        $this->assertSame(1, Accuse::count());
        $this->assertSame(1, Accuse::first()->reasons()->count());
    }

    public function test_different_users_merge_into_one_pending_accuse_and_reopen_handled_item(): void
    {
        Sanctum::actingAs($this->reporter);
        $this->postJson('/api/accuses', $this->payload())->assertJson(['code' => ResponseCode::SUCCESS]);

        $accuse = Accuse::first();
        $accuse->update([
            'status' => 'handled',
            'handled_by_user_id' => $this->reporter->id,
            'handle_action' => 'ignore',
            'handle_note' => '忽略',
        ]);

        $secondReporter = User::factory()->create(['binggan' => 'second_reporter']);
        Sanctum::actingAs($secondReporter);
        $this->postJson('/api/accuses', $this->payload(['reason' => '第二个用户举报理由']))->assertJson([
            'code' => ResponseCode::SUCCESS,
            'data' => [
                'id' => $accuse->id,
                'status' => 'pending',
            ],
        ]);

        $accuse->refresh();
        $this->assertSame('pending', $accuse->status);
        $this->assertNull($accuse->handled_by_user_id);
        $this->assertSame(2, $accuse->reasons()->count());
    }

    public function test_admin_can_see_counts_and_ignore_accuse(): void
    {
        Sanctum::actingAs($this->reporter);
        $this->postJson('/api/accuses', $this->payload())->assertJson(['code' => ResponseCode::SUCCESS]);

        $admin = User::factory()->admin()->create(['binggan' => 'admin_binggan']);
        $adminPermission = new Admin();
        $adminPermission->user_id = $admin->id;
        $adminPermission->name = '测试管理员';
        $adminPermission->forums = [$this->forum->id];
        $adminPermission->save();

        Sanctum::actingAs($admin, ['forum_admin', 'senior_admin', 'admin']);

        $list = $this->getJson('/api/accuses')->json('data.data.0');
        $this->assertSame(1, $list['target_recent_count']);
        $this->assertSame(1, $list['reasons'][0]['reporter_recent_count']);

        $this->postJson('/api/accuses/' . $list['id'] . '/handle', [
            'action' => 'ignore',
        ])->assertJson([
            'code' => ResponseCode::SUCCESS,
            'data' => [
                'status' => 'handled',
                'handled_by' => '测试管理员',
                'handle_action' => 'ignore',
                'handle_note' => '忽略',
            ],
        ]);
    }

    public function test_admin_delete_action_marks_accuse_handled_after_post_is_deleted(): void
    {
        Sanctum::actingAs($this->reporter);
        $this->postJson('/api/accuses', $this->payload())->assertJson(['code' => ResponseCode::SUCCESS]);

        $admin = User::factory()->admin()->create(['binggan' => 'admin_binggan']);
        $adminPermission = new Admin();
        $adminPermission->user_id = $admin->id;
        $adminPermission->name = '测试管理员';
        $adminPermission->forums = [$this->forum->id];
        $adminPermission->save();

        Sanctum::actingAs($admin, ['forum_admin']);

        $accuse = Accuse::first();
        $this->postJson('/api/accuses/' . $accuse->id . '/handle', [
            'action' => 'delete',
            'reason' => '违反规则删除',
            'reduce_olo' => false,
        ])->assertJson([
            'code' => ResponseCode::SUCCESS,
            'data' => [
                'status' => 'handled',
                'handle_action' => 'delete',
                'handle_note' => '违反规则删除',
            ],
        ]);

        $this->assertSame(2, Post::suffix(intval($this->thread->id / 10000))->find($this->post->id)->is_deleted);
    }

    public function test_store_rejects_post_that_does_not_belong_to_thread(): void
    {
        Sanctum::actingAs($this->reporter);

        $otherThread = new Thread();
        $otherThread->forum_id = $this->forum->id;
        $otherThread->title = '另一个主题';
        $otherThread->sub_title = '[测试]';
        $otherThread->created_binggan = $this->target->binggan;
        $otherThread->save();

        $this->postJson('/api/accuses', $this->payload(['thread_id' => $otherThread->id]))
            ->assertJson(['code' => ResponseCode::PARAM_FAILED]);
    }

    private function payload(array $override = []): array
    {
        return array_merge([
            'thread_id' => $this->thread->id,
            'post_id' => $this->post->id,
            'floor' => $this->post->floor,
            'reason' => '这是一个有效举报理由',
        ], $override);
    }
}
