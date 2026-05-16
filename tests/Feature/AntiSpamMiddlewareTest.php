<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Exceptions\SpamDetectedException;
use App\Http\Middleware\RecordPostActivity;
use App\Http\Middleware\ThrottlePost;
use App\Models\User;
use App\Services\AntiSpamService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Tests\TestCase;

class AntiSpamMiddlewareTest extends TestCase
{
    private User $user;
    private AntiSpamService $antiSpamMock;

    protected function setUp(): void
    {
        parent::setUp();

        $user = new User();
        $user->binggan = 'test_binggan_abc';
        $user->admin = 0;
        $user->id = 100001;
        $this->user = $user;

        $this->antiSpamMock = $this->createMock(AntiSpamService::class);
    }

    // ============================================
    // ThrottlePost - 路由检测测试
    // ============================================

    public function test_detect_action_new_post_on_posts_create(): void
    {
        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/posts/create', 'POST');
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())
            ->method('checkPostSpam')
            ->with('127.0.0.1', $this->user, null, null, null);

        $middleware->handle($request, fn($req) => new Response('pass'));
    }

    public function test_detect_action_new_post_on_battles(): void
    {
        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/battles', 'POST');
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())
            ->method('checkPostSpam')
            ->with('127.0.0.1', $this->user, null, null, null);

        $middleware->handle($request, fn($req) => new Response('pass'));
    }

    public function test_detect_action_new_thread(): void
    {
        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/threads/create', 'POST');
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())
            ->method('checkThreadSpam')
            ->with('test_binggan_abc', $this->user);

        $middleware->handle($request, fn($req) => new Response('pass'));
    }

    public function test_detect_action_hongbao_store(): void
    {
        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/hongbao_post/store', 'POST');
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())
            ->method('checkHongbaoSpam')
            ->with('127.0.0.1', $this->user, null, null, null);

        $middleware->handle($request, fn($req) => new Response('pass'));
    }

    public function test_unauthenticated_user_passes_through(): void
    {
        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/posts/create', 'POST');
        // 没有设置 user resolver → 未登录

        $this->antiSpamMock->expects($this->never())->method($this->anything());

        $response = $middleware->handle($request, fn($req) => new Response('pass'));
        $this->assertEquals('pass', $response->getContent());
    }

    public function test_unknown_route_passes_through(): void
    {
        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/some/other/route', 'POST');
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->never())->method($this->anything());

        $response = $middleware->handle($request, fn($req) => new Response('pass'));
        $this->assertEquals('pass', $response->getContent());
    }

    // ============================================
    // ThrottlePost - 阻断测试（SpamDetectedException）
    // ============================================

    public function test_throttle_post_blocks_new_post(): void
    {
        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/posts/create', 'POST', [
            'thread_id' => 10001,
            'new_post_key' => 'test_key',
            'timestamp' => time(),
        ]);
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())
            ->method('checkPostSpam')
            ->with('127.0.0.1', $this->user, 10001, 'test_key', $this->anything())
            ->willThrowException(new SpamDetectedException(
                ResponseCode::POST_TOO_MANY,
                ResponseCode::$codeMap[ResponseCode::POST_TOO_MANY] . '为防止刷屏，每1分钟最多回帖10次（含大乱斗）'
            ));

        $response = $middleware->handle($request, fn($req) => $this->fail('不应该进入控制器'));

        $this->assertInstanceOf(JsonResponse::class, $response);
        $content = json_decode($response->getContent());
        $this->assertEquals(ResponseCode::POST_TOO_MANY, $content->code);
        $this->assertStringContainsString('最多回帖10次', $content->message);
    }

    public function test_throttle_post_blocks_new_post_ip_limit(): void
    {
        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/posts/create', 'POST', [
            'thread_id' => 99999,
        ]);
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())
            ->method('checkPostSpam')
            ->willThrowException(new SpamDetectedException(
                ResponseCode::POST_TOO_MANY_MAYBE_ROBOT,
                ResponseCode::$codeMap[ResponseCode::POST_TOO_MANY_MAYBE_ROBOT]
            ));

        $response = $middleware->handle($request, fn($req) => $this->fail('不应该进入控制器'));

        $content = json_decode($response->getContent());
        $this->assertEquals(ResponseCode::POST_TOO_MANY_MAYBE_ROBOT, $content->code);
    }

    public function test_throttle_post_blocks_new_thread(): void
    {
        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/threads/create', 'POST');
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())
            ->method('checkThreadSpam')
            ->willThrowException(new SpamDetectedException(
                ResponseCode::THREAD_TOO_MANY,
                ResponseCode::$codeMap[ResponseCode::THREAD_TOO_MANY] . '，你只能在5分钟后再发新主题。'
            ));

        $response = $middleware->handle($request, fn($req) => $this->fail('不应该进入控制器'));

        $content = json_decode($response->getContent());
        $this->assertEquals(ResponseCode::THREAD_TOO_MANY, $content->code);
        $this->assertStringContainsString('分钟后再发新主题', $content->message);
    }

    public function test_throttle_post_blocks_battle(): void
    {
        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/battles', 'POST', [
            'thread_id' => 10001,
        ]);
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())
            ->method('checkPostSpam')
            ->willThrowException(new SpamDetectedException(
                ResponseCode::POST_TOO_MANY,
                ResponseCode::$codeMap[ResponseCode::POST_TOO_MANY] . '为防止刷屏，每1分钟最多回帖10次（含大乱斗）'
            ));

        $response = $middleware->handle($request, fn($req) => $this->fail('不应该进入控制器'));
        $content = json_decode($response->getContent());
        $this->assertEquals(ResponseCode::POST_TOO_MANY, $content->code);
    }

    public function test_throttle_post_blocks_hongbao_store(): void
    {
        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/hongbao_post/store', 'POST', [
            'thread_id' => 10001,
            'new_post_key' => 'test_key',
            'timestamp' => time(),
        ]);
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())
            ->method('checkHongbaoSpam')
            ->willThrowException(new SpamDetectedException(
                ResponseCode::POST_TOO_MANY_MAYBE_ROBOT,
                ResponseCode::$codeMap[ResponseCode::POST_TOO_MANY_MAYBE_ROBOT]
            ));

        $response = $middleware->handle($request, fn($req) => $this->fail('不应该进入控制器'));
        $content = json_decode($response->getContent());
        $this->assertEquals(ResponseCode::POST_TOO_MANY_MAYBE_ROBOT, $content->code);
    }

    // ============================================
    // ThrottlePost - 放行测试（正常请求）
    // ============================================

    public function test_normal_post_request_passes_through(): void
    {
        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/posts/create', 'POST', [
            'thread_id' => 10001,
            'new_post_key' => 'test_key',
            'timestamp' => time(),
        ]);
        $request->setUserResolver(fn() => $this->user);

        // Mock 不抛异常 = 正常放行
        $this->antiSpamMock->expects($this->once())->method('checkPostSpam');

        $response = $middleware->handle($request, fn($req) => new Response('controller_reached'));
        $this->assertEquals('controller_reached', $response->getContent());
    }

    public function test_normal_thread_request_passes_through(): void
    {
        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/threads/create', 'POST');
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())->method('checkThreadSpam');

        $response = $middleware->handle($request, fn($req) => new Response('controller_reached'));
        $this->assertEquals('controller_reached', $response->getContent());
    }

    public function test_normal_battle_request_passes_through(): void
    {
        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/battles', 'POST', [
            'thread_id' => 10001,
            'new_post_key' => 'test_key',
            'timestamp' => time(),
        ]);
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())->method('checkPostSpam');

        $response = $middleware->handle($request, fn($req) => new Response('controller_reached'));
        $this->assertEquals('controller_reached', $response->getContent());
    }

    public function test_normal_hongbao_store_request_passes_through(): void
    {
        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/hongbao_post/store', 'POST', [
            'thread_id' => 10001,
            'new_post_key' => 'test_key',
            'timestamp' => time(),
        ]);
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())->method('checkHongbaoSpam');

        $response = $middleware->handle($request, fn($req) => new Response('controller_reached'));
        $this->assertEquals('controller_reached', $response->getContent());
    }

    // ============================================
    // ThrottlePost - Admin 绕过测试
    // ============================================

    public function test_admin_99_still_goes_through_middleware(): void
    {
        $adminUser = new User();
        $adminUser->binggan = 'admin_binggan';
        $adminUser->admin = 99;
        $adminUser->id = 100002;

        $middleware = new ThrottlePost($this->antiSpamMock);

        $request = Request::create('/api/posts/create', 'POST', [
            'thread_id' => 10001,
        ]);
        $request->setUserResolver(fn() => $adminUser);

        // Admin 仍然进入中间件（由 AntiSpamService 内部判断是否绕过）
        $this->antiSpamMock->expects($this->once())
            ->method('checkPostSpam')
            ->with('127.0.0.1', $adminUser, 10001, null, null);

        $response = $middleware->handle($request, fn($req) => new Response('controller_reached'));
        $this->assertEquals('controller_reached', $response->getContent());
    }

    // ============================================
    // RecordPostActivity - 路由检测测试
    // ============================================

    public function test_record_detect_action_new_post(): void
    {
        $middleware = new RecordPostActivity($this->antiSpamMock);

        $request = Request::create('/api/posts/create', 'POST');
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())
            ->method('recordPost')
            ->with('127.0.0.1');

        $jsonResponse = new JsonResponse(['code' => 200, 'message' => 'ok']);
        $middleware->terminate($request, $jsonResponse);
    }

    public function test_record_detect_action_view_post(): void
    {
        $middleware = new RecordPostActivity($this->antiSpamMock);

        $request = Request::create('/api/posts/99999', 'GET');
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())
            ->method('clearPostView')
            ->with('127.0.0.1');

        $jsonResponse = new JsonResponse(['code' => 200]);
        $middleware->terminate($request, $jsonResponse);
    }

    public function test_record_detect_action_view_thread(): void
    {
        $middleware = new RecordPostActivity($this->antiSpamMock);

        $request = Request::create('/api/threads/99999', 'GET');
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())
            ->method('clearPostView')
            ->with('127.0.0.1');

        $jsonResponse = new JsonResponse(['code' => 200]);
        $middleware->terminate($request, $jsonResponse);
    }

    public function test_record_detect_action_new_thread(): void
    {
        $middleware = new RecordPostActivity($this->antiSpamMock);

        $request = Request::create('/api/threads/create', 'POST');
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())
            ->method('recordThread')
            ->with('test_binggan_abc');

        $jsonResponse = new JsonResponse(['code' => 200]);
        $middleware->terminate($request, $jsonResponse);
    }

    public function test_record_detect_action_hongbao_store(): void
    {
        $middleware = new RecordPostActivity($this->antiSpamMock);

        $request = Request::create('/api/hongbao_post/store', 'POST');
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())
            ->method('recordHongbao')
            ->with('127.0.0.1');

        $jsonResponse = new JsonResponse(['code' => 200]);
        $middleware->terminate($request, $jsonResponse);
    }

    public function test_record_handle_always_passes_through(): void
    {
        $middleware = new RecordPostActivity($this->antiSpamMock);

        $request = Request::create('/api/posts/create', 'POST');
        $response = $middleware->handle($request, fn($req) => new Response('passthrough'));

        $this->assertEquals('passthrough', $response->getContent());
    }

    // ============================================
    // RecordPostActivity - 响应码过滤测试
    // ============================================

    public function test_record_only_on_success_response(): void
    {
        $middleware = new RecordPostActivity($this->antiSpamMock);

        $request = Request::create('/api/posts/create', 'POST');
        $request->setUserResolver(fn() => $this->user);

        // 非 200 的响应码不应触发记录
        $errorResponse = new JsonResponse(['code' => 29403, 'message' => 'wrong keyword']);

        $this->antiSpamMock->expects($this->never())->method('recordPost');
        $this->antiSpamMock->expects($this->never())->method('recordHongbao');
        $this->antiSpamMock->expects($this->never())->method('recordThread');
        $this->antiSpamMock->expects($this->never())->method('clearPostView');
        $this->antiSpamMock->expects($this->never())->method('calculateRiskScore');

        $middleware->terminate($request, $errorResponse);
    }

    public function test_record_not_called_when_response_not_json(): void
    {
        $middleware = new RecordPostActivity($this->antiSpamMock);

        $request = Request::create('/api/posts/create', 'POST');
        $request->setUserResolver(fn() => $this->user);

        // 非 JSON 响应不应触发记录
        $htmlResponse = new Response('<html></html>', 200);

        $this->antiSpamMock->expects($this->never())->method('recordPost');

        $middleware->terminate($request, $htmlResponse);
    }

    public function test_record_new_post_calls_record_post(): void
    {
        $middleware = new RecordPostActivity($this->antiSpamMock);

        $request = Request::create('/api/posts/create', 'POST', [
            'thread_id' => 10001,
        ]);
        $request->setUserResolver(fn() => $this->user);

        $this->antiSpamMock->expects($this->once())
            ->method('recordPost')
            ->with('127.0.0.1');

        $jsonResponse = new JsonResponse(['code' => 200]);
        $middleware->terminate($request, $jsonResponse);
    }

    // ============================================
    // SpamDetectedException - render 测试
    // ============================================

    public function test_spam_exception_renders_json_response(): void
    {
        $exception = new SpamDetectedException(
            ResponseCode::POST_TOO_MANY,
            '为防止刷屏，每1分钟最多回帖10次（含大乱斗）'
        );

        $request = Request::create('/api/posts/create', 'POST');
        $response = $exception->render($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $content = json_decode($response->getContent());
        $this->assertEquals(ResponseCode::POST_TOO_MANY, $content->code);
        $this->assertStringContainsString('最多回帖10次', $content->message);
    }
}
