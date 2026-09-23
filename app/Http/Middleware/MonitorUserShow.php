<?php

namespace App\Http\Middleware;

use App\Common\ResponseCode;
use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class MonitorUserShow
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->isMethod('POST') || ! $request->is('api/user/show')) {
            return $next($request);
        }

        $startedAt = hrtime(true);
        $requestId = $request->header('X-Request-ID');
        $requestId = is_string($requestId) && Str::isUuid($requestId)
            ? $requestId : (string) Str::uuid();
        $request->attributes->set('user_show_request_id', $requestId);

        // Laravel's routing pipeline renders downstream exceptions before returning here.
        $response = $next($request);
        $response->headers->set('X-Request-ID', $requestId);

        try {
            $user = $request->user();
            $token = $user?->currentAccessToken();
            $code = $response instanceof JsonResponse ? $response->getData(true)['code'] ?? null : null;
            $exception = $response->exception ?? null;
            $status = $response->getStatusCode();
            $reason = match (true) {
                $exception instanceof AuthenticationException => 'unauthenticated',
                $status === 422 => 'validation_failed',
                $status >= 500, $exception !== null => 'server_exception',
                $code === ResponseCode::USER_BANNED => 'user_banned',
                $code === ResponseCode::CANNOTLOGIN => 'binggan_mismatch',
                $status === 401 => 'unauthenticated',
                $status === 200 && $code === ResponseCode::SUCCESS => 'success',
                default => 'unexpected_response',
            };

            Log::channel('user_show')->log($reason === 'success' ? 'info' : 'warning', 'user_show_completed', [
                'request_id' => $requestId,
                'user_id' => $user?->getAuthIdentifier(),
                'client_type' => $token instanceof PersonalAccessToken ? ($token->client_type ?? 'unknown') : 'unknown',
                'android_webview' => str_contains($request->userAgent() ?? '', 'CpttmmAndroid'),
                'host' => $request->getHost(),
                'expects_json' => $request->expectsJson(),
                'has_bearer_token' => filled($request->bearerToken()),
                'binggan_matches' => $user && is_string($request->input('binggan'))
                    ? $user->binggan === $request->input('binggan') : null,
                'http_status' => $status,
                'business_code' => $code,
                'reason' => $reason,
                'duration_ms' => round((hrtime(true) - $startedAt) / 1_000_000, 2),
                // Exception messages and traces may contain SQL bindings or credentials.
                'exception_class' => $exception ? get_class($exception) : null,
                'exception_file' => $exception ? str_replace(base_path().'/', '', $exception->getFile()) : null,
                'exception_line' => $exception?->getLine(),
            ]);
        } catch (Throwable) {
            // Diagnostics must not turn a successful API response into a failure.
        }

        return $response;
    }
}
