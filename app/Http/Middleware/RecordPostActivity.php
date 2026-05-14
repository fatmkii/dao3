<?php

namespace App\Http\Middleware;

use App\Common\ResponseCode;
use App\Services\AntiSpamService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RecordPostActivity
{
    public function __construct(
        private AntiSpamService $antiSpam
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        $content = json_decode($response->getContent(), true);
        if (!is_array($content) || ($content['code'] ?? null) !== ResponseCode::SUCCESS) {
            return;
        }

        $action = $this->detectAction($request);
        if (!$action) {
            return;
        }

        $ip = $request->ip();
        $user = $request->user();

        switch ($action) {
            case 'new_post':
                $this->antiSpam->recordPost($ip);
                if ($user) {
                    $this->antiSpam->calculateRiskScore(
                        $user->binggan,
                        $ip,
                        $request->input('thread_id')
                    );
                }
                break;
            case 'new_thread':
                if ($user) {
                    $this->antiSpam->recordThread($user->binggan);
                }
                break;
            case 'hongbao_store':
                $this->antiSpam->recordHongbao($ip);
                break;
            case 'view_post':
            case 'view_thread':
                if ($user) {
                    $this->antiSpam->clearPostView($ip);
                }
                break;
        }
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

        if ($method === 'GET') {
            if (preg_match('#^api/posts/\d+$#', $path)) {
                return 'view_post';
            }
            if (preg_match('#^api/threads/\d+$#', $path)) {
                return 'view_thread';
            }
        }

        return null;
    }
}
