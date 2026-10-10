<?php

namespace App\Services;

use App\Models\MobileSession;
use App\Models\PostRecording;
use App\Models\Thread;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class PostRecordingService
{
    public function requireAndroid(Request $request): void
    {
        $token = $request->user()?->currentAccessToken();
        abort_unless($token instanceof PersonalAccessToken && $token->client_type === 'android'
            && (! $token->expires_at || $token->expires_at->gt(now()))
            && MobileSession::whereKey($token->mobile_session_id)
                ->where('user_id', $request->user()->id)->whereNull('revoked_at')
                ->where('idle_expires_at', '>', now())->exists(), 403, '录音仅支持 Android App');
    }

    public function requireThread(Request $request): Thread
    {
        $thread = Thread::find($request->thread_id);
        $user = $request->user();
        $forum = $thread?->forum;
        $admin = in_array($user->admin, [99, 20, 10]);
        if (! $thread || ! $forum || $thread->is_delay || $thread->is_deleted
            || ($thread->is_private && $thread->created_binggan !== $user->binggan && $user->admin != 99)
            || (! $admin && $user->getCoin() < max($forum->accessible_coin, $thread->locked_by_coin))
            || ($forum->is_nissin == 1 && $thread->has_nissined && $user->admin != 99)
            || ($forum->is_nissin == 2 && $thread->sub_id == 0 && $thread->nissin_date < now() && $user->admin != 99)) {
            throw ValidationException::withMessages(['thread_id' => '主题不存在或没有回帖权限']);
        }

        return $thread;
    }

    // Caller holds the reply transaction; lock remains held until the post and attachment commit together.
    public function lockAttachment(Request $request): ?PostRecording
    {
        if (! $request->filled('recording_id')) {
            return null;
        }
        $this->requireAndroid($request);
        $recording = PostRecording::whereKey($request->recording_id)->lockForUpdate()->first();
        if (! $recording || $recording->user_id != $request->user()->id
            || $recording->thread_id != $request->thread_id || $recording->status !== 'ready'
            || ! $recording->expires_at || $recording->expires_at->lte(now()) || $recording->post_id !== null) {
            throw ValidationException::withMessages(['recording_id' => '录音不可用，请重新录制']);
        }

        return $recording;
    }
}
