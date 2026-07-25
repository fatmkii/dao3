<?php

use App\Common\ResponseCode;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\CheckBinggan;
use App\Http\Middleware\RecordPostActivity;
use App\Http\Middleware\ThrottlePost;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Symfony\Component\Routing\Exception\RouteNotFoundException;

$redactedRequestData = static function (Request $request): array {
    $data = $request->all();
    foreach ([
        'registration_device_digest',
        'installation_id',
        'refresh_token',
        'password',
        'password_confirmation',
        'old_password',
        'new_password',
    ] as $key) {
        if (array_key_exists($key, $data)) {
            $data[$key] = '[REDACTED]';
        }
    }

    return $data;
};

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        channels: __DIR__ . '/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'CheckBinggan' => CheckBinggan::class,
            'ThrottlePost' => ThrottlePost::class,
            'RecordPostActivity' => RecordPostActivity::class,
        ]);
        // $middleware->priority([
        //     \Illuminate\Contracts\Auth\Middleware\AuthenticatesRequests::class, //需要先执行过auth，才能在获得$request->user()
        //     \Illuminate\Auth\Middleware\Authorize::class,
        //     \App\Http\Middleware\CheckBinggan::class,
        // ]);
        $middleware->trimStrings(except: [
            //对于创建大喇叭，此处关闭laravel的内置中间件。它会自动trim字符串
            fn (Request $request) => $request->is('api/loudspeaker/create'),
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) use ($redactedRequestData) {

        $exceptions->render(function (RouteNotFoundException $e, Request $request) {
            Log::error('Route not found', [
                'method' => $request->method(),
                'request_url' => $request->url(),
                'request_ip' => $request->ip(),
            ]);
        });

        $exceptions->render(function (QueryException $e, Request $request) use ($redactedRequestData) {
            $error_timestamp = Carbon::now()->toDateTimeString();
            Log::error($e, [
                'request_url' => $request->url(),
                'request_data' => $redactedRequestData($request),
                'request_ip' => $request->ip(),
            ]);
            return response()->json([
                'code' => ResponseCode::DATABASE_FAILED,
                'message' => sprintf('%s，请重试或联络管理员。时间戳:%s', ResponseCode::$codeMap[ResponseCode::DATABASE_FAILED], $error_timestamp),
                'error_message' => $e->getMessage(),
            ]);
        });

        // $exceptions->render(function (AuthenticationException $e, $request) {
        //     return response()->json([
        //         'code' => 401,
        //         'message' => sprintf('饼干认证失败或认证信息已过期，请重新重新导入。'),
        //         'error_message' => $e->getMessage(),
        //     ], 401);
        // });

    })->create();
