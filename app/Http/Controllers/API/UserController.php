<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Common\ResponseCode;
use App\Facades\GlobalSetting;
use App\Jobs\ProcessUserCreatedLocation;
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
            // ProcessUserActive::dispatch(
            //     [
            //         'user_id' => '0',
            //         'binggan' => 'none',
            //         'active' => '怀疑有人用脚本申请饼干',
            //         'content' => sprintf('ip:%s  UUID:%s', $request->ip(), $created_UUID),
            //     ]
            // );
            return response()->json([
                'code' => ResponseCode::USER_REGISTER_FAIL,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_REGISTER_FAIL] . '，是否使用了非正常手段申请饼干？如有疑问请联络：Bombaxceiba@protonmail.com',
                'uuid' => $created_UUID_short,
            ]);
        }

        //确认UUID是否被ban
        if (DB::table('user_register')->where('created_UUID', $created_UUID_short)->value('is_banned')) {
            // ProcessUserActive::dispatch(
            //     [
            //         'user_id' => 'none',
            //         'active' => '申请饼干但UUID过多而失败',
            //         'content' => 'ip:' . $request->ip() . ' UUID:' . $created_UUID_short,
            //     ]
            // );
            return response()->json([
                'code' => ResponseCode::USER_REGISTER_FAIL,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_REGISTER_FAIL] .
                    '，是否申请了过多饼干？如有疑问请联络：Bombaxceiba@protonmail.com，' .
                    '附带：' . $created_UUID_short,
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
}
