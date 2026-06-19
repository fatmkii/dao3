<?php

namespace App\Services;

use App\Models\Accuse;
use App\Models\User;
use Carbon\Carbon;

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
}
