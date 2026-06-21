<?php

namespace App\Http\Controllers\API;

use App\Common\ResponseCode;
use App\Http\Controllers\Controller;
use App\Models\Accuse;
use App\Models\AccuseReason;
use App\Models\Admin;
use App\Models\Loudspeaker;
use App\Models\Post;
use App\Models\Thread;
use App\Models\User;
use App\Services\AccuseHandlingService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

class AccuseController extends Controller
{
    private const DELETED_POST_PENALTY_REDIS_PREFIX = 'deleted_post_penalty_count_';

    public function index(Request $request)
    {
        $request->validate([
            'pending_only' => 'boolean|nullable',
            'my_pending_only' => 'boolean|nullable',
            'page' => 'integer|nullable|min:1',
        ]);

        $adminForumIds = $this->adminForumIds($request->user());
        $canHandleLoudspeaker = $this->canHandleLoudspeaker($request->user());
        $query = Accuse::with(['reasons', 'handledBy.AdminPermissions'])
            ->orderBy('id', 'desc');

        if ($request->boolean('my_pending_only')) {
            $query->where('status', 'pending')
                ->where(function ($query) use ($adminForumIds, $canHandleLoudspeaker) {
                    if (empty($adminForumIds) && !$canHandleLoudspeaker) {
                        $query->whereRaw('0 = 1');
                        return;
                    }

                    if (!empty($adminForumIds)) {
                        $query->where(function ($query) use ($adminForumIds) {
                            $query->where('target_type', 'post')
                                ->whereIn('forum_id', $adminForumIds);
                        });
                    }

                    if ($canHandleLoudspeaker) {
                        $method = empty($adminForumIds) ? 'where' : 'orWhere';
                        $query->{$method}('target_type', 'loudspeaker');
                    }
                });
        } elseif ($request->boolean('pending_only')) {
            $query->where('status', 'pending');
        }

        $total = $query->count();
        $lastPage = max(1, (int) ceil($total / 10));
        $page = min(max((int) $request->query('page', 1), 1), $lastPage);

        $accuses = $query->forPage($page, 10)->get();
        $pendingCount = Accuse::where('status', 'pending')->count();
        $myPendingCount = Accuse::where('status', 'pending')
            ->where(function ($query) use ($adminForumIds, $canHandleLoudspeaker) {
                if (empty($adminForumIds) && !$canHandleLoudspeaker) {
                    $query->whereRaw('0 = 1');
                    return;
                }

                if (!empty($adminForumIds)) {
                    $query->where(function ($query) use ($adminForumIds) {
                        $query->where('target_type', 'post')
                            ->whereIn('forum_id', $adminForumIds);
                    });
                }

                if ($canHandleLoudspeaker) {
                    $method = empty($adminForumIds) ? 'where' : 'orWhere';
                    $query->{$method}('target_type', 'loudspeaker');
                }
            })
            ->count();

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => ResponseCode::$codeMap[ResponseCode::SUCCESS],
            'data' => [
                'data' => $accuses->map(fn (Accuse $accuse) => $this->formatAccuse($accuse, $request->user())),
                'last_page' => $lastPage,
                'pending_count' => $pendingCount,
                'my_pending_count' => $myPendingCount,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'target_type' => 'nullable|string|in:post,loudspeaker',
            'thread_id' => 'required_unless:target_type,loudspeaker|integer|min:1',
            'post_id' => 'required_unless:target_type,loudspeaker|integer|min:1',
            'floor' => 'required_unless:target_type,loudspeaker|integer|min:0',
            'loudspeaker_id' => 'required_if:target_type,loudspeaker|integer|min:1',
            'reason' => 'required|string|min:5|max:500',
        ]);

        if ($request->input('target_type', 'post') === 'loudspeaker') {
            return $this->storeLoudspeakerAccuse($request);
        }

        return $this->storePostAccuse($request);
    }

    private function storePostAccuse(Request $request)
    {
        $thread = Thread::find($request->thread_id);
        if (!$thread || $thread->is_delay == 1 || $thread->is_deleted != 0) {
            return $this->error(ResponseCode::THREAD_NOT_FOUND);
        }

        $post = Post::suffix(intval($request->thread_id / 10000))->find($request->post_id);
        if (!$post || $post->is_deleted == 2) {
            return $this->error(ResponseCode::POST_NOT_FOUND);
        }

        if ($post->thread_id != $thread->id) {
            return $this->error(ResponseCode::PARAM_FAILED, '回复不属于该主题');
        }

        if ((int) $post->floor !== (int) $request->floor) {
            return $this->error(ResponseCode::PARAM_FAILED, '回复楼层不匹配');
        }

        $user = $request->user();
        $targetUserId = User::where('binggan', $post->created_binggan)->value('id');
        $existingAccuse = Accuse::where('post_id', $post->id)->first();
        if ($existingAccuse?->status === 'handled') {
            return $this->error(ResponseCode::USER_CANNOT, '该回复的举报已处理');
        }

        $duplicated = AccuseReason::where('post_id', $post->id)
            ->where('reporter_user_id', $user->id)
            ->exists();

        if ($duplicated) {
            return $this->error(ResponseCode::USER_CANNOT, '你已经举报过这个回复了');
        }

        $accuse = DB::transaction(function () use ($request, $thread, $post, $user, $targetUserId, $existingAccuse) {
            $accuse = $existingAccuse ?: Accuse::create([
                'target_type' => 'post',
                'thread_id' => $thread->id,
                'post_id' => $post->id,
                'forum_id' => $post->forum_id,
                'floor' => $post->floor,
                'target_binggan' => $post->created_binggan,
                'target_user_id' => $targetUserId,
                'thread_title' => $thread->title,
                'status' => 'pending',
                'uncertain' => false,
            ]);

            AccuseReason::create([
                'accuse_id' => $accuse->id,
                'post_id' => $post->id,
                'reporter_user_id' => $user->id,
                'reason' => trim($request->reason),
            ]);

            return $accuse->load(['reasons', 'handledBy.AdminPermissions']);
        });

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '举报已提交',
            'data' => $this->formatAccuse($accuse, $user),
        ]);
    }

    private function storeLoudspeakerAccuse(Request $request)
    {
        $loudspeaker = Loudspeaker::find($request->loudspeaker_id);
        if (!$loudspeaker) {
            return $this->error(ResponseCode::USER_NOT_FOUND, '大喇叭不存在或已失效');
        }

        $user = $request->user();
        $existingAccuse = Accuse::where('loudspeaker_id', $loudspeaker->id)->first();
        if ($existingAccuse?->status === 'handled') {
            return $this->error(ResponseCode::USER_CANNOT, '该大喇叭的举报已处理');
        }

        $duplicated = AccuseReason::where('loudspeaker_id', $loudspeaker->id)
            ->where('reporter_user_id', $user->id)
            ->exists();

        if ($duplicated) {
            return $this->error(ResponseCode::USER_CANNOT, '你已经举报过这个大喇叭了');
        }

        $accuse = DB::transaction(function () use ($request, $loudspeaker, $user, $existingAccuse) {
            $accuse = $existingAccuse ?: Accuse::create([
                'target_type' => 'loudspeaker',
                'thread_id' => $loudspeaker->thread_id ?? 0,
                'post_id' => null,
                'loudspeaker_id' => $loudspeaker->id,
                'forum_id' => 0,
                'floor' => 0,
                'target_binggan' => $loudspeaker->created_binggan,
                'target_user_id' => $loudspeaker->user_id,
                'thread_title' => '',
                'loudspeaker_content' => $loudspeaker->content,
                'loudspeaker_color' => $loudspeaker->color,
                'loudspeaker_thread_id' => $loudspeaker->thread_id,
                'status' => 'pending',
                'uncertain' => false,
            ]);

            AccuseReason::create([
                'accuse_id' => $accuse->id,
                'loudspeaker_id' => $loudspeaker->id,
                'reporter_user_id' => $user->id,
                'reason' => trim($request->reason),
            ]);

            return $accuse->load(['reasons', 'handledBy.AdminPermissions']);
        });

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '举报已提交',
            'data' => $this->formatAccuse($accuse, $user),
        ]);
    }

    public function hint(Request $request, Accuse $accuse)
    {
        if ($accuse->target_type === 'loudspeaker') {
            return $this->error(ResponseCode::ADMIN_UNAUTHORIZED);
        }

        if (!$this->canHint($request->user(), $accuse)) {
            return $this->error(ResponseCode::ADMIN_UNAUTHORIZED);
        }

        $request->merge([
            'thread_id' => $accuse->thread_id,
            'post_id' => $accuse->post_id,
        ]);

        return app(AdminController::class)->check_post($request);
    }

    public function handle(Request $request, Accuse $accuse)
    {
        $request->validate([
            'action' => 'required|string|in:ignore,delete,deleteAll,lock,ban',
            'reason' => 'required_unless:action,ignore|nullable|string|max:255',
            'reduce_olo' => 'boolean|nullable',
        ]);

        if (!$this->canHandle($request->user(), $accuse, $request->action)) {
            return $this->error(ResponseCode::ADMIN_UNAUTHORIZED);
        }

        if ($request->action !== 'ignore') {
            $result = $this->runAdminAction($request, $accuse);
            $payload = $result->getData(true);
            if (($payload['code'] ?? null) !== ResponseCode::SUCCESS) {
                return $result;
            }
        }

        app(AccuseHandlingService::class)->markPendingByAccuseIds(
            [$accuse->id],
            $request->user(),
            $request->action,
            $request->action === 'ignore' ? '忽略' : trim($request->reason),
            in_array($request->action, ['delete', 'deleteAll']) && $request->boolean('reduce_olo')
        );

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '已更新处理状态',
            'data' => $this->formatAccuse($accuse->refresh()->load(['reasons', 'handledBy.AdminPermissions']), $request->user()),
        ]);
    }

    public function uncertain(Request $request, Accuse $accuse)
    {
        $request->validate([
            'uncertain' => 'required|boolean',
        ]);

        if (!$this->canManage($request->user(), $accuse)) {
            return $this->error(ResponseCode::ADMIN_UNAUTHORIZED);
        }

        $accuse->uncertain = $request->boolean('uncertain');
        $accuse->save();

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '已更新标记',
            'data' => $this->formatAccuse($accuse->load(['reasons', 'handledBy.AdminPermissions']), $request->user()),
        ]);
    }

    private function runAdminAction(Request $request, Accuse $accuse)
    {
        if ($accuse->target_type === 'loudspeaker') {
            $request->merge([
                'binggan' => $request->user()->binggan,
                'loudspeaker_id' => $accuse->loudspeaker_id,
                'content' => trim($request->reason),
            ]);
            $request->attributes->set('skip_accuse_auto_handle', true);

            return app(AdminController::class)->del_loudspeaker($request);
        }

        $request->merge([
            'thread_id' => $accuse->thread_id,
            'post_id' => $accuse->post_id,
            'content' => trim($request->reason),
            'reduce_olo' => $request->boolean('reduce_olo'),
        ]);
        $request->attributes->set('skip_accuse_auto_handle', true);

        $controller = app(AdminController::class);

        return match ($request->action) {
            'delete' => $controller->post_delete($request, $accuse->post_id),
            'deleteAll' => $controller->post_delete_all($request),
            'lock' => $controller->user_lock($request),
            'ban' => $controller->user_ban($request),
        };
    }

    private function formatAccuse(Accuse $accuse, $user): array
    {
        $isAdmin = $this->canManage($user, $accuse);

        $data = [
            'id' => $accuse->id,
            'target_type' => $accuse->target_type,
            'thread_id' => $accuse->thread_id,
            'post_id' => $accuse->post_id,
            'loudspeaker_id' => $accuse->loudspeaker_id,
            'forum_id' => $accuse->forum_id,
            'floor' => $accuse->floor,
            'thread_title' => $accuse->thread_title,
            'loudspeaker_content' => $accuse->loudspeaker_content,
            'loudspeaker_color' => $accuse->loudspeaker_color,
            'status' => $accuse->status,
            'created_at' => $accuse->created_at?->format('Y-m-d H:i:s'),
            'reasons' => $accuse->reasons->map(fn (AccuseReason $reason) => [
                'id' => $reason->id,
                'content' => $reason->reason,
                'created_at' => $reason->created_at?->format('Y-m-d H:i:s'),
                'reporter_recent_count' => $isAdmin ? $this->reporterRecentCount($reason->reporter_user_id) : null,
            ])->values(),
            'target_recent_count' => $isAdmin ? $this->targetRecentCount($accuse->target_binggan) : null,
            'target_deleted_post_penalty_count' => $isAdmin ? $this->targetDeletedPostPenaltyCount($accuse->target_user_id) : null,
            'uncertain' => $isAdmin ? $accuse->uncertain : false,
            'handle_reduce_olo' => $isAdmin ? $accuse->handle_reduce_olo : false,
            'can_manage' => $isAdmin,
        ];

        if ($isAdmin) {
            $data['handled_by'] = $accuse->handled_by_user_id ? $this->adminName($accuse->handled_by_user_id) : null;
            $data['handled_at'] = $accuse->handled_at?->format('Y-m-d H:i:s');
            $data['handle_action'] = $accuse->handle_action;
            $data['handle_note'] = $accuse->handle_note;
        }

        return $data;
    }

    private function reporterRecentCount(int $reporterUserId): int
    {
        return AccuseReason::where('reporter_user_id', $reporterUserId)
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->count();
    }

    private function targetRecentCount(?string $targetBinggan): int
    {
        if ($targetBinggan === null) {
            return 0;
        }

        return AccuseReason::whereHas('accuse', fn ($query) => $query->where('target_binggan', $targetBinggan))
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->count();
    }

    private function targetDeletedPostPenaltyCount(?int $targetUserId): int
    {
        if ($targetUserId === null) {
            return 0;
        }

        return (int) (Redis::get(self::DELETED_POST_PENALTY_REDIS_PREFIX . $targetUserId) ?: 0);
    }

    private function adminName(int $userId): string
    {
        return Admin::where('user_id', $userId)->value('name') ?: '管理员';
    }

    private function canHandle($user, Accuse $accuse, string $action): bool
    {
        if ($accuse->target_type === 'loudspeaker') {
            return in_array($action, ['ignore', 'delete'])
                && $this->canHandleLoudspeaker($user);
        }

        if ($action === 'ban') {
            return $this->canAdmin($user, $accuse->forum_id);
        }

        return $this->canForumAdmin($user, $accuse->forum_id);
    }

    private function canHint($user, Accuse $accuse): bool
    {
        if ($accuse->target_type === 'loudspeaker') {
            return false;
        }

        return $user
            && $user->tokenCan('senior_admin')
            && $user->AdminPermissions
            && in_array($accuse->forum_id, $user->AdminPermissions->forums ?? []);
    }

    private function canAdmin($user, int $forumId): bool
    {
        return $user
            && $user->tokenCan('admin')
            && $user->AdminPermissions
            && in_array($forumId, $user->AdminPermissions->forums ?? []);
    }

    private function canForumAdmin($user, int $forumId): bool
    {
        return $user
            && $user->tokenCan('forum_admin')
            && $user->AdminPermissions
            && in_array($forumId, $user->AdminPermissions->forums ?? []);
    }

    private function canHandleLoudspeaker($user): bool
    {
        return $user && $user->tokenCan('admin');
    }

    private function canManage($user, Accuse $accuse): bool
    {
        if ($accuse->target_type === 'loudspeaker') {
            return $this->canHandleLoudspeaker($user);
        }

        return $this->canForumAdmin($user, $accuse->forum_id);
    }

    private function adminForumIds($user): array
    {
        if (!$user || !$user->tokenCan('forum_admin') || !$user->AdminPermissions) {
            return [];
        }

        return $user->AdminPermissions->forums ?? [];
    }

    private function error(int $code, ?string $message = null)
    {
        return response()->json([
            'code' => $code,
            'message' => $message ?: ResponseCode::$codeMap[$code],
        ]);
    }
}
