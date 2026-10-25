<?php

namespace App\Services;

use App\Common\ResponseCode;
use App\Models\Thread;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Exceptions\HttpResponseException;

class ThreadReadAccess
{
    public function assertReadable(Thread $thread, ?User $user): void
    {
        $forum = $thread->forum;
        if (! $forum) {
            self::deny(ResponseCode::FORUM_NOT_FOUND);
        }
        if ($thread->is_deleted != 0 && $user?->admin != 99) {
            self::deny(ResponseCode::THREAD_NOT_FOUND);
        }
        if (! $forum->is_anonymous && ! $user) {
            self::deny(ResponseCode::USER_NOT_FOUND, '本小岛需要饼干才能查看喔');
        }
        if ($forum->accessible_coin > 0) {
            if (! $user) {
                self::deny(ResponseCode::USER_NOT_FOUND, '本小岛需要饼干才能查看喔');
            }
            if ($user->getCoin() < $forum->accessible_coin && ! in_array($user->admin, [99, 20, 10])) {
                self::deny(ResponseCode::THREAD_UNAUTHORIZED, sprintf('本小岛需要拥有大于%u奥利奥才能查看喔', $forum->accessible_coin));
            }
        }
        if ($thread->locked_by_coin > 0) {
            if (! $user) {
                self::deny(ResponseCode::USER_NOT_FOUND, '本贴需要饼干才能查看喔');
            }
            if ($user->getCoin() < $thread->locked_by_coin && ! in_array($user->admin, [99, 20, 10])) {
                self::deny(ResponseCode::THREAD_UNAUTHORIZED, sprintf('本贴需要拥有大于%u奥利奥才能查看喔', $thread->locked_by_coin));
            }
        }
        if ($thread->is_private) {
            if (! $user) {
                self::deny(ResponseCode::USER_NOT_FOUND, '本贴需要饼干才能查看喔');
            }
            if ($user->binggan != $thread->created_binggan && ! in_array($user->admin, [99, 20])) {
                self::deny(ResponseCode::THREAD_IS_PRIVATE, '本贴是私密主题，只有发帖者可以查看喔');
            }
        }
        $expired = ($forum->is_nissin == 1 && $thread->has_nissined)
            || ($forum->is_nissin == 2 && $thread->nissin_date < Carbon::now() && $thread->sub_id == 0);
        if ($expired && $user?->admin != 99) {
            self::deny(ResponseCode::THREAD_WAS_NISSINED);
        }
    }

    public static function deny(int $code, ?string $message = null): never
    {
        throw new HttpResponseException(response()->json([
            'code' => $code,
            'message' => $message ?? ResponseCode::$codeMap[$code],
        ]));
    }
}
