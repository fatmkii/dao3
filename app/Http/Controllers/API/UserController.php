<?php

namespace App\Http\Controllers\API;

use App\Common\BattleChara;
use App\Common\Medals;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Common\ResponseCode;
use App\Exceptions\UserException;
use App\Facades\GlobalSetting;
use App\Jobs\ProcessUserActive;
use App\Jobs\ProcessUserCreatedLocation;
use App\Models\EmojiContestUserTotal;
use App\Models\IncomeStatement;
use App\Models\Loudspeaker;
use App\Models\Post;
use App\Models\User;
use App\Models\Pingbici;
use App\Models\MyEmoji;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Redis;
use App\Models\MyBattleChara;
use App\Models\UserBank;
use App\Models\UserLV;
use App\Models\UserMedal;
use App\Models\UserMedalRecord;
use App\Common\NewBingganChecker;

class UserController extends Controller
{

    //UserLV相关
    const MYEMOJI_MIN = 5000;  //我的表情包初始长度
    const MYEMOJI_MAX = 30000;  //我的表情包最大长度
    const MYEMOJI_INTERVAL = 1000;  //我的表情包每次升级增加长度
    const MYEMOJI_OLO = -20000;  //我的表情包每次升级消费olo

    const TITLE_PINGBICI_MIN = 1000;  //标题屏蔽词初始长度
    const TITLE_PINGBICI_MAX = 4000;  //标题屏蔽词最大长度
    const TITLE_PINGBICI_INTERVAL = 200;  //标题屏蔽词每次升级增加长度
    const TITLE_PINGBICI_OLO = -4000;  //我的表情包每次升级消费olo

    const CONTENT_PINGBICI_MIN = 1000;  //内容屏蔽词每次初始长度
    const CONTENT_PINGBICI_MAX = 4000;  //内容屏蔽词每次最大长度
    const CONTENT_PINGBICI_INTERVAL = 200; //内容屏蔽词每次升级增加长度
    const CONTENT_PINGBICI_OLO = -4000;  //我的表情包每次升级消费olo

    const FJF_PINGBICI_MIN = 1000;  //反精分屏蔽词初始长度
    const FJF_PINGBICI_MAX = 4000;  //反精分屏蔽词最大长度
    const FJF_PINGBICI_INTERVAL = 200;  //反精分屏蔽词每次升级增加长度
    const FJF_PINGBICI_OLO = -4000;  //我的表情包每次升级消费olo

    const MYBATTLECHARA_MIN = 0;  //自定义大乱斗角色初始数量
    const MYBATTLECHARA_MAX = 3;  //自定义大乱斗角色最大数量
    const MYBATTLECHARA = -50000;  //自定义大乱斗角色每次升级消费olo


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

        //如果没有存emojis，则返回[]（不然前端会报错）
        $my_emoji = $user->MyEmoji;
        if ($my_emoji) {
            $my_emoji_data = $my_emoji->emojis ?: [];
            $emoji_excluded = $my_emoji->emoji_excluded ?: [];
        } else {
            $my_emoji_data = [];
            $emoji_excluded = [];
        }

        //如果没有存pingbici，则返回[]（不然前端会报错）
        $pingbici_data = $user->pingbici;
        if ($pingbici_data == null) {
            $pingbici_data = [
                'title_pingbici' => [],
                'content_pingbici' => [],
                'fjf_pingbici' => [],
            ];
        } else {
            $pingbici_data = [
                'title_pingbici' => $pingbici_data->title_pingbici ?: [],
                'content_pingbici' => $pingbici_data->content_pingbici ?: [],
                'fjf_pingbici' => $pingbici_data->fjf_pingbici ?: [],
            ];
        }

        //自定义大乱斗角色
        $my_battle_chara = MyBattleChara::where('user_id', $user->id)->select('name', 'not_use')->get();

        //检查成就（小火锅周年活动）
        $user_medal_record = $user->UserMedalRecord()->firstOrCreate(); //如果记录不存在就追加
        $user_medal_record->check_anniversary();

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '饼干认证成功，欢迎回来',
                'data' => [
                    'binggan' => $user,
                    'pingbici' => $pingbici_data,
                    'my_emoji' => $my_emoji_data,
                    'emoji_excluded' => $emoji_excluded,
                    'my_battle_chara' => $my_battle_chara,
                ],
            ],
        );
    }

    public function create(Request $request)
    {
        $request->validate([
            'register_key' => 'required|string',
        ]);


        list($new_binggan_enable, $next_date) = NewBingganChecker::check();
        if (!GlobalSetting::get('new_binggan') || !$new_binggan_enable) {
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
            // $post->content = "<span class='quote-content'>" .
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

            $post_content = "<span class='quote-content'>" .
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

        $user_medal_record = $user->UserMedalRecord()->firstOrCreate(); //如果记录不存在就追加
        $user_target_medal_record = $user_target->UserMedalRecord()->firstOrCreate(); //如果记录不存在就追加
        $user_medal_record->push_reward_out($coin_pay); //检查成就
        $user_target_medal_record->push_reward_in($request->coin); //检查成就

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

    //输入验证码后解除灌水锁定
    public function water_unlock(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'captcha_key' => 'required|string',
            'captcha_code' => 'required|string',
        ]);

        $user = $request->user();

        if (Redis::exists("captcha_key_" . $request->captcha_key)) {
            $captcha_code = Redis::get("captcha_key_" . $request->captcha_key);
            if ($captcha_code == strtolower($request->captcha_code)) {
                Redis::del('new_post_record_IP_' . $request->ip());
                return response()->json([
                    'code' => ResponseCode::SUCCESS,
                    'message' => '已解除限制。',
                ]);
            } else {
                ProcessUserActive::dispatch(
                    [
                        'binggan' => $user->binggan,
                        'user_id' => $user->id,
                        'active' => '用户输入验证码错误',
                        'content' => 'code:' . $captcha_code . ' input:' . $request->captcha_code,
                    ]
                );
                return response()->json([
                    'code' => ResponseCode::CAPTCHA_WRONG,
                    'message' => ResponseCode::$codeMap[ResponseCode::CAPTCHA_WRONG],
                ]);
            }
        } else {
            return response()->json([
                'code' => ResponseCode::CAPTCHA_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::CAPTCHA_NOT_FOUND],
            ]);
        }
    }

    //设定自定义屏蔽词
    public function pingbici_set(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'use_pingbici' => 'required|boolean',
            'title_pingbici' => 'array',
            'content_pingbici' => 'array',
            'fjf_pingbici' => 'array',
        ]);

        $user = $request->user();
        // $user = User::where('binggan', $request->binggan)->first();
        // if (!$user) {
        //     return response()->json(
        //         [
        //             'code' => ResponseCode::USER_NOT_FOUND,
        //             'message' => ResponseCode::$codeMap[ResponseCode::USER_NOT_FOUND],
        //         ],
        //     );
        // }

        //检查屏蔽词长度是否符合饼干等级
        $user_lv = $user->UserLV;
        if (!$user_lv) {
            //如果不存在，则输入默认值
            $user_lv = array(
                'title_pingbici' => self::TITLE_PINGBICI_MIN,
                'content_pingbici' => self::CONTENT_PINGBICI_MIN,
                'fjf_pingbici' => self::FJF_PINGBICI_MIN,
                'my_emoji' => self::MYEMOJI_MIN,
            );
        }
        $user_lv_array = array(
            'title_pingbici' => '标题屏蔽词',
            'content_pingbici' => '内容屏蔽词',
            'fjf_pingbici' => '反精分屏蔽词',
        );
        foreach ($user_lv_array as $name => $error_msg) {
            if (mb_strlen(implode($request[$name])) > $user_lv[$name]) {
                return response()->json([
                    'code' => ResponseCode::USER_ERROR,
                    'message' => $error_msg . '长度为' . mb_strlen(implode($request[$name])) . '。已超出了最大限制，可在个人中心升级限制。',
                ]);
            }
        }

        if ($user->pingbici) {
            $pingbici = $user->pingbici;
        } else {
            $pingbici = new Pingbici();
        }
        try {
            DB::beginTransaction();
            $user->use_pingbici = $request->use_pingbici;
            $pingbici->user_id = $user->id;
            $pingbici->title_pingbici = $request->title_pingbici;
            $pingbici->content_pingbici = $request->content_pingbici;
            $pingbici->fjf_pingbici = $request->fjf_pingbici;
            $user->save();
            $pingbici->save();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        ProcessUserActive::dispatch(
            [
                'binggan' => $user->binggan,
                'user_id' => $user->id,
                'active' => '用户更新了屏蔽词(新设定)',
                'content' => 'title长度:' . mb_strlen(json_encode($request->title_pingbici))
                    . 'content长度:' . mb_strlen(json_encode($request->content_pingbici))
                    . 'fjf长度:' . mb_strlen(json_encode($request->fjf_pingbici)),
            ]
        );

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已设定屏蔽词',
                'data' => [
                    'pingbici' => $pingbici,
                ]
            ],
        );
    }

    //追加自定义屏蔽词
    public function pingbici_add(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'content_pingbici' => 'required|string',
        ]);

        $user = $request->user();

        $pingbici = $user->Pingbici;
        if ($pingbici) {
            $pingbici_array = $user->Pingbici->content_pingbici;
            if (in_array($request->content_pingbici, $pingbici_array)) {
                return response()->json([
                    'code' => ResponseCode::USER_ERROR,
                    'message' => '该内容屏蔽词已存在：' . $request->content_pingbici,
                ]);
            }
            array_push($pingbici_array, $request->content_pingbici);
        } else {
            $pingbici = new Pingbici();
            $pingbici_array = [$request->content_pingbici]; //得是个数组
        }

        //检查屏蔽词长度是否符合饼干等级
        $user_lv = $user->UserLV;
        if (!$user_lv) {
            //如果不存在，则输入默认值
            $user_lv = array(
                'title_pingbici' => self::TITLE_PINGBICI_MIN,
                'content_pingbici' => self::CONTENT_PINGBICI_MIN,
                'fjf_pingbici' => self::FJF_PINGBICI_MIN,
                'my_emoji' => self::MYEMOJI_MIN,
            );
        }
        $user_lv_array = array(
            // 'title_pingbici' => '标题屏蔽词',
            'content_pingbici' => '内容屏蔽词',
            // 'fjf_pingbici' => '反精分屏蔽词',
        );
        foreach ($user_lv_array as $name => $error_msg) {
            if (mb_strlen(implode($pingbici_array)) > $user_lv[$name]) {
                return response()->json([
                    'code' => ResponseCode::USER_ERROR,
                    'message' => $error_msg . '长度为' . mb_strlen(implode($pingbici_array)) . '。已超出了最大限制，可在个人中心升级限制。',
                ]);
            }
        }


        try {
            DB::beginTransaction();
            $user->use_pingbici = true;
            $pingbici->user_id = $user->id;
            // $pingbici->title_pingbici = $request->title_pingbici;
            $pingbici->content_pingbici = $pingbici_array;
            // $pingbici->fjf_pingbici = $request->fjf_pingbici;
            $user->save();
            $pingbici->save();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        ProcessUserActive::dispatch(
            [
                'binggan' => $user->binggan,
                'user_id' => $user->id,
                'active' => '用户更新了屏蔽词(追加)',
                'content' => '长度:' . mb_strlen($request->content_pingbici),
            ]
        );

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已追加屏蔽词',
                'content_pingbici' => json_encode($pingbici_array),
            ],
        );
    }

    //追加我的表情包
    public function my_emoji_add(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'my_emoji' => 'required|string',
        ]);

        $user = $request->user();

        if ($user->MyEmoji) {
            $my_emoji = $user->MyEmoji;
            $my_emoji_array = $my_emoji->emojis;
            array_push($my_emoji_array, $request->my_emoji);
        } else {
            $my_emoji = new MyEmoji();
            $my_emoji_array = [$request->my_emoji]; //得是个数组
        }

        //检查我的表情包长度是否符合饼干等级
        $user_lv = $user->UserLV;
        if (!$user_lv) {
            //如果不存在，则输入默认值
            $user_lv = array(
                'title_pingbici' => self::TITLE_PINGBICI_MIN,
                'content_pingbici' => self::CONTENT_PINGBICI_MIN,
                'fjf_pingbici' => self::FJF_PINGBICI_MIN,
                'my_emoji' => self::MYEMOJI_MIN,
            );
        }
        $user_lv_array = array(
            'my_emoji' => '我的表情包',
        );
        foreach ($user_lv_array as $name => $error_msg) {
            if (mb_strlen(implode($my_emoji_array)) > $user_lv[$name]) {
                return response()->json([
                    'code' => ResponseCode::USER_ERROR,
                    'message' => $error_msg . '长度为' . mb_strlen(implode($my_emoji_array)) . '。已超出了最大限制，可在个人中心升级限制。',
                ]);
            }
        }

        try {
            DB::beginTransaction();
            $my_emoji->user_id = $user->id;
            $my_emoji->emojis = $my_emoji_array;
            $my_emoji->save();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        ProcessUserActive::dispatch(
            [
                'binggan' => $user->binggan,
                'user_id' => $user->id,
                'active' => '用户更新了表情包(追加)',
                'content' => '长度:' . mb_strlen($request->my_emoji),
            ]
        );

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已追加到我的表情包',
            ],
        );
    }

    //设定我的表情包
    public function my_emoji_set(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'my_emoji' => 'array',
            'emoji_excluded' => 'array',
        ]);

        $user = $request->user();

        //检查我的表情包长度是否符合饼干等级
        $user_lv = $user->UserLV;
        if (!$user_lv) {
            //如果不存在，则输入默认值
            $user_lv = array(
                'title_pingbici' => self::TITLE_PINGBICI_MIN,
                'content_pingbici' => self::CONTENT_PINGBICI_MIN,
                'fjf_pingbici' => self::FJF_PINGBICI_MIN,
                'my_emoji' => self::MYEMOJI_MIN,
            );
        }
        $user_lv_array = array(
            'my_emoji' => '我的表情包',
        );
        foreach ($user_lv_array as $name => $error_msg) {
            if (mb_strlen(implode($request[$name])) > $user_lv[$name]) {
                return response()->json([
                    'code' => ResponseCode::USER_ERROR,
                    'message' => $error_msg . '长度为' . mb_strlen(implode($request[$name])) . '。已超出了最大限制，可在个人中心升级限制。',
                ]);
            }
        }

        if ($user->MyEmoji) {
            $my_emoji = $user->MyEmoji;
        } else {
            $my_emoji = new MyEmoji();
        }
        try {
            DB::beginTransaction();
            $my_emoji->user_id = $user->id;
            $my_emoji->emojis = $request->my_emoji;
            $my_emoji->emoji_excluded = $request->emoji_excluded;
            $my_emoji->save();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        ProcessUserActive::dispatch(
            [
                'binggan' => $user->binggan,
                'user_id' => $user->id,
                'active' => '用户更新了表情包(更新)',
                'content' => '长度:' . mb_strlen(json_encode($request->my_emoji)),
            ]
        );

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已设定我的表情包',
            ],
        );
    }

    //确认当前IP的注册记录
    public function check_reg_record(Request $request)
    {
        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '申请饼干记录TTL',
                'data' => [
                    'reg_record_TTL' => Redis::TTL('reg_record_' . $request->ip()),
                ],
            ],
        );
    }

    //查询收益表（当日）
    public function income_show_day(Request $request)
    {
        $request->validate([
            'income_date' => 'required|date|after_or_equal:2022-01-01',
        ]);

        $user = $request->user();

        //获得查询当天的全部数据
        $income_data = IncomeStatement::incomeData($user->id, $request->income_date); //更好的分页sql语句
        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已获得收支数据',
                'data' => $income_data
            ]
        );
    }

    //查询收益表（合计）
    public function income_show_sum(Request $request)
    {
        $request->validate([
            'income_date' => 'required|date|after_or_equal:2022-01-01',
        ]);

        $user = $request->user();

        //获得查询当年和当月的合计
        $date = Carbon::parse($request->income_date);
        $sum_year = IncomeStatement::suffix($date->year)->where('user_id', $user->id)->sum('olo');

        $from_date = $date->copy()->firstOfMonth()->toDateString();
        $to_date = $date->copy()->addMonthNoOverflow()->firstOfMonth()->toDateString();

        $sum_month = IncomeStatement::suffix($date->year)->where('user_id', $user->id)->whereBetween('created_at', [$from_date, $to_date])->sum('olo');
        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已获得收支数据',
                'data' => array(
                    "sum_year" => $sum_year,
                    "sum_month" => $sum_month,
                )
            ]
        );
    }
    //获取所有大喇叭
    public function show_loudspeaker(Request $request)
    {
        $request->validate([
            'binggan' => 'nullable|string',
            'mode' => 'required|string',
        ]);



        if ($request->mode == 'effective') {
            //正常显示的已发布的大喇叭
            $loudspeakers = Loudspeaker::where('effective_date', "<", Carbon::now())->orderBy('sub_id', 'desc')->orderBy('id', 'asc')->get();
        } elseif ($request->mode == 'all') {
            //全部大喇叭（不含软删除），用于确认包括未发布的清单
            $loudspeakers = Loudspeaker::orderBy('sub_id', 'desc')->orderBy('id', 'asc')->get();
        } else {
            return response()->json([
                'code' => ResponseCode::PARAM_FAILED,
                'message' => ResponseCode::$codeMap[ResponseCode::PARAM_FAILED],
            ]);
        }

        if ($request->query('binggan')) {
            foreach ($loudspeakers as $loudspeaker) {
                $loudspeaker->setBinggan($request->query('binggan'));
            }
        }

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已获取大喇叭数据',
                'data' => $loudspeakers,
            ]
        );
    }

    //发布新的大喇叭
    public function create_loudspeaker(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'sub_id' => 'nullable|integer',
            'content' => 'required|string|max:100',
            'color' => 'nullable|string|max:8',
            'thread_id' => 'nullable|integer',
            'effective_date' => 'required|date_format:Y-m-d H:i:s',
            'days' => 'required|integer|min:1|max:3',
        ]);

        if (!GlobalSetting::get('new_loudspeaker')) {
            return response()->json([
                'code' => ResponseCode::USER_CANNOT,
                'message' => '暂时停止发布新的大喇叭',
            ]);
        }


        $user = $request->user();

        $effective_date = Carbon::parse($request->effective_date);
        $expire_date = $effective_date->copy()->addDays($request->days);

        if ($effective_date < Carbon::now()->addHours(-1)) { //减去1小时避免时间差
            return response()->json([
                'code' => ResponseCode::USER_CANNOT,
                'message' => '生效时间不应早于现在',
            ]);
        }

        if ($request->sub_id && $request->sub_id >= 10 && $user->admin != 99) {
            //只有超管可以发布置顶大喇叭(sub_id>=10)
            return response()->json([
                'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
            ]);
        }

        try {
            DB::beginTransaction();

            $olo = 5000 * $request->days; //根据时长每天5000
            $user->coinChange(
                'normal', //记录类型
                [
                    'olo' => -$olo,
                    'content' => '发布了大喇叭'
                ]
            ); //扣除用户相应olo（通过统一接口、记录操作）


            $loudspeaker = Loudspeaker::create([
                'sub_id' => $request->sub_id,
                'user_id' => $user->id,
                'created_binggan' => $user->binggan,
                'content' => $request->content,
                'color' => $request->color,
                'thread_id' => $request->thread_id,
                'effective_date' => $request->effective_date,
                'expire_date' => $expire_date,
            ]);


            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        //检查成就（发布大喇叭）
        $user_medal_record = $user->UserMedalRecord()->firstOrCreate(); //如果记录不存在就追加
        $user_medal_record->push_loudspeakers_con();



        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已发布大喇叭',
                'data' => $loudspeaker,
            ]
        );
    }

    //用户自行撤回大喇叭
    public function repeal_loudspeaker(Request $request)
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

        if ($user->id != $loudspeaker->user_id) {
            return response()->json([
                'code' => ResponseCode::USER_CANNOT,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_CANNOT],
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

        //检查成就（撤回大喇叭）
        $user_medal_record = $user->UserMedalRecord()->firstOrCreate(); //如果记录不存在就追加
        $user_medal_record->check_loudspeakers_withdraw();


        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已撤回该大喇叭',
                'data' => $loudspeaker,
            ]
        );
    }

    //获得已经获得的成就数据
    public function show_medals(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
        ]);

        $user = $request->user();

        UserMedal::where('user_id', $user->id)->where('is_read', 0)->update(['is_read' => 1]);
        $user_medals = $user->UserMedal()->pluck('medal_id')->toArray();
        // $user_medals->where('is_read', 0)->update(['is_read' => 1]);
        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已获取成就数据',
                'data' => $user_medals,
            ]
        );
    }

    //获得某个成就的进度
    public function show_medal_progress(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'medal_id' => 'required|integer',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json([
                'code' => ResponseCode::USER_NOT_FOUND,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_NOT_FOUND],
            ]);
        }
        $varname = Medals::DATA[$request->medal_id]['varname'];

        $threshold = Medals::DATA[$request->medal_id]['threshold'];

        $this_medal = $user->UserMedal()->where('medal_id', $request->medal_id)->first();
        if ($this_medal) {
            $medal_created_at = $this_medal->created_at;
        } else {
            $medal_created_at = null;
        }

        switch ($varname) {
            case 'olo':
                $progress = $user->coin;
                break;
            case 'user_lv':
                $progress = $user->user_lv;
                break;
            case 'emoji_contest':
                $emoji_contest_user_total =
                    EmojiContestUserTotal::where('user_id', $user->id)
                    ->where('emoji_group_id', $request->medal_id - 200) //emoji_group_id从1开始，相应medal_id是201，差额200
                    ->first();
                if ($emoji_contest_user_total) {
                    $progress = $emoji_contest_user_total->votes_num_total;
                } else {
                    $progress = 0;
                }
                break;
            case 'emoji_contest_total':
                $emoji_contest_user_total_sum = EmojiContestUserTotal::where('user_id', $user->id)->sum('votes_num_total');
                $progress = $emoji_contest_user_total_sum;
                break;
            case null:
                $progress = null;
                break;
            default:
                $progress_arr = $user->UserMedalRecord()->pluck($varname)->toArray();
                if ($progress_arr) {
                    $progress = $progress_arr[0];
                } else {
                    $progress = 0;
                }
                break;
        }

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已获取成就进度',
                'data' => [
                    'medal_id' => $request->medal_id,
                    'threshold' => $threshold,
                    'progress' => $progress,
                    'medal_created_at' => $medal_created_at,
                ],
            ]
        );
    }

    //存入银行
    public function bank_deposit(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'olo' => 'required|integer|max:1000000|min:10',
            'description' => 'nullable|string|max:50',
            'expire_date' => 'required|date_format:Y-m-d H:i:s', //到期时间
        ]);

        $user = $request->user();

        $expire_date = Carbon::parse($request->expire_date);
        $end = Carbon::now()->addYear()->addDay(); //多加一天，避免因为实际时间和提交时间不同造成影响；
        $start = Carbon::now()->addDay()->addHours(-1); //多减一小时，避免因为实际时间和提交时间不同造成影响；

        if (!$expire_date->between($start,  $end)) {
            return response()->json([
                'code' => ResponseCode::USER_CANNOT,
                'message' => '存粮时间最短1天、最长1年哦',
            ]);
        }

        try {
            DB::beginTransaction();


            $user_bank = UserBank::create([
                'user_id' => $user->id,
                'olo' => $request->olo,
                'description' => $request->description,
                'expire_date' => $request->expire_date,
            ]);

            $user->coinChange(
                'normal', //记录类型
                [
                    'olo' => -$request->olo,
                    'content' => sprintf('存入粮仓:%d个olo  到期时间:%s', $request->olo, $request->expire_date),
                ]
            ); //扣除用户相应olo（通过统一接口、记录操作）

            $user_olo_in_bank = UserBank::where('user_id', $user->id)->where('is_deleted', 0)->sum('olo');
            $user->coin_in_bank = $user_olo_in_bank;
            $user->save();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        //检查成就
        UserMedalRecord::check_bank_coin($user);

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => sprintf('成功存入粮仓:%d个olo  到期时间:%s', $request->olo, $request->expire_date),
                'data' => $user_bank,
            ]
        );
    }

    //从银行取出
    public function bank_withdraw(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'deposit_id' => 'required|integer',
            'confirm_penalty' => 'required|boolean', //前端确认是否接受提前支取的惩罚
        ]);

        $user = $request->user();

        $user_bank = UserBank::where('id', $request->deposit_id)
            ->where('is_deleted', false)->first();

        if ($user_bank == null) {
            return response()->json([
                'code' => ResponseCode::DEFAULT,
                'message' => '该存粮不存在！',
            ]);
        }

        if ($user_bank->user_id != $user->id) {
            return response()->json([
                'code' => ResponseCode::USER_CANNOT,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_CANNOT],
            ]);
        }

        try {
            list($message, $olo_withdraw) = $user_bank->bank_withdraw($user, $request->confirm_penalty); //取出并留下操作记录
        } catch (Exception $e) {
            return response()->json([
                'code' => ResponseCode::USER_CANNOT,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_CANNOT],
            ]);
        }

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => $message,
                'data' => $user_bank,
            ]
        );
    }

    //显示所有银行存款
    public function show_bank_deposit(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
        ]);

        $user = $request->user();
        $user_bank = UserBank::where('user_id', $user->id)->where('is_deleted', false)->get();

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已获取存款数据',
                'data' => $user_bank,
            ]
        );
    }

    //饼干升级
    public function user_lv_up(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'mode' => 'required|string',
        ]);

        $user = $request->user();

        try {
            DB::beginTransaction();
            if ($user->UserLV) {
                $user_lv = $user->UserLV;
            } else {
                $user_lv = new UserLV();
                $user_lv->user_id = $user->id;
                $user_lv->title_pingbici = self::TITLE_PINGBICI_MIN;
                $user_lv->content_pingbici = self::CONTENT_PINGBICI_MIN;
                $user_lv->fjf_pingbici = self::FJF_PINGBICI_MIN;
                $user_lv->my_emoji = self::MYEMOJI_MIN;
                $user_lv->my_battle_chara = self::MYBATTLECHARA_MIN;
            }
            switch ($request->mode) {
                case 'title_pingbici':
                    $user_lv->title_pingbici += self::TITLE_PINGBICI_INTERVAL;
                    if ($user_lv->title_pingbici > self::TITLE_PINGBICI_MAX) {
                        throw new UserException('标题屏蔽词已升到满级了');
                    }
                    $user->coinChange(
                        'normal', //记录类型
                        [
                            'olo' => self::TITLE_PINGBICI_OLO,
                            'content' => '升级饼干（标题屏蔽词）',
                        ]
                    ); //扣除奥利奥（通过统一接口、记录操作）
                    break;
                case 'content_pingbici':
                    $user_lv->content_pingbici += self::CONTENT_PINGBICI_INTERVAL;
                    if ($user_lv->content_pingbici > self::CONTENT_PINGBICI_MAX) {
                        throw new UserException('内容屏蔽词已升到满级了');
                    }
                    $user->coinChange(
                        'normal', //记录类型
                        [
                            'olo' => self::CONTENT_PINGBICI_OLO,
                            'content' => '升级饼干（内容屏蔽词）',
                        ]
                    ); //扣除奥利奥（通过统一接口、记录操作）
                    break;
                case 'fjf_pingbici':
                    $user_lv->fjf_pingbici += self::FJF_PINGBICI_INTERVAL;
                    if ($user_lv->fjf_pingbici > self::FJF_PINGBICI_MAX) {
                        throw new UserException('内容屏蔽词已升到满级了');
                    }
                    $user->coinChange(
                        'normal', //记录类型
                        [
                            'olo' => self::FJF_PINGBICI_OLO,
                            'content' => '升级饼干（反精分屏蔽词）',
                        ]
                    ); //扣除奥利奥（通过统一接口、记录操作）
                    break;
                case 'my_emoji':
                    $user_lv->my_emoji += self::MYEMOJI_INTERVAL;
                    if ($user_lv->my_emoji > self::MYEMOJI_MAX) {
                        throw new UserException('我的表情包已升到满级了');
                    }
                    $user->coinChange(
                        'normal', //记录类型
                        [
                            'olo' => self::MYEMOJI_OLO,
                            'content' => '升级饼干（我的表情包）',
                        ]
                    ); //扣除奥利奥（通过统一接口、记录操作）
                    break;
                case 'my_battle_chara':
                    $user_lv->my_battle_chara += 1;
                    if ($user_lv->my_battle_chara > self::MYBATTLECHARA_MAX) {
                        throw new UserException('自定义大乱斗角色数量已经达到最大值了');
                    }

                    $default_chara = new BattleChara(8); //默认角色小豆泥(id=8)

                    try {
                        DB::beginTransaction();
                        MyBattleChara::create(
                            [
                                'user_id' => $user->id,
                                'chara_id' => $user_lv->my_battle_chara - 1, //chara_id从0开始，这里要-1
                                'name' => $default_chara->CharaName(),
                                'heads' => $default_chara->CharaHeadsAll(),
                                'messages' => $default_chara->CharaAttackMessagesAll(),
                            ]
                        );

                        $user->coinChange(
                            'normal', //记录类型
                            [
                                'olo' => self::MYBATTLECHARA,
                                'content' => '升级饼干（自定义大乱斗角色+1）',
                            ]
                        ); //扣除奥利奥（通过统一接口、记录操作）
                        DB::commit();
                    } catch (Exception $e) {
                        DB::rollback();
                        throw $e;
                    }
                    break;
                default:
                    throw new UserException('升级出错');
            }
            $user_lv->save();

            $user->user_lv += 1;
            $user->save();

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        //检查成就
        UserMedalRecord::Check_user_lv($user);

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '成功升级饼干！',
                'data' => $user_lv,
            ]
        );
    }

    //显示饼干等级
    public function user_lv_show(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
        ]);

        $user = $request->user();

        //如果没有升级过饼干user_lv为空，则返回默认值
        $user_lv_data = $user->UserLV;
        if (!$user_lv_data) {
            $user_lv_data = array(
                'title_pingbici' => self::TITLE_PINGBICI_MIN,
                'content_pingbici' => self::CONTENT_PINGBICI_MIN,
                'fjf_pingbici' => self::FJF_PINGBICI_MIN,
                'my_emoji' => self::MYEMOJI_MIN,
                'my_battle_chara' => self::MYBATTLECHARA_MIN,
            );
        }

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '查询成功！',
                'data' => $user_lv_data,
            ]
        );
    }

    //新建自定义饼干
    public function create_custom(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'binggan_apply' => 'required|string|alpha_dash|max:16|min:7',
            'password' => 'required|string|alpha_dash|max:20|min:7',
        ]);

        $user_origin = $request->user();

        if (User::where('binggan', $request->binggan_apply)->exists()) {
            return response()->json([
                'code' => ResponseCode::USER_REGISTER_FAIL,
                'message' => ResponseCode::$codeMap[ResponseCode::USER_REGISTER_FAIL] . '，该饼干已经存在了',
            ]);
        }

        try {
            DB::beginTransaction();
            $user = new User;
            $user->binggan = $request->binggan_apply;
            $user->created_ip = $request->ip();
            $user->is_custom = true;
            $user->coin = 300;
            $user->password = hash('sha256', $request->password . config('app.password_salt'));
            $user->save();

            $user_origin->coinChange(
                'normal', //记录类型
                [
                    'olo' => -100000, //定制饼干花费100000
                    'content' => '申请了定制饼干',
                ]
            ); //通过统一接口、记录操作
            $user_origin->save();

            DB::table('user_custom')->insert([
                'user_id' => $user->id,
                'binggan' => $user->binggan,
                'from_binggan' => $user_origin->binggan,
                'created_at' => Carbon::now(),
            ]);

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        //检查成就
        $user_medal_record = $user_origin->UserMedalRecord()->firstOrCreate();
        $user_medal_record->check_custom_binggan();

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
                'message' => '新建定制饼干成功！',
                'data' => [
                    'binggan' => $request->binggan_apply,
                ],
            ],
            200
        );
    }

    //查询自定义大乱斗角色
    public function my_battle_chara_show(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
        ]);

        $user = $request->user();

        $my_battle_chara = MyBattleChara::where('user_id', $user->id)->get() ?? []; //返回数据必须是个数组

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '查询成功！',
                'data' => $my_battle_chara,
            ]
        );
    }

    //设定自定义大乱斗角色
    public function my_battle_chara_set(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'chara_id' => 'required|integer',
            'name' => 'required|string|max:50',
            'heads' => 'required|array|max:1000',
            'messages' => 'required|array|max:1000',
            'not_use' => 'required|boolean',
        ]);

        $user = $request->user();

        //检查角色数量是否符合饼干等级
        $user_lv = $user->UserLV['my_battle_chara'];
        if (!$user_lv) {
            //如果不存在，则输入默认值
            $user_lv = self::MYBATTLECHARA_MIN;
        }

        if ($request->chara_id + 1 > $user_lv) { //因为chara_id从0开始，这里要+1
            return response()->json([
                'code' => ResponseCode::USER_ERROR,
                'message' => '自定义大乱斗角色最大为' . $user_lv . '个。已超出了最大限制，可在个人中心升级。',
            ]);
        }

        try {
            DB::beginTransaction();

            MyBattleChara::where(['user_id' => $user->id, 'chara_id' => $request->chara_id])
                ->update([
                    'name' => $request->name,
                    'heads' => $request->heads,
                    'messages' => $request->messages,
                    'not_use' => $request->not_use
                ]);

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        ProcessUserActive::dispatch(
            [
                'binggan' => $user->binggan,
                'user_id' => $user->id,
                'active' => sprintf('用户更新了大乱斗角色(id:%d)', $request->chara_id),
            ]
        );

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => sprintf('已更新我的大乱斗角色：%s', $request->name),
                'data' => null,
            ],
        );
    }
}
