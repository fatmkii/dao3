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
use Illuminate\Support\Facades\Redis;
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
        Redis::del($this->deletedPostPenaltyKey($this->target));

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

        $this->assertSame($this->target->id, Accuse::first()->target_user_id);

        $list = $this->getJson('/api/accuses')->json('data.data.0');

        $this->assertArrayNotHasKey('handled_by', $list);
        $this->assertArrayNotHasKey('handle_action', $list);
        $this->assertArrayNotHasKey('handle_note', $list);
        $this->assertNull($list['target_recent_count']);
        $this->assertNull($list['target_deleted_post_penalty_count']);
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

    public function test_different_users_merge_into_one_pending_accuse(): void
    {
        Sanctum::actingAs($this->reporter);
        $this->postJson('/api/accuses', $this->payload())->assertJson(['code' => ResponseCode::SUCCESS]);

        $accuse = Accuse::first();
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
        $this->assertSame(2, $accuse->reasons()->count());
    }

    public function test_different_user_cannot_accuse_handled_item_again(): void
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
            'code' => ResponseCode::USER_CANNOT,
            'message' => '该回复的举报已处理',
        ]);

        $accuse->refresh();
        $this->assertSame('handled', $accuse->status);
        $this->assertSame($this->reporter->id, $accuse->handled_by_user_id);
        $this->assertSame(1, $accuse->reasons()->count());
    }

    public function test_same_user_sees_handled_message_when_accuse_was_already_handled(): void
    {
        Sanctum::actingAs($this->reporter);
        $this->postJson('/api/accuses', $this->payload())->assertJson(['code' => ResponseCode::SUCCESS]);

        Accuse::first()->update([
            'status' => 'handled',
            'handled_by_user_id' => $this->reporter->id,
            'handle_action' => 'ignore',
            'handle_note' => '忽略',
        ]);

        $this->postJson('/api/accuses', $this->payload())->assertJson([
            'code' => ResponseCode::USER_CANNOT,
            'message' => '该回复的举报已处理',
        ]);
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
        Redis::setex($this->deletedPostPenaltyKey($this->target), 24 * 3600, 4);

        $list = $this->getJson('/api/accuses')->json('data.data.0');
        $this->assertSame(1, $list['target_recent_count']);
        $this->assertSame(4, $list['target_deleted_post_penalty_count']);
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

    public function test_my_pending_only_returns_only_admin_forums(): void
    {
        Sanctum::actingAs($this->reporter);
        $this->postJson('/api/accuses', $this->payload())->assertJson(['code' => ResponseCode::SUCCESS]);

        $otherForum = Forum::create([
            'name' => '其他板块',
            'description' => 'other forum',
            'status' => 1,
            'accessible_coin' => 0,
        ]);

        $otherThread = new Thread();
        $otherThread->forum_id = $otherForum->id;
        $otherThread->title = '其他主题';
        $otherThread->sub_title = '[测试]';
        $otherThread->is_delay = 0;
        $otherThread->is_deleted = 0;
        $otherThread->is_private = false;
        $otherThread->locked_by_coin = 0;
        $otherThread->created_binggan = $this->target->binggan;
        $otherThread->save();

        $otherPost = Post::withoutEvents(fn () => Post::create([
            'forum_id' => $otherForum->id,
            'thread_id' => $otherThread->id,
            'content' => '其他被举报回复内容',
            'created_binggan' => $this->target->binggan,
        ]));

        $this->postJson('/api/accuses', $this->payload([
            'thread_id' => $otherThread->id,
            'post_id' => $otherPost->id,
            'floor' => $otherPost->floor,
            'reason' => '另一个有效举报理由',
        ]))->assertJson(['code' => ResponseCode::SUCCESS]);

        $admin = User::factory()->admin()->create(['binggan' => 'admin_binggan']);
        $adminPermission = new Admin();
        $adminPermission->user_id = $admin->id;
        $adminPermission->name = '测试管理员';
        $adminPermission->forums = [$this->forum->id];
        $adminPermission->save();

        Sanctum::actingAs($admin, ['forum_admin']);

        $response = $this->getJson('/api/accuses?my_pending_only=1');

        $response->assertJson([
            'code' => ResponseCode::SUCCESS,
            'data' => [
                'pending_count' => 2,
                'my_pending_count' => 1,
            ],
        ]);

        $this->assertCount(1, $response->json('data.data'));
        $this->assertSame($this->forum->id, $response->json('data.data.0.forum_id'));
        $this->assertTrue($response->json('data.data.0.can_manage'));
    }

    public function test_admin_without_forum_permission_sees_user_view_and_cannot_operate(): void
    {
        Sanctum::actingAs($this->reporter);
        $this->postJson('/api/accuses', $this->payload())->assertJson(['code' => ResponseCode::SUCCESS]);

        $otherForum = Forum::create([
            'name' => '无权限板块',
            'description' => 'no permission forum',
            'status' => 1,
            'accessible_coin' => 0,
        ]);

        $admin = User::factory()->admin()->create(['binggan' => 'admin_binggan']);
        $adminPermission = new Admin();
        $adminPermission->user_id = $admin->id;
        $adminPermission->name = '测试管理员';
        $adminPermission->forums = [$otherForum->id];
        $adminPermission->save();

        Sanctum::actingAs($admin, ['forum_admin', 'senior_admin', 'admin']);

        $list = $this->getJson('/api/accuses')->json('data.data.0');

        $this->assertFalse($list['can_manage']);
        $this->assertArrayNotHasKey('handled_by', $list);
        $this->assertArrayNotHasKey('handle_action', $list);
        $this->assertArrayNotHasKey('handle_note', $list);
        $this->assertNull($list['target_recent_count']);
        $this->assertNull($list['target_deleted_post_penalty_count']);
        $this->assertNull($list['reasons'][0]['reporter_recent_count']);

        $this->postJson('/api/accuses/' . $list['id'] . '/handle', [
            'action' => 'ignore',
        ])->assertJson(['code' => ResponseCode::ADMIN_UNAUTHORIZED]);

        $this->putJson('/api/accuses/' . $list['id'] . '/uncertain', [
            'uncertain' => true,
        ])->assertJson(['code' => ResponseCode::ADMIN_UNAUTHORIZED]);

        $this->postJson('/api/accuses/' . $list['id'] . '/hint')
            ->assertJson(['code' => ResponseCode::ADMIN_UNAUTHORIZED]);

        $this->assertSame('pending', Accuse::first()->status);
        $this->assertFalse(Accuse::first()->uncertain);
    }

    public function test_admin_delete_action_marks_accuse_handled_after_post_is_deleted(): void
    {
        Sanctum::actingAs($this->reporter);
        $this->postJson('/api/accuses', $this->payload())->assertJson(['code' => ResponseCode::SUCCESS]);

        $admin = $this->createAdmin();

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

    public function test_direct_admin_post_delete_marks_matching_accuse_handled(): void
    {
        $this->createAccuseForPost($this->post);
        $admin = $this->createAdmin();

        Sanctum::actingAs($admin, ['forum_admin']);

        $this->deleteJson('/api/admin/post_delete/' . $this->post->id, [
            'thread_id' => $this->thread->id,
            'content' => '帖子页直接删帖',
            'reduce_olo' => true,
        ])->assertJson(['code' => ResponseCode::SUCCESS]);

        $this->assertAccuseHandled($this->post->id, $admin, 'delete', '帖子页直接删帖', true);
    }

    public function test_direct_admin_delete_all_marks_only_covered_author_accuses_handled(): void
    {
        $coveredPost = $this->createPost($this->thread, $this->target, '同作者被删全回复');
        $otherTarget = User::factory()->create(['binggan' => 'other_target_binggan']);
        $otherAuthorPost = $this->createPost($this->thread, $otherTarget, '其他作者回复');
        $otherThread = $this->createThread('其他主题');
        $otherThreadPost = $this->createPost($otherThread, $this->target, '其他主题同作者回复');

        foreach ([$this->post, $coveredPost, $otherAuthorPost, $otherThreadPost] as $post) {
            $this->createAccuseForPost($post);
        }

        $admin = $this->createAdmin();
        Sanctum::actingAs($admin, ['forum_admin']);

        $this->postJson('/api/admin/post_delete_all', [
            'thread_id' => $this->thread->id,
            'post_id' => $this->post->id,
            'content' => '帖子页直接删全',
            'reduce_olo' => false,
        ])->assertJson(['code' => ResponseCode::SUCCESS]);

        $this->assertAccuseHandled($this->post->id, $admin, 'deleteAll', '帖子页直接删全', false);
        $this->assertAccuseHandled($coveredPost->id, $admin, 'deleteAll', '帖子页直接删全', false);
        $this->assertSame('pending', Accuse::where('post_id', $otherAuthorPost->id)->first()->status);
        $this->assertSame('pending', Accuse::where('post_id', $otherThreadPost->id)->first()->status);
    }

    public function test_direct_admin_user_lock_marks_matching_accuse_handled(): void
    {
        $this->createAccuseForPost($this->post);
        $admin = $this->createAdmin();

        Sanctum::actingAs($admin, ['forum_admin']);

        $this->postJson('/api/admin/user_lock', [
            'thread_id' => $this->thread->id,
            'post_id' => $this->post->id,
            'content' => '帖子页直接封禁',
        ])->assertJson(['code' => ResponseCode::SUCCESS]);

        $this->assertAccuseHandled($this->post->id, $admin, 'lock', '帖子页直接封禁', false);
    }

    public function test_direct_admin_user_ban_marks_matching_accuse_handled(): void
    {
        $this->createAccuseForPost($this->post);
        $admin = $this->createAdmin();

        Sanctum::actingAs($admin, ['forum_admin', 'admin']);

        $this->postJson('/api/admin/user_ban', [
            'thread_id' => $this->thread->id,
            'post_id' => $this->post->id,
            'content' => '帖子页直接碎饼',
        ])->assertJson(['code' => ResponseCode::SUCCESS]);

        $this->assertAccuseHandled($this->post->id, $admin, 'ban', '帖子页直接碎饼', false);
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

    private function createAdmin(): User
    {
        $admin = User::factory()->admin()->create(['binggan' => 'admin_binggan']);
        $adminPermission = new Admin();
        $adminPermission->user_id = $admin->id;
        $adminPermission->name = '测试管理员';
        $adminPermission->forums = [$this->forum->id];
        $adminPermission->save();

        return $admin;
    }

    private function createThread(string $title): Thread
    {
        $thread = new Thread();
        $thread->forum_id = $this->forum->id;
        $thread->title = $title;
        $thread->sub_title = '[测试]';
        $thread->is_delay = 0;
        $thread->is_deleted = 0;
        $thread->is_private = false;
        $thread->locked_by_coin = 0;
        $thread->created_binggan = $this->target->binggan;
        $thread->save();

        return $thread;
    }

    private function createPost(Thread $thread, User $target, string $content): Post
    {
        return Post::withoutEvents(fn () => Post::create([
            'forum_id' => $thread->forum_id,
            'thread_id' => $thread->id,
            'content' => $content,
            'created_binggan' => $target->binggan,
        ]));
    }

    private function createAccuseForPost(Post $post): void
    {
        Sanctum::actingAs($this->reporter);

        $this->postJson('/api/accuses', [
            'thread_id' => $post->thread_id,
            'post_id' => $post->id,
            'floor' => $post->floor,
            'reason' => '这是一个有效举报理由',
        ])->assertJson(['code' => ResponseCode::SUCCESS]);
    }

    private function assertAccuseHandled(Post|int $post, User $admin, string $action, string $note, bool $reduceOlo): void
    {
        $postId = $post instanceof Post ? $post->id : $post;
        $accuse = Accuse::where('post_id', $postId)->first();

        $this->assertSame('handled', $accuse->status);
        $this->assertSame($admin->id, $accuse->handled_by_user_id);
        $this->assertNotNull($accuse->handled_at);
        $this->assertSame($action, $accuse->handle_action);
        $this->assertSame($note, $accuse->handle_note);
        $this->assertSame($reduceOlo, $accuse->handle_reduce_olo);
    }

    private function deletedPostPenaltyKey(User $user): string
    {
        return 'deleted_post_penalty_count_' . $user->id;
    }
}
