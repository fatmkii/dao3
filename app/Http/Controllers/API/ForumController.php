<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Forum;
use App\Models\Thread;
use App\Models\User;
use App\Common\ResponseCode;
use App\Jobs\ProcessUserActive;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

class ForumController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // $forums = Cache::remember('forums_cache',  24 * 3600, function () {
        //     return Forum::where('status', '<>', 0) //把status为0的隐藏掉
        //         ->orderBy('sub_id', 'asc') //把个人岛放到后面
        //         ->orderBy('id', 'asc')
        //         ->get();
        // });
        $forums = Forum::where('status', '<>', 0) //把status为0的隐藏掉
            ->orderBy('sub_id', 'asc') //把个人岛放到后面
            ->orderBy('id', 'asc')
            ->get();
        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'data' => $forums,
            'message' => '已获得版面数据'
        ]);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $forum_id)
    {
        $request->validate([
            'binggan' => 'string|nullable',
            'page' => 'integer|nullable',
            'threads_per_page' => 'integer|nullable|max:100|min:1',
            'subtitles_excluded' => 'json|nullable', //要排除的副标题
            'search_title' => 'string|max:100', //搜索标题
            'delay' => 'boolean|nullable|', //是否显示延时发送主题
        ]);

        //用redis记录，全局每10秒搜索50次限制
        if ($request->has('search_title')) {
            if (Redis::exists('search_record_global')) {
                Redis::incr('search_record_global');
                if (Redis::GET('search_record_global') > 50) {
                    return response()->json([
                        'code' => ResponseCode::SEARCH_TOO_MANY,
                        'message' => ResponseCode::$codeMap[ResponseCode::SEARCH_TOO_MANY],
                    ]);
                }
            } else {
                Redis::setex('search_record_global',  10, 1);
            }
        }

        $CurrentForum = Forum::find($forum_id);
        $user = $request->user();
        $threads_per_page = $request->threads_per_page ? $request->threads_per_page : 50; //默认值是50个主题每页
        $subtitles_excluded = json_decode($request->subtitles_excluded, true);

        //隐藏不可见岛和判断岛是否存在
        if (!$CurrentForum || $CurrentForum->status == 0) {
            return response()->json([
                'code' => ResponseCode::FORUM_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::FORUM_NOT_FOUND],
                'forum_data' => null,
                'threads_data' => null,
                'subtitles_exclude' => null,
            ]);
        }

        //3.0起所有内容均需要饼干访问
        //判断是否可无饼干访问的板块
        // if (!$CurrentForum->is_anonymous && !$user) {
        //     return response()->json([
        //         'code' => ResponseCode::USER_NOT_FOUND,
        //         'message' => '本小岛需要饼干才能查看喔',
        //     ]);
        // }

        //判断是否达到可以访问板块的最少奥利奥
        if ($CurrentForum->accessible_coin > 0) {
            if (!$user) {
                return response()->json([
                    'code' => ResponseCode::USER_NOT_FOUND,
                    'message' => '本小岛需要饼干才能查看喔',
                ]);
            }
            if ($user->getCoin() < $CurrentForum->accessible_coin && !(in_array($user->admin, [99, 20, 10]))) {
                return response()->json([
                    'code' => ResponseCode::THREAD_UNAUTHORIZED,
                    'message' => sprintf("本小岛需要拥有大于%u奥利奥才能查看喔", $CurrentForum->accessible_coin),
                ]);
            }
        }

        $threads = $CurrentForum->threads()->where('is_deleted', 0)->where('is_delay', $request->delay ? 1 : 0);

        //搜索标题
        if ($request->has('search_title')) {
            $threads->where('title', 'like', '%' . $request->query('search_title') . '%');
        }

        //搜索副标题
        if ($subtitles_excluded != [] || $subtitles_excluded != null) {
            $threads->whereNotIn('sub_title', $subtitles_excluded);
        }

        //各种日清模式
        switch ($CurrentForum->is_nissin) {
            case 0:
                break;
            case 1: //按照8点日清模式
                //新日清判断模式
                $threads->where('has_nissined', 0);
            case 2: //按照24小时日清模式(目前咒版不清标题)
                break;
        }


        //加入公告以及排序
        if (!($request->has('search_title') || in_array("[公告]", $subtitles_excluded) || $request->delay)) { //搜索时或者筛选时或查看延时主题时不需要公告
            $threads
                ->orWhere(function ($query) {  //加入全岛公告（sub_id=99）
                    $query->where('is_deleted', 0)
                        ->where('sub_id', 99)
                        ->where('is_delay', 0);
                });
        }

        //sub_id是用来把公告等提前的
        $threads = $threads->orderBy('sub_id', 'desc')->orderBy('updated_at', 'desc')->paginate($threads_per_page);

        //如果有提供binggan，为每个thread输入binggan，用来判断is_your_thread（为前端提供是否是用户自己帖子的判据）
        if ($request->query('binggan') && $request->delay) {
            foreach ($threads as $thread) {
                $thread->setBinggan($request->query('binggan'));
                $thread->makeVisible('is_your_thread');
            }
        }

        //记录搜索行为
        if ($request->has('search_title')) {
            ProcessUserActive::dispatch(
                [
                    'binggan' => $user->binggan,
                    'user_id' => $user->id,
                    'active' => '用户进行了搜索',
                    'content' => '关键词：' . $request->query('search_title'),
                    'forum_id' => $forum_id,
                ]
            );
        }

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => ResponseCode::$codeMap[ResponseCode::SUCCESS],
            'data' => [
                'forum_data' => $CurrentForum->makeVisible('banners'),
                'threads_data' => $threads,
                'subtitles_exclude' => $subtitles_excluded,
            ]
        ]);
    }
}
