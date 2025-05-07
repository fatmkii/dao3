<?php

namespace App\Http\Controllers\API;

use App\Common\Medals;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\ResponseCode;
use App\Facades\GlobalSetting;
use App\Jobs\ProcessAdminActive;
// use App\Jobs\ProcessUserActive;
use App\Models\AnnoucementMessages;
use App\Models\Forum;
use App\Models\HongbaoPost;
use App\Models\Loudspeaker;
use App\Models\Post;
use App\Models\Thread;
use App\Models\User;
use App\Models\UserMedal;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function thread_delete(Request $request)
    {
        $request->validate([
            'thread_id' => 'required|integer',
            'content' => 'required|string|max:255'
        ]);

        $user = $request->user();

        $thread = Thread::find($request->thread_id);
        if (!$thread) {
            return response()->json([
                'code' => ResponseCode::THREAD_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::THREAD_NOT_FOUND],
            ]);
        }

        //确认是否拥有该版面的管理员权限
        if (
            !($user->tokenCan('forum_admin') && in_array($thread->forum_id, $user->AdminPermissions->forums))
        ) {
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        }


        $thread->is_deleted = 2;
        $thread->save();

        // $admin_name = $user->tokenCan('admin') ? '管理员' : '专岛管理员';
        // ProcessUserActive::dispatch(
        //     [
        //         'binggan' => $user->binggan,
        //         'user_id' => $user->id,
        //         'active' => $admin_name . '删除了主题',
        //         'thread_id' => $thread->id,
        //         'content' => $request->content,
        //     ]
        // );
        $user_target = User::where('binggan', $thread->created_binggan)->first();
        ProcessAdminActive::dispatch((
            [
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'name' => null, //ProcessAdminActive中会查询并填入
                'admin_level' => $user->admin,
                'active' => '删除主题',
                'active_type' => 'thread_delete',
                'content' => $request->content,
                'olo' => null,
                'post_id' => null,
                'thread_id' => $thread->id,
                'thread_title' => $thread->title,
                'floor' => null,
                'user_id_target' => $user_target->id,
                'binggan_target' => $user_target->binggan,
            ]
        ));

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '该主题已删除。',
            'data' => [
                'thread_id' => $thread->id,
            ],
        ]);
    }

    public function thread_set_top(Request $request)
    {
        $request->validate([
            'thread_id' => 'required|integer',
        ]);

        $user = $request->user();

        $thread = Thread::find($request->thread_id);
        if (!$thread) {
            return response()->json([
                'code' => ResponseCode::THREAD_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::THREAD_NOT_FOUND],
            ]);
        }

        //确认是否拥有该版面的管理员权限
        if (
            !($user->tokenCan('forum_admin') && in_array($thread->forum_id, $user->AdminPermissions->forums))
        ) {
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        }


        $thread->sub_id = 10;
        $thread->save();

        // $admin_name = $user->tokenCan('admin') ? '管理员' : '专岛管理员';
        // ProcessUserActive::dispatch(
        //     [
        //         'binggan' => $user->binggan,
        //         'user_id' => $user->id,
        //         'active' => $admin_name . '置顶了主题',
        //         'thread_id' => $thread->id,
        //     ]
        // );
        $user_target = User::where('binggan', $thread->created_binggan)->first();
        ProcessAdminActive::dispatch((
            [
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'name' => null, //ProcessAdminActive中会查询并填入
                'admin_level' => $user->admin,
                'active' => '置顶主题',
                'active_type' => 'thread_set_top',
                'content' => null,
                'olo' => null,
                'post_id' => null,
                'thread_id' => $thread->id,
                'thread_title' => $thread->title,
                'floor' => null,
                'user_id_target' => $user_target->id,
                'binggan_target' => $user_target->binggan,
            ]
        ));

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '该主题已经置顶',
            'data' => [
                'thread_id' => $thread->id,
            ],
        ]);
    }

    public function thread_cancel_top(Request $request)
    {
        $request->validate([
            'thread_id' => 'required|integer',
        ]);

        $user = $request->user();

        $thread = Thread::find($request->thread_id);
        if (!$thread) {
            return response()->json([
                'code' => ResponseCode::THREAD_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::THREAD_NOT_FOUND],
            ]);
        }

        //确认是否拥有该版面的管理员权限
        if (
            !($user->tokenCan('forum_admin') && in_array($thread->forum_id, $user->AdminPermissions->forums))
        ) {
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        }

        $thread->sub_id = 0;
        $thread->save();

        // $admin_name = $user->tokenCan('admin') ? '管理员' : '专岛管理员';
        // ProcessUserActive::dispatch(
        //     [
        //         'binggan' => $user->binggan,
        //         'user_id' => $user->id,
        //         'active' => $admin_name . '取消了置顶主题',
        //         'thread_id' => $thread->id,
        //     ]
        // );
        $user_target = User::where('binggan', $thread->created_binggan)->first();
        ProcessAdminActive::dispatch((
            [
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'name' => null, //ProcessAdminActive中会查询并填入
                'admin_level' => $user->admin,
                'active' => '撤销置顶主题',
                'active_type' => 'thread_cancel_top',
                'content' => null,
                'olo' => null,
                'post_id' => null,
                'thread_id' => $thread->id,
                'thread_title' => $thread->title,
                'floor' => null,
                'user_id_target' => $user_target->id,
                'binggan_target' => $user_target->binggan,
            ]
        ));
        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '该主题已经取消置顶',
            'data' => [
                'thread_id' => $thread->id,
            ],
        ]);
    }

    public function post_delete(Request $request, $post_id)
    {
        $request->validate([
            'thread_id' => 'required|integer',
            'content' => 'required|string|max:255',
            'reduce_olo' => 'required|boolean'
        ]);

        $user = $request->user();

        $post = Post::suffix(intval($request->thread_id / 10000))->find($post_id);
        if (!$post) {
            return response()->json([
                'code' => ResponseCode::POST_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::POST_NOT_FOUND],
            ]);
        }

        //确认是否已经删除过了
        if ($post->is_deleted != 0) {
            return response()->json([
                'code' => ResponseCode::DEFAULT,
                'message' => '该帖子已经被删除过了',
            ]);
        }

        //确认是否拥有该版面的管理员权限
        if (
            !($user->tokenCan('forum_admin') && in_array($post->forum_id, $user->AdminPermissions->forums))
        ) {
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        }

        $post->is_deleted = 2;
        if ($post->battle_id != null) {
            $post->battle_id = null;
        }
        if ($post->hongbao_id != null) {
            HongbaoPost::where('id', $post->hongbao_id)->update(['deleted_at' => Carbon::now()]);
            $post->hongbao_id = null;
        }
        $post->save();


        $olo_penalty = null;
        if ($request->reduce_olo == True) {
            //扣除被删帖用户的olo 500个
            $olo_penalty = 500; //注意这里是个正数
            $user_to_delete = User::where('binggan', $post->created_binggan)->first();
            if ($user_to_delete) {
                $user_to_delete->coinChange(
                    'normal', //记录类型
                    [
                        'olo' => -$olo_penalty, //注意这里要改为负数（扣olo）
                        'content' => '被管理员删除1个回复并扣除olo',
                        'thread_id' => $post->thread_id,
                        'thread_title' => Thread::where('id', $post->thread_id)->value('title'),
                        'post_id' => $post->id,
                        'floor' => $post->floor,
                        'type' => 'penalty',
                    ],
                    true //$ignore_olo_0 = true，即使用户olo不足也强制扣除
                ); //扣除奥利奥（通过统一接口、记录操作）
            }
        }

        // $admin_name = $user->tokenCan('admin') ? '管理员' : '专岛管理员';
        // ProcessUserActive::dispatch(
        //     [
        //         'binggan' => $user->binggan,
        //         'user_id' => $user->id,
        //         'active' => $admin_name . '删除了帖子',
        //         'thread_id' => $request->thread_id,
        //         'post_id' => $post->id,
        //         'content' => $request->content,
        //     ]
        // );
        $thread = Thread::find($request->thread_id);
        $user_target = User::where('binggan', $post->created_binggan)->first();
        ProcessAdminActive::dispatch((
            [
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'name' => null, //ProcessAdminActive中会查询并填入
                'admin_level' => $user->admin,
                'active' => '删除回帖',
                'active_type' => 'post_delete',
                'content' => $request->content,
                'olo' => -$olo_penalty, //注意这里要改为负数（扣olo）
                'post_id' => $post->id,
                'thread_id' => $thread->id,
                'thread_title' => $thread->title,
                'floor' => $post->floor,
                'user_id_target' => $user_target->id,
                'binggan_target' => $user_target->binggan,
            ]
        ));

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '该帖子已删除。',
            'data' => [
                'post_id' => $post->id,
            ],
        ]);
    }

    public function post_recover(Request $request, $post_id)
    {
        $request->validate([
            'thread_id' => 'required|integer',
            'content' => 'required|string|max:255'
        ]);

        $user = $request->user();

        $post = Post::suffix(intval($request->thread_id / 10000))->find($post_id);
        if (!$post) {
            return response()->json([
                'code' => ResponseCode::POST_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::POST_NOT_FOUND],
            ]);
        }

        //确认是否拥有该版面的管理员权限
        if (
            !($user->tokenCan('forum_admin') && in_array($post->forum_id, $user->AdminPermissions->forums))
        ) {
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        }

        $post->is_deleted = 0;
        $post->save();

        // $admin_name = $user->tokenCan('admin') ? '管理员' : '专岛管理员';
        // ProcessUserActive::dispatch(
        //     [
        //         'binggan' => $user->binggan,
        //         'user_id' => $user->id,
        //         'active' => $admin_name . '恢复了已删除的帖子',
        //         'thread_id' => $request->thread_id,
        //         'post_id' => $post->id,
        //         'content' => $request->content,
        //     ]
        // );

        $thread = Thread::find($request->thread_id);
        $user_target = User::where('binggan', $post->created_binggan)->first();
        ProcessAdminActive::dispatch((
            [
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'name' => null, //ProcessAdminActive中会查询并填入
                'admin_level' => $user->admin,
                'active' => '恢复已删除回帖',
                'active_type' => 'post_recovery',
                'content' => $request->content,
                'olo' =>  null,
                'post_id' => $post->id,
                'thread_id' => $thread->id,
                'thread_title' => $thread->title,
                'floor' => $post->floor,
                'user_id_target' => $user_target->id,
                'binggan_target' => $user_target->binggan,
            ]
        ));

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '该帖子已恢复。',
            'data' => [
                'post_id' => $post->id,
            ],
        ]);
    }


    public function post_delete_all(Request $request)
    {
        $request->validate([
            'post_id' => 'required|Integer',
            'thread_id' => 'required|integer',
            'content' => 'required|string|max:255',
            'reduce_olo' => 'required|boolean'
        ]);

        $user = $request->user();

        $post = Post::suffix(intval($request->thread_id / 10000))->find($request->post_id);
        if (!$post) {
            return response()->json([
                'code' => ResponseCode::POST_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::POST_NOT_FOUND],
            ]);
        }

        //确认是否拥有该版面的管理员权限
        if (
            !($user->tokenCan('forum_admin') && in_array($post->forum_id, $user->AdminPermissions->forums))
        ) {
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        }

        $posts_num = Post::suffix(intval($request->thread_id / 10000))
            ->where('thread_id', $request->thread_id)
            ->where('created_binggan', $post->created_binggan)
            ->where('is_deleted', 0)
            ->count();
        //确认是否已经删除过了
        if ($posts_num == 0) {
            return response()->json([
                'code' => ResponseCode::DEFAULT,
                'message' => '该用户的全部帖子都被删除过了',
            ]);
        }

        // Post::suffix(intval($request->thread_id / 10000))
        //     ->where('thread_id', $request->thread_id)
        //     ->where('created_binggan', $post->created_binggan)
        //     ->where('is_deleted', 0)
        //     ->chunk(5, function ($posts_to_delete) {
        //         foreach ($posts_to_delete as $post_to_delete) {
        //             $post_to_delete->is_deleted = 2;
        //             $post_to_delete->save();
        //         }
        //     });
        Post::suffix(intval($request->thread_id / 10000))
            ->where('thread_id', $request->thread_id)
            ->where('created_binggan', $post->created_binggan)
            ->where('is_deleted', 0)
            ->update(['is_deleted' => 2]);

        $olo_penalty = null;
        if ($request->reduce_olo == True) {
            //扣除被删帖用户的olo 500个/每个帖子（上限5000）
            $olo_penalty = $posts_num >= 10 ? 5000 : $posts_num * 500; //注意这里是个正数
            $user_to_delete_all = User::where('binggan', $post->created_binggan)->first();
            if ($user_to_delete_all) {
                $user_to_delete_all->coinChange(
                    'normal', //记录类型
                    [
                        'olo' => -$olo_penalty, //注意这里要改为负数（扣olo）
                        'content' => sprintf('被管理员删除%d个回复并扣除olo', $posts_num),
                        'thread_id' => $post->thread_id,
                        'thread_title' => Thread::where('id', $post->thread_id)->value('title'),
                        'post_id' => $post->id,
                        'floor' => $post->floor,
                        'type' => 'penalty',
                    ],
                    true //$ignore_olo_0 = true，即使用户olo不足也强制扣除
                ); //扣除奥利奥（通过统一接口、记录操作）
            }
        }

        // $admin_name = $user->tokenCan('admin') ? '管理员' : '专岛管理员';
        // ProcessUserActive::dispatch(
        //     [
        //         'binggan' => $user->binggan,
        //         'user_id' => $user->id,
        //         'active' => $admin_name . '删除该用户全部的回帖',
        //         'thread_id' => $request->thread_id,
        //         'binggan_target' => $post->created_binggan,
        //         'content' => $request->content,
        //     ]
        // );

        $thread = Thread::find($request->thread_id);
        $user_target = User::where('binggan', $post->created_binggan)->first();
        ProcessAdminActive::dispatch((
            [
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'name' => null, //ProcessAdminActive中会查询并填入
                'admin_level' => $user->admin,
                'active' => sprintf('删除该用户全部回帖(%d个)', $posts_num),
                'active_type' => 'post_delete_all',
                'content' => $request->content,
                'olo' =>  -$olo_penalty, //注意这里要改为负数（扣olo）
                'post_id' => $post->id,
                'thread_id' => $thread->id,
                'thread_title' => $thread->title,
                'floor' => $post->floor,
                'user_id_target' => $user_target->id,
                'binggan_target' => $user_target->binggan,
            ]
        ));

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' =>  sprintf('该作者全部帖子已删除。一共有%d个帖子', $posts_num),
        ]);
    }

    public function user_ban(Request $request)
    {
        $request->validate([
            'post_id' => 'required|Integer',
            'thread_id' => 'required|integer',
            'content' => 'required|string|max:255'
        ]);

        $user = $request->user();

        $post = Post::suffix(intval($request->thread_id / 10000))->find($request->post_id);
        if (!$post) {
            return response()->json([
                'code' => ResponseCode::POST_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::POST_NOT_FOUND],
            ]);
        }

        //确认是否拥有该版面的管理员权限
        if (
            !($user->tokenCan('admin') && in_array($post->forum_id, $user->AdminPermissions->forums))
        ) {
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        }

        $user_to_ban = User::where('binggan', $post->created_binggan)->first();
        if (!$user_to_ban) {
            return response()->json([
                'code' => ResponseCode::USER_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_NOT_FOUND],
            ]);
        }

        if ($user_to_ban->is_banned) {
            return response()->json([
                'code' => ResponseCode::DEFAULT,
                'message' => '该饼干已经被碎过了。',
            ]);
        }

        $user_to_ban->is_banned = true;
        $user_to_ban->save();

        // $admin_name = $user->tokenCan('admin') ? '管理员' : '专岛管理员';
        // ProcessUserActive::dispatch(
        //     [
        //         'binggan' => $user->binggan,
        //         'user_id' => $user->id,
        //         'active' => $admin_name . '碎了饼干',
        //         'thread_id' => $request->thread_id,
        //         'post_id' => $request->post_id,
        //         'binggan_target' => $user_to_ban->binggan,
        //         'content' => $request->content,
        //     ]
        // );

        $thread = Thread::find($request->thread_id);
        $user_target = $user_to_ban;
        ProcessAdminActive::dispatch((
            [
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'name' => null, //ProcessAdminActive中会查询并填入
                'admin_level' => $user->admin,
                'active' => '碎饼干',
                'active_type' => 'user_ban',
                'content' => $request->content,
                'olo' =>  null,
                'post_id' => $post->id,
                'thread_id' => $thread->id,
                'thread_title' => $thread->title,
                'floor' => $post->floor,
                'user_id_target' => $user_target->id,
                'binggan_target' => $user_target->binggan,
            ]
        ));

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '已碎饼干。阿弥陀佛，善哉善哉。',
        ]);
    }

    public function user_lock(Request $request)
    {
        $request->validate([
            'post_id' => 'required|Integer',
            'thread_id' => 'required|integer',
            'content' => 'required|string|max:255'
        ]);

        $user = $request->user();

        $post = Post::suffix(intval($request->thread_id / 10000))->find($request->post_id);
        if (!$post) {
            return response()->json([
                'code' => ResponseCode::POST_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::POST_NOT_FOUND],
            ]);
        }

        //确认是否拥有该版面的管理员权限
        if (
            !($user->tokenCan('forum_admin') && in_array($post->forum_id, $user->AdminPermissions->forums))
        ) {
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        }

        $user_to_lock = User::where('binggan', $post->created_binggan)->first();
        if (!$user_to_lock) {
            return response()->json([
                'code' => ResponseCode::USER_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_NOT_FOUND],
            ]);
        }

        if ($user_to_lock->is_banned) {
            return response()->json([
                'code' => ResponseCode::DEFAULT,
                'message' => '该饼干已经被碎过了。',
            ]);
        }

        if ($user_to_lock->locked_until != null && $user_to_lock->locked_until > Carbon::now()) {
            return response()->json([
                'code' => ResponseCode::DEFAULT,
                'message' => '该饼干已经是封禁状态了。封禁期到：' . $user_to_lock->locked_until,
            ]);
        }

        // $user_to_lock->locked_until = Carbon::now()->addDays(3);
        $user_to_lock->locked_count += 1;
        $user_to_lock->locked_until = Carbon::now()->addDays(3 * $user_to_lock->locked_count); //每封禁一次，多3天
        if ($user_to_lock->locked_count >= 4) {
            //如果被锁定超过3次（≥4），则碎饼干
            $user_to_lock->is_banned = true;
            $msg = '该饼干已被累计封禁4次，已永久碎饼干。';
        } else {
            $msg = sprintf('该饼干已封禁%d天。', $user_to_lock->locked_count * 3);
        }
        $user_to_lock->save();

        // $admin_name = $user->tokenCan('admin') ? '管理员' : '专岛管理员';
        // ProcessUserActive::dispatch(
        //     [
        //         'binggan' => $user->binggan,
        //         'user_id' => $user->id,
        //         'active' => $admin_name . '封禁了饼干',
        //         'thread_id' => $request->thread_id,
        //         'post_id' => $request->post_id,
        //         'binggan_target' => $user_to_lock->binggan,
        //         'content' => $request->content,
        //     ]
        // );

        $thread = Thread::find($request->thread_id);
        $user_target = $user_to_lock;
        ProcessAdminActive::dispatch((
            [
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'name' => null, //ProcessAdminActive中会查询并填入
                'admin_level' => $user->admin,
                'active' => '封禁饼干',
                'active_type' => 'user_lock',
                'content' => $request->content,
                'olo' =>  null,
                'post_id' => $post->id,
                'thread_id' => $thread->id,
                'thread_title' => $thread->title,
                'floor' => $post->floor,
                'user_id_target' => $user_target->id,
                'binggan_target' => $user_target->binggan,
            ]
        ));

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => $msg,
        ]);
    }

    public function set_banner(Request $request)
    {
        $request->validate([
            'forum_id' => 'required|Integer',
            'banners' => 'required|array|max:5000',
        ]);

        $user = $request->user();

        $forum = Forum::find($request->forum_id);
        if (!$forum) {
            return response()->json([
                'code' => ResponseCode::FORUM_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::FORUM_NOT_FOUND],
            ]);
        }

        //确认是否拥有该版面的管理员权限
        if (
            !($user->tokenCan('forum_admin') && in_array($forum->id, $user->AdminPermissions->forums))
        ) {
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        }

        try {
            DB::beginTransaction();
            $forum->banners = $request->banners;
            $forum->save();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        //要清除板块的缓存
        Cache::forget('forums_cache');

        // $admin_name = $user->tokenCan('admin') ? '管理员' : '专岛管理员';
        // ProcessUserActive::dispatch(
        //     [
        //         'binggan' => $user->binggan,
        //         'user_id' => $user->id,
        //         'active' => $admin_name . '更新了版头。板块：' . $request->forum_id,
        //         'content' => '版头字符串长度：' . mb_strlen(json_encode($request->banners)),
        //     ]
        // );

        ProcessAdminActive::dispatch((
            [
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'name' => null, //ProcessAdminActive中会查询并填入
                'admin_level' => $user->admin,
                'active' => '更换版头：' . $forum->name,
                'active_type' => 'set_banner',
                'content' => '版头字符串长度：' . mb_strlen(json_encode($request->banners)),
                'olo' =>  null,
                'post_id' => null,
                'thread_id' => null,
                'thread_title' => null,
                'floor' => null,
                'user_id_target' => null,
                'binggan_target' => null,
            ]
        ));

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '更新版头成功！',
        ]);
    }

    public function check_post(Request $request)
    {
        $request->validate([
            'thread_id' => 'required|Integer',
            'post_id' => 'required|Integer',
        ]);

        $user = $request->user();

        $post = Post::suffix(intval($request->thread_id / 10000))->find($request->post_id);
        if (!$post) {
            return response()->json([
                'code' => ResponseCode::POST_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::POST_NOT_FOUND],
            ]);
        }

        //确认是否拥有该版面的管理员权限
        if (
            !($user->tokenCan('senior_admin') && in_array($post->forum_id, $user->AdminPermissions->forums))
        ) {
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        }

        $user_target = User::where('binggan', $post->created_binggan)->first();
        if (!$user_target) {
            return response()->json([
                'code' => ResponseCode::USER_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_NOT_FOUND],
            ]);
        }

        $user_status = "";
        if ($user_target->is_banned) {
            $user_status = '已被碎了';
        } else {
            if ($user_target->locked_until) {
                if (Carbon::parse($user_target->locked_until) > Carbon::now()) {
                    $user_status = '被封禁至' . $user_target->locked_until;
                } else {
                    $user_status = '状态正常';
                }
            } else {
                $user_status = '状态正常';
            }
        }

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '已经查到用户信息',
            'data' => [
                'locked_count' => $user_target->locked_count,
                'user_status' => $user_status,
            ]
        ]);
    }

    //超管发放成就
    public function create_medal(Request $request)
    {
        // 手动给用户发送成就（超管功能）
        $request->validate([
            'binggan_target' => 'required|string',
            'medal_id' => 'required|Integer',
        ]);

        $user = $request->user();

        $user_target = User::where('binggan', $request->binggan_target)->first();
        if (!$user_target) {
            return response()->json([
                'code' => ResponseCode::USER_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_NOT_FOUND],
            ]);
        }

        //确认是否超管
        if (!$user->tokenCan('super_admin')) {
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        }

        if (!array_key_exists($request->medal_id, Medals::DATA)) {
            return response()->json(
                [
                    'code' => ResponseCode::DEFAULT,
                    'message' => '此成就id不存在',
                ],
            );
        }

        if ($user_target->UserMedal()->where('medal_id', $request->medal_id)->exists()) {
            return response()->json(
                [
                    'code' => ResponseCode::DEFAULT,
                    'message' => '该用户已经拥有此成就',
                ],
            );
        }

        $user_medal = new UserMedal;
        $user_medal->user_id = $user_target->id;
        $user_medal->medal_id = $request->medal_id;
        $user_medal->created_at = Carbon::now();
        $user_medal->save();

        ProcessAdminActive::dispatch((
            [
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'name' => null, //ProcessAdminActive中会查询并填入
                'admin_level' => $user->admin,
                'active' => '发放成就',
                'active_type' => 'create_medal',
                'content' => '成就ID:' . $request->medal_id,
                'olo' =>  null,
                'post_id' => null,
                'thread_id' => null,
                'thread_title' => null,
                'floor' => null,
                'user_id_target' => $user_target->id,
                'binggan_target' => $user_target->binggan,
            ]
        ));

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '已为用户追加此成就',
        ]);
    }

    //超管奖罚olo
    public function set_user_olo(Request $request)
    {
        // 手动给用户发送成就（超管功能）
        $request->validate([
            'binggan_target' => 'required|string',
            'olo_num' => 'required|Integer',
            'olo_message' => 'required|string',
        ]);

        $user = $request->user();

        $user_target = User::where('binggan', $request->binggan_target)->first();
        if (!$user_target) {
            return response()->json([
                'code' => ResponseCode::USER_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_NOT_FOUND],
            ]);
        }

        //确认是否超管
        if (!$user->tokenCan('super_admin')) {
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        }

        $user_target->coinChange(
            'normal', //记录类型
            [
                'olo' => $request->olo_num,
                'content' => $request->olo_message,
                'type' => $request->olo_num > 0 ? 'default_in' : 'default_out',
            ],
            true //$ignore_olo_0 = true，即使用户olo不足也强制扣除
        ); //扣除奥利奥（通过统一接口、记录操作）
        $user->save();

        ProcessAdminActive::dispatch((
            [
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'name' => null, //ProcessAdminActive中会查询并填入
                'admin_level' => $user->admin,
                'active' => '奖罚olo',
                'active_type' => 'set_user_olo',
                'content' => $request->olo_message,
                'olo' =>  $request->olo_num,
                'post_id' => null,
                'thread_id' => null,
                'thread_title' => null,
                'floor' => null,
                'user_id_target' => $user_target->id,
                'binggan_target' => $user_target->binggan,
            ]
        ));

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => sprintf("已%s该饼干%d个olo", $request->olo_num > 0 ? '奖励' : '扣除', $request->olo_num),
        ]);
    }

    //获取全局变量
    public function get_global_setting(Request $request, $key = null)
    {
        $request->validate([
            'key' => 'nullable|string',
        ]);

        $user = $request->user();

        //确认是否超管
        if (!$user->tokenCan('super_admin')) {
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        }

        if ($key) {
            $value = GlobalSetting::get($key);
        } else {
            $value = GlobalSetting::get_all();
        }

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '成功获取全局变量',
            'data' => $value
        ]);
    }

    //超管设置全局变量
    public function set_global_setting(Request $request)
    {
        // 手动给用户发送成就（超管功能）
        $request->validate([
            'key' => 'required|string',
            'value' => 'required|json',
        ]);

        $user = $request->user();

        //确认是否超管
        if (!$user->tokenCan('super_admin')) {
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        }

        GlobalSetting::set($request->key, $request->value);

        ProcessAdminActive::dispatch((
            [
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'name' => null, //ProcessAdminActive中会查询并填入
                'admin_level' => $user->admin,
                'active' => '设置全局变量',
                'active_type' => 'set_global_setting',
                'content' =>  $request->key . ' -> ' . $request->value,
                'olo' =>  null,
                'post_id' => null,
                'thread_id' => null,
                'thread_title' => null,
                'floor' => null,
                'user_id_target' => null,
                'binggan_target' => null,
            ]
        ));

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '已成功设定全局变量',
        ]);
    }

    //管理员删除大喇叭
    public function del_loudspeaker(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'loudspeaker_id' => 'required|integer',
        ]);


        $user = $request->user();
        $loudspeaker = Loudspeaker::find($request->loudspeaker_id);

        if (!$loudspeaker) {
            return response()->json([
                'code' => ResponseCode::USER_NOT_FOUND,
                'message' => '大喇叭不存在或已失效',
            ]);
        }

        if (!$user->tokenCan('admin')) {
            return response()->json([
                'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
            ]);
        }

        try {
            DB::beginTransaction();

            $loudspeaker->delete();

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        ProcessAdminActive::dispatch((
            [
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'name' => null, //ProcessAdminActive中会查询并填入
                'admin_level' => $user->admin,
                'active' => '删除大喇叭',
                'active_type' => 'del_loudspeaker',
                'content' => '大喇叭内容：' . $loudspeaker->content,
                'olo' =>  null,
                'post_id' => null,
                'thread_id' => null,
                'thread_title' => null,
                'floor' => null,
                'user_id_target' => null,
                'binggan_target' => null,
            ]
        ));

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已强制删除该大喇叭',
                'data' => $loudspeaker,
            ]
        );
    }

    //超管解锁UUID
    public function unlock_uuid(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'uuid' => 'required|string',
        ]);

        $user = $request->user();

        $uuid_exist = DB::table('user_register')->where('created_UUID', $request->uuid)->exists();
        if (!$uuid_exist) {
            return response()->json([
                'code' => ResponseCode::USER_NOT_FOUND,
                'message' => '该UUID不存在',
            ]);
        }

        if (!$user->tokenCan('super_admin')) {
            return response()->json([
                'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
            ]);
        }

        try {
            DB::beginTransaction();

            DB::table('user_register')
                ->where('created_UUID', $request->uuid)
                ->update([
                    'count' => 3,
                    'is_banned' => false,
                ]);

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        ProcessAdminActive::dispatch((
            [
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'name' => null, //ProcessAdminActive中会查询并填入
                'admin_level' => $user->admin,
                'active' => '解锁uuid',
                'active_type' => 'unlock_uuid',
                'content' => 'uuid: ' . $request->uuid,
                'olo' =>  null,
                'post_id' => null,
                'thread_id' => null,
                'thread_title' => null,
                'floor' => null,
                'user_id_target' => null,
                'binggan_target' => null,
            ]
        ));

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已解锁该uuid',
                'data' => [
                    'uuid' => $request->uuid,
                ],
            ]
        );
    }

    //超管帖子转区
    public function transfer_thread(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'thread_id' => 'required|integer',
            'forum_id' => 'required|integer',
            'nissin_clear' => 'required|boolean',
        ]);

        $user = $request->user();

        if (!$user->tokenCan('super_admin')) {
            return response()->json([
                'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
            ]);
        }

        $thread = Thread::find($request->thread_id);
        if (!$thread) {
            return response()->json([
                'code' => ResponseCode::THREAD_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::THREAD_NOT_FOUND],
            ]);
        }

        $forum = Forum::find($request->forum_id);
        if (!$forum) {
            return response()->json([
                'code' => ResponseCode::FORUM_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::FORUM_NOT_FOUND],
            ]);
        }

        try {
            DB::beginTransaction();

            $thread->forum_id = $request->forum_id;
            if ($request->nissin_clear) {
                $thread->has_nissined = false;
            }
            $thread->save();

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        ProcessAdminActive::dispatch((
            [
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'name' => null, //ProcessAdminActive中会查询并填入
                'admin_level' => $user->admin,
                'active' => '主题转区',
                'active_type' => 'transfer_thread',
                'content' => null,
                'olo' =>  null,
                'post_id' => null,
                'thread_id' => $thread->id,
                'thread_title' => $thread->title,
                'floor' => null,
                'user_id_target' => null,
                'binggan_target' => null,
            ]
        ));

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已将该主题转区',
                'data' => [
                    'thread_id' => $request->thread_id,
                ],
            ]
        );
    }


    //已废弃
    // public function check_user_post(Request $request)
    // {
    //     $request->validate([
    //         'binggan' => 'required_without:IP|string',
    //         'IP' => 'required_without:binggan|ipv4',
    //         'page' => 'required|integer',
    //         'database_post_num' => 'required|integer',
    //     ]);

    //     //根据饼干查询发帖记录
    //     if ($request->query('binggan') != null) {
    //         $user_to_check = User::where('binggan', $request->query('binggan'))->first();
    //         if (!$user_to_check) {
    //             return response()->json([
    //                 'code' => ResponseCode::USER_NOT_FOUND,
    //                 'message' => ResponseCode::$codeMap[ResponseCode::USER_NOT_FOUND],
    //             ]);
    //         }
    //         $posts = Post::suffix($request->query('database_post_num'))
    //             ->where('created_binggan', $request->query('binggan'))->paginate(200);
    //     }
    //     //根据IP查询发帖记录
    //     if ($request->query('IP') != null) {
    //         $posts = Post::suffix($request->query('database_post_num'))
    //             ->where('created_IP', $request->query('IP'))->paginate(200);
    //     }

    //     $posts->makeVisible('created_IP');
    //     $posts->makeVisible('created_binggan');

    //     return response()->json([
    //         'code' => ResponseCode::SUCCESS,
    //         'posts_data' => $posts,
    //     ]);
    // }

    //暂停使用
    // public function check_jingfen(Request $request)
    // {
    //     $request->validate([
    //         'thread_id' => 'required|integer',
    //         'content' => 'required|string',
    //     ]);

    //     $CurrentThread = Thread::find($request->thread_id);
    //     if (!$CurrentThread) {
    //         return response()->json([
    //             'code' => ResponseCode::THREAD_NOT_FOUND,
    //             'message' => ResponseCode::$codeMap[ResponseCode::THREAD_NOT_FOUND],
    //         ]);
    //     }

    //     //确认是否拥有该版面的管理员权限
    //     $user = $request->user();
    //     if (
    //         !in_array($CurrentThread->forum_id, $user->AdminPermissions->forums)
    //     ) {
    //         return response()->json(
    //             [
    //                 'code' => ResponseCode::ADMIN_UNAUTHORIZED,
    //                 'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
    //             ],
    //         );
    //     }

    //     $posts = $CurrentThread->posts()->orderBy('id', 'asc')->paginate(200);

    //     //为管理员加上created_binggan_hash
    //     $posts->append('created_binggan_hash');


    //     //临时打开主题的反精分标签
    //     $CurrentThread->anti_jingfen = 1;

    //     ProcessUserActive::dispatch(
    //         [
    //             'binggan' => $user->binggan,
    //             'user_id' => $user->id,
    //             'active' => '管理员查看了反精分',
    //             'thread_id' => $request->thread_id,
    //             'content' => $request->content,
    //         ]
    //     );

    //     return response()->json([
    //         'code' => ResponseCode::SUCCESS,
    //         // 'forum_data' => $CurrentForum,
    //         'thread_data' => $CurrentThread,
    //         'posts_data' => $posts,
    //         // 'random_heads' => $random_heads,
    //     ]);
    // }

    // public function create_annoucement(Request $request)
    // {
    //     $request->validate([
    //         'binggan' => 'required|string',
    //         'type' => 'required|integer',
    //         'title' => 'required|string',
    //         'sub_title' => 'required|string',
    //         'content' => 'required|string|max:20000',
    //         'to_new_users' => 'required|boolean',
    //     ]);

    //     $user = $request->user();


    //     //确认是否拥有该版面的管理员权限
    //     if (
    //         !$user->tokenCan('admin')
    //     ) {
    //         return response()->json(
    //             [
    //                 'code' => ResponseCode::ADMIN_UNAUTHORIZED,
    //                 'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
    //             ],
    //         );
    //     }

    //     //执行追加新回复流程
    //     try {
    //         DB::beginTransaction();
    //         $annoucement_message = new AnnoucementMessages();
    //         $annoucement_message->sender_id = $user->id;
    //         $annoucement_message->type = $request->type;
    //         $annoucement_message->title = $request->title;
    //         $annoucement_message->sub_title = $request->sub_title;
    //         $annoucement_message->content = $request->content;
    //         $annoucement_message->to_new_users = $request->to_new_users;
    //         $annoucement_message->created_at = Carbon::now();
    //         $annoucement_message->save();

    //         if ($request->type == 1) {
    //             //如果是全体公告，则所有用户的new_msg设为true，以拉取消息
    //             User::all()->update(['new_msg', true]);
    //         }

    //         DB::commit();
    //     } catch (Exception $e) {
    //         DB::rollback();
    //         throw $e;
    //     }

    //     $admin_name = $user->tokenCan('admin') ? '管理员' : '专岛管理员';
    //     ProcessUserActive::dispatch(
    //         [
    //             'binggan' => $user->binggan,
    //             'user_id' => $user->id,
    //             'active' => $admin_name . '发布了公告',
    //             'content' => '标题：' . $request->title,
    //         ]
    //     );

    //     return response()->json([
    //         'code' => ResponseCode::SUCCESS,
    //         'message' => '已发布消息公告',
    //     ]);
    // }

    // public function show_annoucements(Request $request)
    // {
    //     $request->validate([
    //         'binggan' => 'required|string',
    //         'page' => 'integer|nullable',
    //         'per_page' => 'integer|nullable|max:100|min:1',
    //     ]);

    //     $annoucements = AnnoucementMessages::paginate($request->per_page);

    //     return response()->json([
    //         'code' => ResponseCode::SUCCESS,
    //         'message' => '已返回公告清单',
    //         'data' => $annoucements,
    //     ]);
    // }

    // public function del_annoucements(Request $request, $annoucement_id)
    // {
    //     $request->validate([
    //         'binggan' => 'required|string',
    //         'annoucement_id' => 'required|integer',
    //     ]);

    //     $user = $request->user();

    //     //确认是否拥有该版面的管理员权限
    //     if (
    //         !$user->tokenCan('admin')
    //     ) {
    //         return response()->json(
    //             [
    //                 'code' => ResponseCode::ADMIN_UNAUTHORIZED,
    //                 'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
    //             ],
    //         );
    //     }

    //     $annoucement = AnnoucementMessages::find($annoucement_id);
    //     if (!$annoucement) {
    //         return response()->json([
    //             'code' => ResponseCode::ANNOUCEMENT_NOT_FOUND,
    //             'message' => ResponseCode::$codeMap[ResponseCode::ANNOUCEMENT_NOT_FOUND],
    //         ]);
    //     }

    //     $annoucement->is_deleted = true;
    //     $annoucement->save();

    //     return response()->json([
    //         'code' => ResponseCode::SUCCESS,
    //         'message' => '已删除公告',
    //     ]);
    // }

}
