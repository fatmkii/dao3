<?php

namespace App\Http\Middleware;

use App\Exceptions\SpamDetectedException;
use App\Services\AntiSpamService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ThrottlePost
{
    public function __construct(
        private AntiSpamService $antiSpam
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user) {
            return $next($request);
        }

        $action = $this->detectAction($request);
        if (!$action) {
            return $next($request);
        }

        $ip = $request->ip();

        try {
            switch ($action) {
                case 'new_post':
                    $this->antiSpam->checkPostSpam(
                        $ip,
                        $user,
                        $request->input('thread_id'),
                        $request->input('new_post_key'),
                        $request->input('timestamp')
                    );
                    break;
                case 'new_thread':
                    $this->antiSpam->checkThreadSpam($user->binggan, $user);
                    break;
                case 'hongbao_store':
                    $this->antiSpam->checkHongbaoSpam(
                        $ip,
                        $user,
                        $request->input('thread_id'),
                        $request->input('new_post_key'),
                        $request->input('timestamp')
                    );
                    break;
            }
        } catch (SpamDetectedException $e) {
            return $e->render($request);
        }

        return $next($request);
    }

    private function detectAction(Request $request): ?string
    {
        $path = trim($request->path(), '/');
        $method = $request->method();

        if ($method === 'POST') {
            return match ($path) {
                'api/posts/create' => 'new_post',
                'api/threads/create' => 'new_thread',
                'api/battles' => 'new_post',
                'api/hongbao_post/store' => 'hongbao_store',
                default => null,
            };
        }

        return null;
    }
}
