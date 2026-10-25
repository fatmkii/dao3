<?php

namespace App\Http\Controllers\API;

use App\Common\ResponseCode;
use App\Common\WatermarkObfuscator;
use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Thread;
use App\Models\ThreadFirstPostRevision;
use App\Models\User;
use App\Services\ThreadReadAccess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ThreadFirstPostController extends Controller
{
    public function __construct(private ThreadReadAccess $access)
    {
    }

    public function edit(Request $request, int $threadId)
    {
        [$thread, $post] = $this->context($request, $threadId);
        if (! ThreadFirstPostRevision::canEdit($thread, $post, $request->user())) {
            ThreadReadAccess::deny(ResponseCode::POST_UNAUTHORIZED, '只有楼主可以修改未删除的首楼');
        }

        return $this->success($this->contextData($thread, $post, $request));
    }

    public function update(Request $request, int $threadId)
    {
        $input = $request->validate([
            'content' => 'required|string|max:100000',
            'request_id' => 'required|uuid',
        ]);
        $result = DB::transaction(function () use ($request, $threadId, $input) {
            $user = User::whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
            $thread = Thread::whereKey($threadId)->lockForUpdate()->first();
            if (! $thread) {
                ThreadReadAccess::deny(ResponseCode::THREAD_NOT_FOUND);
            }
            $post = $thread->posts()->where('floor', 0)->lockForUpdate()->first();
            if (! $post) {
                ThreadReadAccess::deny(ResponseCode::POST_NOT_FOUND);
            }
            if ($thread->created_binggan !== $user->binggan || $post->created_binggan !== $user->binggan) {
                ThreadReadAccess::deny(ResponseCode::POST_UNAUTHORIZED);
            }
            // Use current reads even when the caller already established a repeatable-read snapshot.
            $previous = ThreadFirstPostRevision::where('thread_id', $threadId)
                ->where('request_id', $input['request_id'])->lockForUpdate()->first();
            if ($previous) {
                if ($previous->content !== $input['content']) {
                    throw ValidationException::withMessages(['request_id' => '同一操作 ID 不能用于不同的正文']);
                }

                return ['thread_id' => $threadId, 'version' => $previous->version];
            }
            $this->access->assertReadable($thread, $user);
            if (! ThreadFirstPostRevision::canEdit($thread, $post, $user)) {
                ThreadReadAccess::deny(ResponseCode::POST_UNAUTHORIZED, '只有楼主可以修改未删除的首楼');
            }
            $version = ThreadFirstPostRevision::where('thread_id', $threadId)
                ->orderByDesc('version')->lockForUpdate()->value('version');
            if ($version === null) {
                ThreadFirstPostRevision::create([
                    'thread_id' => $threadId, 'post_id' => $post->id, 'version' => 0,
                    'content' => $post->getRawOriginal('content'), 'version_at' => $post->created_at,
                ]);
                $version = 0;
            }
            $revision = ThreadFirstPostRevision::create([
                'thread_id' => $threadId, 'post_id' => $post->id, 'version' => $version + 1,
                'content' => $input['content'], 'version_at' => now(), 'request_id' => $input['request_id'],
            ]);
            $post->content = $input['content'];
            $post->save();
            $user->coinChange('normal', [
                'olo' => -ThreadFirstPostRevision::EDIT_COST, 'content' => '修改主题首楼', 'type' => 'default_out',
                'thread_id' => $threadId, 'thread_title' => $thread->title, 'post_id' => $post->id, 'floor' => 0,
            ]);

            return ['thread_id' => $threadId, 'version' => $revision->version];
        }, 3);

        return $this->success($result, '首楼修改成功');
    }

    public function history(Request $request, int $threadId)
    {
        $request->validate(['page' => 'nullable|integer|min:1']);
        [$thread, $post] = $this->context($request, $threadId);
        if (! ThreadFirstPostRevision::canViewHistory($thread, $post, $request->user())) {
            ThreadReadAccess::deny(ResponseCode::POST_UNAUTHORIZED, '首楼已删除，无法查看历史');
        }
        $query = ThreadFirstPostRevision::where('thread_id', $threadId);
        $currentVersion = (clone $query)->max('version');
        $page = (int) $request->input('page', 1);
        if ($currentVersion === null) {
            $versions = $page === 1 ? [[
                'version' => 0, 'content' => $post->getRawOriginal('content'),
                'version_at' => $post->created_at->format('Y-m-d H:i:s'), 'is_current' => true,
            ]] : [];
            $lastPage = 1;
            $total = 1;
        } else {
            $paginator = $query->orderBy('version')->paginate(20);
            $versions = $paginator->getCollection()->map(fn ($revision) => $revision->publicData($currentVersion))->all();
            $lastPage = $paginator->lastPage();
            $total = $paginator->total();
        }
        $data = $this->contextData($thread, $post, $request);
        unset($data['first_post']['content']);
        $data['versions'] = $versions;
        $data['pagination'] = ['currentPage' => $page, 'lastPage' => $lastPage, 'total' => $total];

        return $this->success($data);
    }

    private function context(Request $request, int $threadId): array
    {
        $thread = Thread::find($threadId);
        if (! $thread) {
            ThreadReadAccess::deny(ResponseCode::THREAD_NOT_FOUND);
        }
        $this->access->assertReadable($thread, $request->user());
        $post = $thread->posts()->where('floor', 0)->first();
        if (! $post) {
            ThreadReadAccess::deny(ResponseCode::POST_NOT_FOUND);
        }

        return [$thread, $post];
    }

    private function contextData(Thread $thread, Post $post, Request $request): array
    {
        return [
            'thread_data' => $thread, 'forum_data' => $thread->forum,
            'first_post' => [
                'nickname' => $post->getRawOriginal('nickname'), 'content' => $post->getRawOriginal('content'),
                'random_head' => $post->random_head, 'created_by_admin' => $post->getRawOriginal('created_by_admin'),
                'is_deleted' => $post->is_deleted,
                'created_binggan_hash' => $thread->anti_jingfen ? $post->created_binggan_hash : null,
            ],
            'watermark_string' => (string) WatermarkObfuscator::encode($request->user()->id, $thread->id),
        ];
    }

    private function success(array $data, string $message = '请求成功')
    {
        return response()->json(['code' => ResponseCode::SUCCESS, 'message' => $message, 'data' => $data]);
    }
}
