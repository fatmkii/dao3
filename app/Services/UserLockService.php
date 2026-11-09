<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UserLockService
{
    public function __construct(private readonly MobileSessionService $sessions)
    {
    }

    /** @return array{locked: bool, message: string} */
    public function lock(User $user): array
    {
        return DB::transaction(function () use ($user) {
            $user->setRawAttributes(User::whereKey($user->id)->lockForUpdate()->firstOrFail()->getAttributes(), true);

            if ($user->is_banned) {
                return ['locked' => false, 'message' => '该饼干已经被碎过了。'];
            }
            if ($user->locked_until !== null && Carbon::parse($user->locked_until)->gt(Carbon::now())) {
                return ['locked' => false, 'message' => '该饼干已经是封禁状态了。封禁期到：'.$user->locked_until];
            }

            $user->locked_count += 1;
            $user->locked_until = Carbon::now()->addDays(3 * $user->locked_count);
            $user->is_banned = $user->locked_count >= 4;
            $user->save();
            if ($user->is_banned) {
                $this->sessions->revokeAllForUser($user);
            }

            return [
                'locked' => true,
                'message' => $user->is_banned
                    ? '该饼干已被累计封禁4次，已永久碎饼干。'
                    : sprintf('该饼干已封禁%d天。', $user->locked_count * 3),
            ];
        });
    }
}
