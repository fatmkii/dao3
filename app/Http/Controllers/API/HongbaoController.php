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
            'hongbao' => $hongbao,
        ]);
    }

    public static function store(Request $request, Thread $thread, Post $post_original)
    {
        $user = $request->user();

        $coin = 0; //红包金额
        $message = ""; //红包回帖信息

        $hongbao = Hongbao::find($thread->hongbao_id);
        if (!$hongbao) {
            return;
        }

        $keyword_prefix = '--红包口令: '; //为了方便前端识别并屏蔽，增加前缀
        if (in_array($hongbao->type, [1, 2]) && $post_original->content == $keyword_prefix . $hongbao->key_word) {

            $hongbao_user_exists  = HongbaoUser::where('hongbao_id', $thread->hongbao_id)->where('user_id', $user->id)->exists();
            if ($hongbao_user_exists) {
                $message = "你已经领取过了，不要贪心喔！";
                $message = "To №" . $post_original->floor . "：" . $message;

                // $post = new Post;
                // $post->setSuffix(intval($request->thread_id / 10000));
                // $post->created_binggan = $request->binggan;
                // $post->forum_id = $request->forum_id;
                // $post->thread_id = $request->thread_id;
                // $post->content = $message;
                // $post->nickname = '红包系统';
                // $post->created_by_admin = 2; //0=一般用户 1=管理员发布，2=系统发布
                // $post->created_ip = $request->ip();
                // $post->random_head = random_int(0, 39);

                // $thread->posts_num = POST::Suffix(intval($thread->id / 10000))->where('thread_id', $thread->id)->count();
                // $post->floor = $thread->posts_num;

                // $thread->save();
                // $post->save();

                $post = Post::create([
                    'created_binggan' => $request->binggan,
                    'forum_id' => $request->forum_id,
                    'thread_id' => $request->thread_id,
                    'content' => $message,
                    'nickname' => '红包系统',
                    'created_by_admin' => 2,
                    'created_IP' => $request->ip(),
                ]);
                return;
            }

            //用Redis记录，限制10秒内同一个IP不能领取同一个红包
            $key = sprintf('hongbao_%s_%s', $thread->hongbao_id, $request->ip()); //格式：hongbao_红包ID_IP地址
            if (Redis::exists($key)) {
                // $post_content = "10s内不能茄饼领同一个红包哦";
                // $post_content = "To №" . $post_original->floor . "：" . $post_content;
                // Post::create([
                //     'created_binggan' => $request->binggan,
                //     'forum_id' => $request->forum_id,
                //     'thread_id' => $request->thread_id,
                //     'content' => $post_content,
                //     'nickname' => '红包结果',
                //     'created_by_admin' => 2,
                //     'created_IP' => $request->ip(),
                // ]);
                return;
            }


            //执行追加新回复流程
            try {
                DB::beginTransaction();

                $hongbao = Hongbao::lockForUpdate()->find($thread->hongbao_id);
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
                $post_content = "To №" . $post_original->floor . "：" . $post_content;


                if ($hongbao->message) {
                    $post_content = $post_content . '<br>——' . $hongbao->message;
                }


                $message = "";
                if ($hongbao->message) {
                    //$hongbao->message当是单一message时候不为null
                    $message = $hongbao->message;
                    $post_content = $post_content . '<br>——' . $message;
                }

                if ($hongbao->message_json) {
                    //$hongbao->message_json当是多选一message时候不为null
                    $message_array = json_decode($hongbao->message_json);
                    $rand_key = array_rand($message_array);
                    $message = $message_array[$rand_key]; //从多个回复中随机抽出一个

                    $post_content = $post_content . '<br>——' . $message;
                }


                $hongbao->increment('olo_remains', -$coin);
                $hongbao->decrement('num_remains');
                $hongbao->save();

                // $post = new Post;
                // $post->setSuffix(intval($request->thread_id / 10000));
                // $post->created_binggan = $request->binggan;
                // $post->forum_id = $request->forum_id;
                // $post->thread_id = $request->thread_id;
                // $post->content = $message;
                // $post->nickname = '红包结果';
                // $post->created_by_admin = 2; //0=一般用户 1=管理员发布，2=系统发布
                // $post->created_ip = $request->ip();
                // $post->random_head = random_int(0, 39);

                // $thread->posts_num = POST::Suffix(intval($thread->id / 10000))->where('thread_id', $thread->id)->count();
                // $post->floor = $thread->posts_num;

                // $thread->save();
                // $post->save();

                $post = Post::create([
                    'created_binggan' => $request->binggan,
                    'forum_id' => $request->forum_id,
                    'thread_id' => $request->thread_id,
                    'content' => $post_content,
                    'nickname' => '红包系统',
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
        } else {
            return;
        }
    }
}
