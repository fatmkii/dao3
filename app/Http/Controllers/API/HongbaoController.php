<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Hongbao;
use Illuminate\Http\Request;
use App\Common\ResponseCode;
use App\Exceptions\CoinException;
use App\Models\HongbaoUser;
use App\Models\User;
use App\Models\Thread;
use App\Models\Post;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Redis;

class HongbaoController extends Controller
{

    public function show(Request $request, $hongbao_id)
    {
        $hongbao = Hongbao::find($hongbao_id);
        if (!$hongbao) {
            return response()->json([
                'code' => ResponseCode::HONGBAO_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::HONGBAO_NOT_FOUND],
            ]);
        }

        $user = $request->user();
        if ($user) {
            $hongbao->setUserID($user->id);
        }

        if ($hongbao->olo_hide) {
            $hongbao->makeHidden('olo_total');
        }

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'data' => $hongbao,
        ]);
    }

    public static function store(Request $request)
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
            'hongbao_id' => 'required|integer',
            'hongbao_key_word' => 'required|string'
        ]);

        $user = $request->user();

        $coin = 0; //红包金额
        $message = ""; //红包回帖信息

        $thread = Thread::find($request->thread_id);
        if (!$thread || $thread->is_delay == 1 || $thread->is_deleted != 0) {
            return response()->json([
                'code' => ResponseCode::THREAD_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::THREAD_NOT_FOUND],
            ]);
        }


        $hongbao = Hongbao::lockForUpdate()->find($request->hongbao_id);
        if (!$hongbao) {
            return response()->json(
                [
                    'code' => ResponseCode::HONGBAO_NOT_FOUND,
                    'message' => ResponseCode::$codeMap[ResponseCode::HONGBAO_NOT_FOUND],
                ],
            );
        }

        //检查是否已经抢过红包了
        $hongbao_user_exists  = HongbaoUser::where('hongbao_id', $hongbao->id)->where('user_id', $user->id)->exists();
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

        //用Redis记录，限制10秒内同一个IP不能领取同一个红包
        $key = sprintf('hongbao_%s_%s', $request->hongbao_id, $request->ip()); //格式：hongbao_红包ID_IP地址
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


        //检查红包关键词是否正确 
        if ($hongbao->key_word != $request->hongbao_key_word) {
            return response()->json(
                [
                    'code' => ResponseCode::HONGBAO_KEYWORD_WRONG,
                    'message' => ResponseCode::$codeMap[ResponseCode::HONGBAO_KEYWORD_WRONG],
                ],
            );
        }

        //执行追加新回复流程
        try {
            DB::beginTransaction();

            if ($hongbao->num_remains == 0) {
                DB::rollBack();
                return;
            } elseif ($hongbao->num_remains == 1) {
                $coin = $hongbao->olo_remains;
                $post_content = sprintf("恭喜抢到最后一个红包，有%d个奥利奥！", $coin);
            } else {
                if ($hongbao->type == 1) {
                    $central = intval($hongbao->olo_remains / $hongbao->num_remains);
                    $coin = rand(0, $central * 2);
                } elseif ($hongbao->type == 2) {
                    $coin = intval($hongbao->olo_total / $hongbao->num_total);
                }
                $post_content = sprintf("你抢到了%d个奥利奥！",  $coin);
            }
            $post_content = "@№" . $post->floor . "：" . $post_content;


            if ($hongbao->message) {
                $post_content = $post_content . '<br>——' . $hongbao->message;
            }

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

            //减少红包的剩余olo和数量
            $hongbao->increment('olo_remains', -$coin);
            $hongbao->decrement('num_remains');
            $hongbao->save();

            $post = Post::create([
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

            $hongbao_user = new HongbaoUser;
            $hongbao_user->hongbao_id = $hongbao->id;
            $hongbao_user->user_id = $user->id;
            $hongbao_user->olo = $coin;
            $hongbao_user->created_at = Carbon::now();
            $hongbao_user->save();

            //追加该IP的抢红包记录，限制同一IP抢同一个红包
            $key = sprintf('hongbao_%s_%s', $thread->hongbao_id, $request->ip()); //格式：hongbao_红包ID_IP地址
            $ttl = 10; //限制10秒
            Redis::setex($key, $ttl, 1);

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        //检查成就
        $user_medal_record = $user->UserMedalRecord()->firstOrCreate();
        $user_medal_record->push_hongbao_in($coin);

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' =>  sprintf("你抢到了来自№%d楼的%d个奥利奥！", $hongbao->floor,  $coin),
                'data' => null
            ],
        );
    }
}
