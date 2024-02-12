<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Common\ResponseCode;
use App\Facades\GlobalSetting;
use App\Jobs\ProcessUserActive;
use App\Jobs\ProcessUserCreatedLocation;
use App\Models\Post;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Redis;

class UserController extends Controller
{
    /**
     * 生成随机字符串、排除容易混淆的
     */
    private function random_str(int $num)
    {
        $str = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnprstuvwxyz1234567890"; //用于生成随机字符的，排除掉容易混淆的

        $output = '';
        $length = strlen($str);

        for ($i = 0; $i < $num; $i++) {
            // get random char
            $char = $str[rand(0, $length - 1)];
            $output .= $char;
        }

        return $output;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
        ]);

        $user = $request->user(); //从sanctum的token获得饼干

        if (!$user) {
            return response()->json(
                [
                    'code' => ResponseCode::USER_NOT_FOUND,
                    'message' => ResponseCode::$codeMap[ResponseCode::USER_NOT_FOUND],
                    'data' => [
                        'binggan' => $user->binggan,
                    ],
                ],
                401
            );
        }

        $user->last_login = Carbon::now();
        $user->save();

        if ($user->is_banned) {
            return response()->json(
                [
                    'code' => ResponseCode::USER_BANNED,
                    'message' => ResponseCode::$codeMap[ResponseCode::USER_BANNED],
                    'data' => [
                        'binggan' => $user->binggan,
                    ],
                ],
                401
            );
        }


        //确认饼干是否一致
        if ($user->binggan != $request->get('binggan')) {
            return response()->json(
                [
                    'code' => ResponseCode::CANNOTLOGIN,
                    'message' => ResponseCode::$codeMap[ResponseCode::CANNOTLOGIN],
                ],
                401
            );
        }

        //如果持有管理员token，使admin属性暴露，追加admin_forums属性
        if ($user->tokenCan('forum_admin')) {
            $user->makeVisible('admin');
            $user->append('admin_forums');
        }

        //如果没有存emojis，则返回null（不然前端会报错）
        $my_emoji = $user->MyEmoji;
        if ($my_emoji) {
            $my_emoji_data = $my_emoji->emojis;
        } else {
            $my_emoji_data = null;
        }

        //自定义大乱斗角色
        // $my_battle_chara = MyBattleChara::where('user_id', $user->id)->select('name', 'not_use')->get();

        //检查成就（小火锅周年活动）
        // $user_medal_record = $user->UserMedalRecord()->firstOrCreate(); //如果记录不存在就追加
        // $user_medal_record->check_national_day();

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '饼干认证成功，欢迎回来',
                'data' => [
                    'binggan' => $user,
                    'pingbici' => $user->pingbici,
                    'my_emoji' => $my_emoji_data,
                    // 'my_battle_chara' => $my_battle_chara,
                ],
            ],
        );
    }

    public function create(Request $request)
    {
        $request->validate([
            'register_key' => 'required|string',
        ]);

        if (!GlobalSetting::get('new_binggan')) {
            return response()->json([
                'code' => ResponseCode::USER_NEW_CLOSED,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_NEW_CLOSED],
            ]);
        }

        if (Redis::exists('reg_record_' . $request->ip())) {
            $limted_day = intval(Redis::TTL('reg_record_' . $request->ip()) / 86400) + 1;
            return response()->json([
                'code' => ResponseCode::USER_REGISTER_FAIL,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_REGISTER_FAIL] . '，你只能在'
                    . $limted_day . '天后再领取饼干。',
            ]);
        }

        //经过AES加密的Canvas指纹，作为UUID判断是否重复申请饼干
        //密钥：XiaoHuoGuoCpttmm
        $key = "XiaoHuoGuoCpttmm";
        $iv = 'abcdef0123456789';
        $options = OPENSSL_ZERO_PADDING;
        $created_UUID = openssl_decrypt($request->register_key, 'aes-128-cbc', $key, $options, $iv);
        $created_UUID_short = substr($created_UUID, 10, 16);
        //并且字符串的开始应为：XiaoHuoGuo
        if (substr($created_UUID, 0, 10) != "XiaoHuoGuo") {
            ProcessUserActive::dispatch(
                [
                    'user_id' => '0',
                    'binggan' => 'none',
                    'active' => '怀疑有人用脚本申请饼干',
                    'content' => sprintf('ip:%s  UUID:%s', $request->ip(), $created_UUID),
                ]
            );
            return response()->json([
                'code' => ResponseCode::USER_REGISTER_FAIL,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_REGISTER_FAIL] . '，是否使用了非正常手段申请饼干？如有疑问请联络：Bombaxceiba@protonmail.com',
                'uuid' => $created_UUID_short,
            ]);
        }

        //确认UUID是否被ban
        if (DB::table('user_register')->where('created_UUID', $created_UUID_short)->value('is_banned')) {
            ProcessUserActive::dispatch(
                [
                    'user_id' => 'none',
                    'active' => '申请饼干但UUID过多而失败',
                    'content' => 'ip:' . $request->ip() . ' UUID:' . $created_UUID_short,
                ]
            );
            return response()->json([
                'code' => ResponseCode::USER_REGISTER_FAIL,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_REGISTER_FAIL] .
                    '。因为此申请码已被锁定，请联络管理员解锁：Bombaxceiba@protonmail.com，' .
                    '附带此代码：' . $created_UUID_short,
                'uuid' => $created_UUID_short,
            ]);
        }

        try {
            DB::beginTransaction();
            $user = new User;
            $binggan = '';
            do {
                $binggan = $this->random_str(9);
            } while (User::where('binggan', $binggan)->exists());
            $user->binggan = $binggan;
            $user->created_ip = $request->ip();
            $user->created_UUID = $created_UUID_short;
            $user->coin = 300;
            $user->save();

            //添加相应的成就进度记录
            // $user_medal_record = new UserMedalRecord([
            //     'user_id' => $user->id,
            // ]);
            // $user_medal_record->save();

            //记录UUID申请次数
            if (DB::table('user_register')->where('created_UUID', $created_UUID_short)->exists()) {
                DB::table('user_register')->where('created_UUID', $created_UUID_short)->increment('count');
            } else {
                DB::table('user_register')->insert([
                    'created_UUID' => $created_UUID_short
                ]);
            }

            //如果申请次数已经达到5次，则ban
            if (DB::table('user_register')->where('created_UUID', $created_UUID_short)->value('count') >= 5) {
                DB::table('user_register')->where('created_UUID', $created_UUID_short)->update(['is_banned' => 1]);
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }
        $token = $user->createToken($binggan, ['normal'])->plainTextToken;
        //用redis记录饼干申请ip。限定7天内只能申请1次。
        Redis::setex('reg_record_' . $request->ip(), 7 * 24 * 3600, 1);

        //用redis记录新饼干，24小时内不能发表回复。
        Redis::setex('new_user_' . $user->binggan, 24 * 3600, 1);


        //记录申请饼干IP所在地
        ProcessUserCreatedLocation::dispatch(
            [
                'IP' => $request->ip(),
                'user_id' => $user->id,
            ]
        );

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '领取饼干成功！建议在个人中心设置密码哦。（新饼干24小时内暂时不能发帖）',
                'data' => [
                    'binggan' => $binggan,
                    'token' => $token,
                ],
            ],
            200
        );
    }

    public function reward(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'post_floor_message' => 'required|string',
            'coin' => 'required|integer|min:1|max:1000000',
            'forum_id' => 'required|integer',
            'thread_id' => 'required|integer',
            'post_id' => 'required|integer',
            'content' => 'nullable|string'
        ]);

        $user = $request->user();
        $post_target = Post::suffix(intval($request->thread_id / 10000))->find($request->post_id);
        $user_target = User::where('binggan', $post_target->created_binggan)->first();

        //判断对象用户饼干是否存在
        if (!$user_target) {
            return response()->json([
                'code' => ResponseCode::USER_NOT_FOUND,
                'message' => '打赏对象不存在',
            ]);
        }
        //判断用户饼干和对象饼干是否一致
        if ($user_target->binggan == $request->binggan) {
            return response()->json([
                'code' => ResponseCode::DEFAULT,
                'message' => '给自己打赏是想给税收做贡献吗？',
            ]);
        }

        //判断是否重复打赏
        $redis_key = sprintf('reward_%s_to_%d', $user->binggan, $request->post_id);
        if (Redis::exists($redis_key)) {
            return response()->json([
                'code' => ResponseCode::USER_CANNOT,
                'message' => '避免误触发，2秒内不能重复打赏',
            ]);;
        } else {
            Redis::setex($redis_key, 2, 1);
        }


        try {
            DB::beginTransaction();
            // $post = new Post;
            // $post->setSuffix(intval($request->thread_id / 10000));
            // $post->created_binggan = $request->binggan;
            // $post->forum_id = $request->forum_id;
            // $post->thread_id = $request->thread_id;
            // $post->content = "<span class='quote_content'>" .
            //     $request->post_floor_message .
            //     '</span><br>我为你打赏了' . $request->coin .
            //     '块奥利奥<br>——' . $request->content;
            // $post->nickname = '奥利奥打赏系统';
            // $post->created_by_admin = 2; //0=一般用户 1=管理员发布，2=系统发布
            // $post->created_ip = $request->ip();
            // $post->random_head = random_int(0, 39);

            // $thread = $post->thread;
            // $thread->posts_num = POST::Suffix(intval($thread->id / 10000))->where('thread_id', $thread->id)->count();
            // $post->floor = $thread->posts_num;
            // $thread->save();
            // $post->save();

            $post_content = "<span class='quote_content'>" .
                $request->post_floor_message .
                '</span><br>我为你打赏了' . $request->coin .
                '块奥利奥<br>——' . $request->content;

            $post = Post::create([
                'created_binggan' => $request->binggan,
                'forum_id' => $request->forum_id,
                'thread_id' => $request->thread_id,
                'content' => $post_content,
                'nickname' => '奥利奥打赏系统',
                'created_by_admin' => 2,
                'created_IP' => $request->ip(),
            ]);

            $thread = $post->thread;

            $tax_rate = GlobalSetting::get_tax('normal');
            $coin_pay = ceil($request->coin * $tax_rate);
            // $user->coinConsume($coin_pay);
            $user->coinChange(
                'normal', //记录类型
                [
                    'olo' => -$coin_pay,
                    'content' => '打赏olo   ——留言：' . $request->content,
                    'user_id_target' => $user_target->id,
                    'binggan_target' => $user_target->binggan,
                    'thread_id' => $thread->id,
                    'thread_title' => $thread->title,
                    'post_id' => $post->id,
                    'floor' => $post->floor,
                ]
            ); //通过统一接口、记录操作  

            // $user_target->coin += $request->coin;
            // $user_target->save();
            $user_target->coinChange(
                'normal', //记录类型
                [
                    'olo' => $request->coin,
                    'user_id_target' => $user->id,
                    'binggan_target' => $user->binggan,
                    'content' => '被打赏olo   ——留言：' . $request->content,
                    'thread_id' => $thread->id,
                    'thread_title' => $thread->title,
                    'post_id' => $post->id,
                    'floor' => $post->floor,
                ]
            ); //通过统一接口、记录操作  

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        // $user_medal_record = $user->UserMedalRecord()->firstOrCreate(); //如果记录不存在就追加
        // $user_target_medal_record = $user_target->UserMedalRecord()->firstOrCreate(); //如果记录不存在就追加
        // $user_medal_record->push_reward_out($coin_pay); //检查成就
        // $user_target_medal_record->push_reward_in($request->coin); //检查成就

        //广播发帖动作
        // broadcast(new NewPostBroadcast($request->thread_id, $post->id, $post->floor))->toOthers();
        // $post->broadcast();

        ProcessUserActive::dispatch(
            [
                'binggan' => $user->binggan,
                'user_id' => $user->id,
                'active' => '用户打赏了',
                'binggan_target' => $user_target->binggan,
                'content' => $request->coin . '个饼干 ip:' . $request->ip(),
            ]
        );

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '打赏成功！对方获得' . $request->coin . '个奥利奥，你减少了' . $coin_pay . '个奥利奥',
                'data' => [
                    'binggan' => $request->binggan,
                    'coin' => $request->coin
                ]
            ],
        );
    }
}
