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
    ) {
    }

    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        $content = json_decode($response->getContent(), true);
        if (! is_array($content) || ($content['code'] ?? null) !== ResponseCode::SUCCESS) {
            return;
        }

        $action = $this->detectAction($request);
        if (! $action) {
            return;
        }

        $ip = $request->ip();
        $user = $request->user();

        switch ($action) {
            case 'new_thread':
                if ($user) {
                    $this->antiSpam->recordThread($user->binggan);
                }
                break;
            case 'hongbao_store':
                if ($request->attributes->get('is_own_hongbao_post') === true) {
                    break;
                }
                $this->antiSpam->recordHongbao($ip);
                break;

        }
    }

    private function detectAction(Request $request): ?string
    {
        $path = trim($request->path(), '/');
        $method = $request->method();

        if ($method === 'POST') {
            return match ($path) {
                'api/threads/create' => 'new_thread',
                'api/hongbao_post/store' => 'hongbao_store',
                default => null,
            };
        }

        return null;
    }
}
