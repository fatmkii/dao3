<?php

namespace App\Services;

use App\Models\Accuse;
use App\Models\AccuseReason;
use App\Models\AdminActive;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AccuseHandlingService
{
    public function markPendingByAccuseIds(
        array $accuseIds,
        User $admin,
        string $action,
        ?string $note,
        bool $reduceOlo = false
    ): int {
        if (empty($accuseIds)) {
            return 0;
        }

        if ($action === 'ignore') {
            return $this->ignore($accuseIds, $admin, $note);
        }

        return Accuse::whereIn('id', $accuseIds)
            ->where('status', 'pending')
            ->update($this->handledPayload($admin, $action, $note, $reduceOlo));
    }

    public function markPendingByPostIds(
        array $postIds,
        User $admin,
        string $action,
        ?string $note,
        bool $reduceOlo = false
    ): int {
        if (empty($postIds)) {
            return 0;
        }

        return Accuse::whereIn('post_id', $postIds)
            ->where('status', 'pending')
            ->update($this->handledPayload($admin, $action, $note, $reduceOlo));
    }

    public function markPendingByLoudspeakerIds(
        array $loudspeakerIds,
        User $admin,
        string $action,
        ?string $note,
        bool $reduceOlo = false
    ): int {
        if (empty($loudspeakerIds)) {
            return 0;
        }

        return Accuse::whereIn('loudspeaker_id', $loudspeakerIds)
            ->where('status', 'pending')
            ->update($this->handledPayload($admin, $action, $note, $reduceOlo));
    }

    private function handledPayload(User $admin, string $action, ?string $note, bool $reduceOlo): array
    {
        return [
            'status' => 'handled',
            'handled_by_user_id' => $admin->id,
            'handled_at' => Carbon::now(),
            'handle_action' => $action,
            'handle_note' => $note,
            'handle_reduce_olo' => $reduceOlo,
        ];
    }

    private function ignore(array $accuseIds, User $admin, ?string $note): int
    {
        return DB::transaction(function () use ($accuseIds, $admin, $note) {
            $accuses = Accuse::whereIn('id', $accuseIds)->where('status', 'pending')
                ->orderBy('id')->lockForUpdate()->get();
            if ($accuses->isEmpty()) {
                return 0;
            }

            // Keep these as locking reads: the first snapshot read must follow the user locks.
            $reasons = AccuseReason::whereIn('accuse_id', $accuses->modelKeys())
                ->orderBy('id')->lockForUpdate()->get();
            $users = User::whereIn('id', $reasons->pluck('reporter_user_id'))
                ->orderBy('id')->lockForUpdate()->get()->keyBy('id');

            Accuse::whereIn('id', $accuses->modelKeys())
                ->update($this->handledPayload($admin, 'ignore', $note, false));

            foreach ($reasons as $reason) {
                $user = $users->get($reason->reporter_user_id);
                if (! $user) {
                    continue;
                }
                if ($user->is_banned || ($user->locked_until !== null && Carbon::parse($user->locked_until)->gt(Carbon::now()))) {
                    $this->consume([$reason->id]);
                    continue;
                }

                $ids = $this->qualifyingReportIds($reason);
                if (empty($ids)) {
                    continue;
                }

                $lock = app(UserLockService::class)->lock($user);
                $this->consume($ids);
                if ($lock['locked']) {
                    AdminActive::create([
                        'user_id' => 100000,
                        'binggan' => 'system',
                        'name' => '超凡智能',
                        'admin_level' => 0,
                        'active' => '封禁饼干',
                        'active_type' => 'user_lock',
                        'content' => '无效举报1天内达到10次',
                        'olo' => null,
                        'post_id' => null,
                        'thread_id' => null,
                        'thread_title' => null,
                        'floor' => null,
                        'user_id_target' => $user->id,
                        'binggan_target' => $user->binggan,
                    ]);
                }
            }

            return $accuses->count();
        }, 5);
    }

    private function qualifyingReportIds(AccuseReason $newReason): array
    {
        if ($newReason->fresh()->invalid_report_consumed_at !== null) {
            return [];
        }

        $time = $newReason->created_at;
        $reasons = AccuseReason::where('reporter_user_id', $newReason->reporter_user_id)
            ->whereNull('invalid_report_consumed_at')
            ->where('created_at', '>', $time->copy()->subHours(24))
            ->where('created_at', '<', $time->copy()->addHours(24))
            ->whereHas('accuse', fn ($query) => $query->where('status', 'handled')->where('handle_action', 'ignore'))
            ->orderBy('created_at')->orderBy('id')->get();

        $left = 0;
        $newIndex = $reasons->search(fn ($reason) => $reason->id === $newReason->id);
        if ($newIndex === false) {
            return [];
        }
        foreach ($reasons as $right => $reason) {
            while ($reasons[$left]->created_at->lte($reason->created_at->copy()->subHours(24))) {
                $left++;
            }
            if ($right >= $newIndex && $left <= $newIndex && $right - $left + 1 >= 10) {
                return $reasons->slice($left, $right - $left + 1)
                    ->reject(fn ($item) => $item->id === $newReason->id)
                    ->take(9)->pluck('id')->push($newReason->id)->all();
            }
        }

        return [];
    }

    private function consume(array $ids): void
    {
        AccuseReason::whereIn('id', $ids)->update(['invalid_report_consumed_at' => Carbon::now()]);
    }
}
