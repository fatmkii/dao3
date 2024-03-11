<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Thread;
use App\Models\Forum;
use App\Models\Post;
use App\Common\ResponseCode;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use App\Events\NewPostBroadcast;
use App\Exceptions\CoinException;
use App\Facades\GlobalSetting;
use App\Models\HongbaoPost;
use App\Models\HongbaoPostUser;
use App\Models\UserMedalRecord;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Redis;

class HongbaoPostController extends Controller
{
    public function create(Request $request)
    {
        // if (Carbon::now()->between('2022/12/6 08:00:00', '2022/12/7 00:00:00')) {
        //     return response()->json([
        //         'code' => ResponseCode::DEFAULT,
        //         'message' => '今天8:00到24:00暂停大乱斗和红包。T_T',
        //     ]);
        // }

        $request->validate([
            'binggan' => 'required|string',
            'forum_id' => 'required|integer',
            'thread_id' => 'required|integer',
            //红包相关验证
            'hongbao_olo' => 'required|integer|min:3000|max:1000000',
            'hongbao_num' => 'required|integer|min:5|max:50',
            'type' => 'required|integer',
            'key_word_type' => 'nullable|integer',
            'hongbao_key_word' => 'required|string|max:255',
            'hongbao_question' => 'nullable|string|max:255',
            // 'hongbao_message' => 'nullable|string|max:255',//3.0代码直接使用下面的hongbao_message_json
            'hongbao_message_json' => 'nullable|array|max:5',
            'hongbao_olo_hide' => 'nullable|boolean',
        ]);

        $user = $request->user();


        $thread = Thread::find($request->thread_id);
        if (!$thread || $thread->is_delay == 1 || $thread->is_deleted != 0) {
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

        //判断是否达到可以访问板块的最少奥利奥
        if ($forum->accessible_coin > 0) {
            if ($user->getCoin() < $forum->accessible_coin && !(in_array($user->admin, [99, 20, 10]))) {
                return response()->json([
                    'code' => ResponseCode::THREAD_UNAUTHORIZED,
                    'message' => sprintf("本小岛需要拥有大于%u奥利奥才能查看喔", $forum->accessible_coin),
                ]);
            }
        }

        //判断奥利奥锁定权限贴
        if ($thread->locked_by_coin > 0) {
            if ($user->getCoin() < $thread->locked_by_coin && !(in_array($user->admin, [99, 20, 10]))) {
                return response()->json([
                    'code' => ResponseCode::THREAD_UNAUTHORIZED,
                    'message' => sprintf("本贴需要拥有大于%u奥利奥才能查看喔", $thread->locked_by_coin),
                ]);
            }
        }

        //判断是否私密主题 
        if ($thread->is_private == true) {
            if ($user->binggan != $thread->created_binggan && $user->admin != 99) {
                return response()->json([
                    'code' => ResponseCode::THREAD_IS_PRIVATE,
                    'message' => '本贴是私密主题，只有发帖者可以查看喔',
                ]);
            }
        }

        //执行追加新回复流程
        try {

            DB::beginTransaction();

            $post = Post::create([
                'created_binggan' => $request->binggan,
                'forum_id' => $request->forum_id,
                'thread_id' => $request->thread_id,
                'content' => "来抢红包啦！",
                'nickname' => '红包系统',
                'created_by_admin' => 2,
                'created_IP' => $request->ip(),
            ]);

            $tax_rate = GlobalSetting::get_tax('normal');
            $coin_pay = ceil($request->hongbao_olo * $tax_rate);
            $user->coinChange(
                'normal', //记录类型
                [
                    'olo' => -$coin_pay,
                    'content' => '发起口令红包',
                    'thread_id' => $request->thread_id,
                    'post_id' => $post->id,
                    'floor' => $post->floor,
                    'thread_title' => $request->title,
                ]
            ); //扣除用户相应olo（通过统一接口、记录操作）

            //追加红包贴
            $hongbao = HongbaoPost::create([
                'thread_id' => $request->thread_id,
                'post_id' => $post->id,
                'floor' => $post->floor,
                'olo_total' => $request->hongbao_olo,
                'num_total' => $request->hongbao_num,
                'olo_remains' => $request->hongbao_olo,
                'num_remains' => $request->hongbao_num,
                'type' => $request->type,
                'key_word_type' => $request->key_word_type,
                'key_word' => $request->hongbao_key_word,
                'message' => $request->hongbao_message,
                'message_json' => $request->hongbao_message_json,
                'question' => $request->hongbao_question,
                'olo_hide' => $request->hongbao_olo_hide,
            ]);

            //将hongbao->id返回给post表记录
            $post->hongbao_id = $hongbao->id;
            $post->save();


            //检查红包成就
            $user_medal_record = $user->UserMedalRecord()->firstOrCreate();
            $user_medal_record->push_hongbao_out($request->hongbao_olo);

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        //广播发帖动作
        // $post->broadcast();

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已发出新红包！',
            ],
        );
    }


    public function store(Request $request)
    {
        $request->validate([
            //一般回复的验证
            'binggan' => 'required|string',
            'forum_id' => 'required|integer',
            'thread_id' => 'required|integer',
            'content' => 'required|string|max:20000',
            'nickname' => 'max:30',
            'post_with_admin' => 'boolean',
            'new_post_key' => 'required|string',
            'timestamp' => 'integer',

            //抢红包的验证
            'hongbao_post_id' => 'required|integer',
            'hongbao_key_word' => 'required|string'
        ]);


        $user = $request->user();

        //灌水检查
        $water_check = $user->waterCheck('new_post', $request->ip(), $request->thread_id, $request);
        if ($water_check != 'ok') return $water_check;

        $thread = Thread::find($request->thread_id);
        if (!$thread || $thread->is_delay == 1 || $thread->is_deleted != 0) {
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


        //判断是否达到可以访问板块的最少奥利奥
        if ($forum->accessible_coin > 0) {
            if ($user->getCoin() < $forum->accessible_coin && !(in_array($user->admin, [99, 20, 10]))) {
                return response()->json([
                    'code' => ResponseCode::THREAD_UNAUTHORIZED,
                    'message' => sprintf("本小岛需要拥有大于%u奥利奥才能查看喔", $forum->accessible_coin),
                ]);
            }
        }

        //判断奥利奥锁定权限贴
        if ($thread->locked_by_coin > 0) {
            if ($user->getCoin() < $thread->locked_by_coin && !(in_array($user->admin, [99, 20, 10]))) {
                return response()->json([
                    'code' => ResponseCode::THREAD_UNAUTHORIZED,
                    'message' => sprintf("本贴需要拥有大于%u奥利奥才能查看喔", $thread->locked_by_coin),
                ]);
            }
        }


        $hongbao = HongbaoPost::lockForUpdate()->find($request->hongbao_post_id);
        if (!$hongbao) {
            return response()->json(
                [
                    'code' => ResponseCode::HONGBAO_NOT_FOUND,
                    'message' => ResponseCode::$codeMap[ResponseCode::HONGBAO_NOT_FOUND],
                ],
            );
        }

        //检查是否已经抢过红包了
        $hongbao_user_exists  = HongbaoPostUser::where('hongbao_post_id', $hongbao->id)->where('user_id', $user->id)->exists();
        if ($hongbao_user_exists) {
            return response()->json(
                [
                    'code' => ResponseCode::HONGBAO_HAS_BEEN_USED,
                    'message' => ResponseCode::$codeMap[ResponseCode::HONGBAO_HAS_BEEN_USED],
                ],
            );
        }

        //检查是否抢完了红包
        if ($hongbao->num_remains == 0) {
            return response()->json(
                [
                    'code' => ResponseCode::HONGBAO_HAS_BEEN_CLOSED,
                    'message' => ResponseCode::$codeMap[ResponseCode::HONGBAO_HAS_BEEN_CLOSED],
                ],
            );
        }

        //用Redis记录，限制10秒内同一个IP不能领取同一个红包
        $key = sprintf('hongbao_post_%s_%s', $hongbao->id, $request->ip()); //格式：hongbao_post_红包ID_IP地址
        if (Redis::exists($key)) {
            return response()->json(
                [
                    'code' => ResponseCode::HONGBAO_TOO_MANY,
                    'message' => ResponseCode::$codeMap[ResponseCode::HONGBAO_TOO_MANY],
                ],
            );
        }

        //无论红包关键词是否正确，都发一个回复：
        try {
            DB::beginTransaction();

            $post = Post::create([
                'created_binggan' => $request->binggan,
                'forum_id' => $request->forum_id,
                'thread_id' => $request->thread_id,
                'content' => $request->content,
                'nickname' => $request->nickname,
                'created_by_admin' => $request->post_with_admin ? 1 : 0,
                'created_IP' => $request->ip(),
            ]);

            $user->coinChange(
                'post', //记录类型
                [
                    'olo' => 10,
                    'content' => '回帖',
                ]
            ); //回复+10奥利奥（通过统一接口、记录操作）

            DB::commit();

            //广播发帖动作
            // $post->broadcast();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        //用redis记录回帖频率。
        $user->waterRecord('new_post', $request->ip());

        //追加该IP的抢红包记录，限制同一IP抢同一个红包（无论红包关键词是否正确）
        $key = sprintf('hongbao_post_%s_%s', $hongbao->id, $request->ip()); //格式：hongbao_post_红包ID_IP地址
        $ttl = 10; //限制10秒
        Redis::setex($key, $ttl, 1);

        //检查红包关键词是否正确 
        if ($hongbao->key_word == $request->hongbao_key_word) { //口令正确的流程：
            try {
                DB::beginTransaction();

                $coin = 0; //红包金额
                $post_content = ""; //红包回帖信息

                if ($hongbao->num_remains == 1) {
                    $hongbao->delete(); //软删除
                    $coin = $hongbao->olo_remains;
                    $post_content = sprintf("恭喜抢到来自№%d楼的最后一个红包，有%d个奥利奥！", $hongbao->floor, $coin);
                } else {
                    if ($hongbao->type == 1) {
                        //随机红包
                        $central = intval($hongbao->olo_remains / $hongbao->num_remains);
                        $coin = rand(0, $central * 2);
                    } elseif ($hongbao->type == 2) {
                        //定额红包
                        $coin = intval($hongbao->olo_total / $hongbao->num_total);
                    }
                    $post_content = sprintf("你抢到了来自№%d楼的%d个奥利奥！", $hongbao->floor,  $coin);
                }
                $post_content = "@№" . $post->floor . "：" . $post_content;


                $message = "";
                if ($hongbao->message) { //3.0不再使用message，而直接使用message_json。这里暂时做2.0兼容。
                    //$hongbao->message当是单一message时候不为null
                    $message = $hongbao->message;
                    $post_content = $post_content . '<br>——' . $message;
                }

                if ($hongbao->message_json) {
                    //$hongbao->message_json当是多选一message时候不为null
                    $message_array = $hongbao->message_json;
                    if (count($message_array) >= 1) {
                        $rand_key = array_rand($message_array);
                        $message = $message_array[$rand_key]; //从多个回复中随机抽出一个
                        $post_content = $post_content . '<br>——' . $message;
                    }
                }

                $keyword_prefix = '--红包口令: '; //为了方便前端识别并屏蔽，增加前缀
                if ($hongbao->key_word_type == 3) {
                    //暗号红包时，把回复中的红包口令隐藏起来
                    $post->content = $keyword_prefix . "（暗号红包已隐藏口令）";
                    $post->save();
                }

                HongbaoPost::withTrashed()->where('id', $hongbao->id)->increment('olo_remains', -$coin); //直接用$hongbao->withTrashed()的话， SQL查询语句会失去全部where条件，导致变更所有记录。可能是laravel的bug
                HongbaoPost::withTrashed()->where('id', $hongbao->id)->decrement('num_remains');

                $post_reply = Post::create([
                    'created_binggan' => $request->binggan,
                    'forum_id' => $request->forum_id,
                    'thread_id' => $request->thread_id,
                    'content' => $post_content,
                    'nickname' => '红包结果',
                    'created_by_admin' => 2,
                    'created_IP' => $request->ip(),
                ]);

                $user->coinChange(
                    'normal', //记录类型
                    [
                        'olo' => $coin,
                        'content' => $message != "" ? '抢到红包——' . $message : '抢到红包',
                        'thread_id' => $thread->id,
                        'thread_title' => $thread->title,
                        'post_id' => $post->id,
                        'floor' => $post->floor,
                    ]
                ); //（通过统一接口、记录操作）
                $user->save();

                $hongbao_user = HongbaoPostUser::create([
                    'hongbao_post_id' => $hongbao->id,
                    'user_id' => $user->id,
                    'olo' => $coin,
                    'floor' => $post->floor,
                    'created_at' => Carbon::now(),
                ]);

                DB::commit();
            } catch (Exception $e) {
                DB::rollback();
                throw $e;
            }

            //检查成就
            UserMedalRecord::check_floor($post->floor, $user); //（抢到特定楼层）
            $user_medal_record = $user->UserMedalRecord()->firstOrCreate(); //如果记录不存在就追加
            $user_medal_record->push_hongbao_in($coin); //红包成就
            $user_medal_record->push_posts_num(); //回复数量

            //广播发帖动作（系统回复红包）
            // $post_reply->broadcast();

            return response()->json(
                [
                    'code' => ResponseCode::SUCCESS,
                    'message' =>  sprintf("你抢到了来自№%d楼的%d个奥利奥！", $hongbao->floor,  $coin),
                    'data' => null
                ],
            );
        } else { //口令错误的流程：(相当于只发表了一个普通回复)
            //检查成就
            UserMedalRecord::check_floor($post->floor, $user); //（抢到特定楼层）
            $user_medal_record = $user->UserMedalRecord()->firstOrCreate(); //如果记录不存在就追加
            $user_medal_record->push_posts_num(); //回复数量

            return response()->json(
                [
                    'code' => ResponseCode::HONGBAO_KEYWORD_WRONG,
                    'message' => ResponseCode::$codeMap[ResponseCode::HONGBAO_KEYWORD_WRONG],
                ],
            );
        }
    }
}
