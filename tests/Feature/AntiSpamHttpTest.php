<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Exceptions\SpamDetectedException;
use App\Jobs\ProcessIncomeStatement;
use App\Jobs\ProcessUserActive;
use App\Models\Forum;
use App\Models\Thread;
use App\Models\User;
use App\Services\AntiSpamService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Redis;
use Tests\TestCase;

class AntiSpamHttpTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        // 阻止异步记录任务，避免因 income_statement_2026 / user_actives_2026_5
        // 等分表不存在而导致的数据库错误
        Bus::fake([ProcessIncomeStatement::class, ProcessUserActive::class]);

        // 确保 CheckBinggan middleware 的 Redis::exists 不拦截
        // new_user_{binggan} key 不存在 → 用户已注册超过24小时
        // 如果 Redis 中存在此 key，手动删除（清理上次测试残留）
        Redis::del('new_user_test_binggan');

        $this->user = User::factory()->create([
            'binggan' => 'test_binggan',
            'admin' => 0,
            'is_banned' => false,
            'locked_until' => null,
            'coin' => 100,
        ]);

        $this->actingAs($this->user, 'sanctum');
    }

    /**
     * 为 pass-through 测试准备 Forum 和 Thread 数据
     */
    private function seedForumAndThread(): array
    {
        $forum = Forum::create([
            'name' => '测试板块',
            'description' => 'test forum',
            'status' => 1,
            'accessible_coin' => 0,
        ]);

        $thread = new Thread();
        $thread->forum_id = $forum->id;
        $thread->title = '测试主题';
        $thread->sub_title = '[测试]';
        $thread->is_delay = 0;
        $thread->is_deleted = 0;
        $thread->is_private = false;
        $thread->locked_by_coin = 0;
        $thread->created_binggan = 'test_binggan';
        $thread->save();

        return [$forum, $thread];
    }

    // ============================================
    // POST /api/posts/create 阻断测试
    // ============================================

    public function test_post_create_blocked_by_spam_check(): void
    {
        $antiSpamMock = $this->createMock(AntiSpamService::class);
        $antiSpamMock->expects($this->once())
            ->method('checkPostSpam')
            ->willThrowException(new SpamDetectedException(
                ResponseCode::POST_TOO_MANY,
                ResponseCode::$codeMap[ResponseCode::POST_TOO_MANY] . '为防止刷屏，每1分钟最多回帖10次（含大乱斗）'
            ));
        $this->app->instance(AntiSpamService::class, $antiSpamMock);

        $response = $this->postJson('/api/posts/create', [
            'binggan' => 'test_binggan',
            'forum_id' => 1,
            'thread_id' => 10001,
            'content' => '测试内容',
            'new_post_key' => 'test_key',
            'timestamp' => time(),
        ]);

        $response->assertStatus(200);
        $response->assertJson(['code' => ResponseCode::POST_TOO_MANY]);
        $this->assertStringContainsString('最多回帖10次', $response->json('message'));
    }

    public function test_post_create_blocked_by_ip_limit(): void
    {
        $antiSpamMock = $this->createMock(AntiSpamService::class);
        $antiSpamMock->expects($this->once())
            ->method('checkPostSpam')
            ->willThrowException(new SpamDetectedException(
                ResponseCode::POST_TOO_MANY_MAYBE_ROBOT,
                ResponseCode::$codeMap[ResponseCode::POST_TOO_MANY_MAYBE_ROBOT]
            ));
        $this->app->instance(AntiSpamService::class, $antiSpamMock);

        $response = $this->postJson('/api/posts/create', [
            'binggan' => 'test_binggan',
            'forum_id' => 1,
            'thread_id' => 10001,
            'content' => '测试内容',
            'new_post_key' => 'test_key',
            'timestamp' => time(),
        ]);

        $response->assertJson(['code' => ResponseCode::POST_TOO_MANY_MAYBE_ROBOT]);
    }

    // ============================================
    // POST /api/posts/create 放行测试
    // ============================================

    public function test_post_create_passes_through_to_controller(): void
    {
        list($forum, $thread) = $this->seedForumAndThread();

        $antiSpamMock = $this->createMock(AntiSpamService::class);
        $antiSpamMock->expects($this->once())->method('checkPostSpam');
        $antiSpamMock->expects($this->once())->method('recordPost')->with('127.0.0.1');
        $this->app->instance(AntiSpamService::class, $antiSpamMock);

        $response = $this->postJson('/api/posts/create', [
            'binggan' => 'test_binggan',
            'forum_id' => $forum->id,
            'thread_id' => $thread->id,
            'content' => '测试回帖内容',
            'new_post_key' => md5($thread->id . 'test_binggan' . time() . 'true'),
            'timestamp' => time(),
        ]);

        // 应该返回成功（不是 spam 错误）
        $code = $response->json('code');
        $this->assertNotEquals(ResponseCode::POST_TOO_MANY, $code);
        $this->assertNotEquals(ResponseCode::POST_TOO_MANY_MAYBE_ROBOT, $code);
    }

    // ============================================
    // POST /api/threads/create 阻断测试
    // ============================================

    public function test_thread_create_blocked_by_spam_check(): void
    {
        $antiSpamMock = $this->createMock(AntiSpamService::class);
        $antiSpamMock->expects($this->once())
            ->method('checkThreadSpam')
            ->willThrowException(new SpamDetectedException(
                ResponseCode::THREAD_TOO_MANY,
                ResponseCode::$codeMap[ResponseCode::THREAD_TOO_MANY] . '，你只能在5分钟后再发新主题。'
            ));
        $this->app->instance(AntiSpamService::class, $antiSpamMock);

        $response = $this->postJson('/api/threads/create', [
            'forum_id' => 1,
            'title' => '测试主题标题',
            'content' => '测试主题内容',
            'sub_title' => '[测试]',
            'binggan' => 'test_binggan',
            'new_post_key' => 'test_key',
            'timestamp' => time(),
        ]);

        $response->assertJson(['code' => ResponseCode::THREAD_TOO_MANY]);
        $this->assertStringContainsString('分钟后再发新主题', $response->json('message'));
    }

    // ============================================
    // POST /api/threads/create 放行测试
    // ============================================

    public function test_thread_create_passes_through_to_controller(): void
    {
        Forum::create([
            'name' => '测试板块',
            'description' => 'test forum',
            'status' => 1,
            'accessible_coin' => 0,
        ]);

        $antiSpamMock = $this->createMock(AntiSpamService::class);
        $antiSpamMock->expects($this->once())->method('checkThreadSpam');
        $antiSpamMock->expects($this->once())->method('recordThread')->with('test_binggan');
        $this->app->instance(AntiSpamService::class, $antiSpamMock);

        $response = $this->postJson('/api/threads/create', [
            'forum_id' => 1,
            'title' => '测试主题标题12345',
            'content' => '测试主题内容xxxxx',
            'subtitle' => '[测试]',
            'binggan' => 'test_binggan',
            'new_post_key' => 'test_key',
            'timestamp' => time(),
            'nickname' => '测试昵称',
            'anti_jingfen' => false,
            'nissin_time' => 1,
            'random_heads_group' => 1,
            'post_with_admin' => false,
            'thread_type' => 'normal',
            'is_delay' => false,
            'is_private' => false,
            'can_battle' => true,
        ]);

        $code = $response->json('code');
        $this->assertNotEquals(ResponseCode::THREAD_TOO_MANY, $code);
    }

    // ============================================
    // POST /api/battles 阻断测试
    // ============================================

    public function test_battle_create_blocked_by_spam_check(): void
    {
        $antiSpamMock = $this->createMock(AntiSpamService::class);
        $antiSpamMock->expects($this->once())
            ->method('checkPostSpam')
            ->willThrowException(new SpamDetectedException(
                ResponseCode::POST_TOO_MANY,
                ResponseCode::$codeMap[ResponseCode::POST_TOO_MANY] . '为防止刷屏，每1分钟最多回帖10次（含大乱斗）'
            ));
        $this->app->instance(AntiSpamService::class, $antiSpamMock);

        $response = $this->postJson('/api/battles', [
            'forum_id' => 1,
            'thread_id' => 10001,
            'chara_id' => 1,
            'battle_olo' => 10,
            'chara_group' => 1,
            'new_post_key' => 'test_key',
            'timestamp' => time(),
        ]);

        $response->assertJson(['code' => ResponseCode::POST_TOO_MANY]);
    }

    // ============================================
    // POST /api/hongbao_post/store 阻断测试
    // ============================================

    public function test_hongbao_store_blocked_by_spam_check(): void
    {
        $antiSpamMock = $this->createMock(AntiSpamService::class);
        $antiSpamMock->expects($this->once())
            ->method('checkHongbaoSpam')
            ->willThrowException(new SpamDetectedException(
                ResponseCode::POST_TOO_MANY_MAYBE_ROBOT,
                ResponseCode::$codeMap[ResponseCode::POST_TOO_MANY_MAYBE_ROBOT]
            ));
        $this->app->instance(AntiSpamService::class, $antiSpamMock);

        $response = $this->postJson('/api/hongbao_post/store', [
            'forum_id' => 1,
            'thread_id' => 10001,
            'content' => '新年快乐',
            'new_post_key' => 'test_key',
            'timestamp' => time(),
        ]);

        $response->assertJson(['code' => ResponseCode::POST_TOO_MANY_MAYBE_ROBOT]);
    }

    // ============================================
    // GET /api/posts/{id} 查看清除测试
    // ============================================

    public function test_view_post_triggers_clear(): void
    {
        // 先创建一个帖子（需要 thread 和 forum）
        list($forum, $thread) = $this->seedForumAndThread();

        // Mock 1: 用于发帖请求
        $antiSpamMock = $this->createMock(AntiSpamService::class);
        $antiSpamMock->method('checkPostSpam');
        $antiSpamMock->method('recordPost');
        $antiSpamMock->method('calculateRiskScore');
        $this->app->instance(AntiSpamService::class, $antiSpamMock);

        // 发帖
        $createResponse = $this->postJson('/api/posts/create', [
            'binggan' => 'test_binggan',
            'forum_id' => $forum->id,
            'thread_id' => $thread->id,
            'content' => '测试回帖内容AAAA',
            'new_post_key' => md5($thread->id . 'test_binggan' . time() . 'true'),
            'timestamp' => time(),
        ]);

        $createCode = $createResponse->json('code');
        $this->assertEquals(ResponseCode::SUCCESS, $createCode, 'Post creation should succeed before view test');
        $postId = $createResponse->json('data.post_id');

        // Mock 2: 用于查看请求，验证 clearPostView 被调用
        $antiSpamMock2 = $this->createMock(AntiSpamService::class);
        $antiSpamMock2->method('checkPostSpam');
        $antiSpamMock2->method('recordPost');
        $antiSpamMock2->expects($this->once())
            ->method('clearPostView')
            ->with('127.0.0.1');
        $this->app->instance(AntiSpamService::class, $antiSpamMock2);

        $response = $this->getJson("/api/posts/{$postId}?thread_id={$thread->id}");
    }

    // ============================================
    // RecordPostActivity - 非成功响应不记录
    // ============================================

    public function test_failed_request_does_not_record(): void
    {
        // 不传必填字段 → 验证失败 → 不应该调用 record
        $antiSpamMock = $this->createMock(AntiSpamService::class);
        $antiSpamMock->expects($this->once())->method('checkPostSpam');
        $antiSpamMock->expects($this->never())->method('recordPost');
        $antiSpamMock->expects($this->never())->method('recordThread');
        $antiSpamMock->expects($this->never())->method('clearPostView');
        $this->app->instance(AntiSpamService::class, $antiSpamMock);

        $response = $this->postJson('/api/posts/create', [
            // 缺少 forum_id 等必填字段
            'binggan' => 'test_binggan',
            'new_post_key' => 'test_key',
            'timestamp' => time(),
        ]);

        // 应该返回验证错误（422）
        $response->assertStatus(422);
    }
}
