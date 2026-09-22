<?php

namespace App\Http\Middleware;

use App\Common\ResponseCode;
use App\Exceptions\SpamDetectedException;
use App\Models\HongbaoPost;
use App\Services\AntiSpamService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ThrottlePost
{
    public function __construct(
        private AntiSpamService $antiSpam
    ) {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user) {
            return $next($request);
        }

        $action = $this->detectAction($request);
        if (! $action) {
            return $next($request);
        }

        $ip = $request->ip();

        try {
            switch ($action) {
                case 'new_post':
                    $reservation = $this->antiSpam->checkPostSpam($ip, $user);
                    try {
                        $response = $next($request);

                        return $response;
                    } finally {
                        $content = isset($response) ? json_decode($response->getContent(), true) : null;
                        $succeeded = $request->attributes->get('anti_spam_post_committed', false)
                            || (is_array($content) && ($content['code'] ?? null) === ResponseCode::SUCCESS);
                        if ($reservation !== null) {
                            $this->antiSpam->finishPostReservation($user, $reservation, $succeeded);
                        }
                        if ($succeeded) {
                            $this->antiSpam->recordPost($ip);
                        }
                    }
                case 'new_thread':
                    $this->antiSpam->checkThreadSpam($user->binggan, $user);
                    break;
                case 'hongbao_store':
                    if ($this->isOwnHongbaoPost($request, $user->id)) {
                        break;
                    }
                    $this->antiSpam->checkHongbaoSpam($ip, $user);
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

    private function isOwnHongbaoPost(Request $request, int $userId): bool
    {
        $hongbaoPostId = $request->input('hongbao_post_id');
        if (! $hongbaoPostId) {
            return false;
        }

        $hongbaoUserId = HongbaoPost::whereKey($hongbaoPostId)->value('user_id');
        $isOwnHongbaoPost = (int) $hongbaoUserId === $userId;
        $request->attributes->set('is_own_hongbao_post', $isOwnHongbaoPost);

        return $isOwnHongbaoPost;
    }
}
