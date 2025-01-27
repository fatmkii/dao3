<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\ResponseCode;
use App\Facades\GlobalSetting;
use App\Common\Captcha;
use App\Common\NewBingganChecker;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use App\Models\Post;
use App\Models\Thread;
use Exception;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;

class CommonController extends Controller
{
    // 图片上传到阿里云oss的接口
    private function oss_upload(UploadedFile $file, string $mode)
    {

        //不同的上传模式上传到不同的oss文件夹
        $mode_dir_array = [
            'img' => 'xhg_upload/',
            'draw' => 'xhg_draw/',
        ];
        $dir =  $mode_dir_array[$mode];

        // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
        $accessKeyId = config('app.oss_key');
        $accessKeySecret = config('app.oss_secret');
        // yourEndpoint填写Bucket所在地域对应的Endpoint。以华东1（杭州）为例，Endpoint填写为https://oss-cn-hangzhou.aliyuncs.com。
        $endpoint = config('app.oss_endpoint');
        //实际返回的连接（OSS配置的域名绑定）
        $url = config('app.oss_url');
        // 填写Bucket名称，例如examplebucket。
        $bucket = "/cpttmm/";
        // 填写Object完整路径，例如exampledir/exampleobject.txt。Object完整路径中不能包含Bucket名称。
        $file_md5  = md5(file_get_contents($file));
        $object = $dir . $file_md5 . '.' . $file->extension();

        $date = str_replace('+0000', 'GMT', Carbon::now('GMT')->toRssString());
        // $x_oss_meta = sprintf('x-oss-meta-binggan:binggan=%s&IP=%s', $binggan, $IP);
        // $x_oss_tagging = sprintf('x-oss-tagging:binggan=%s&IP=%s', $binggan, $IP);

        $string_to_sign_ordered =  "PUT" . "\n"
            . "\n"
            . 'image' . "\n"
            . $date . "\n"
            // . $x_oss_tagging . "\n"
            . $bucket . $object;
        $signature = base64_encode(hash_hmac('sha1', $string_to_sign_ordered, $accessKeySecret, true));

        $authorization = "OSS " . $accessKeyId . ":" . $signature;

        $response = Http::withHeaders([
            'Authorization' => $authorization,
            'Date' => $date,
            'Cache-Control' => 'no-cache',
            'Content-Disposition' => 'attachment',
            // 'x-oss-tagging' => sprintf('binggan=%s&IP=%s', $binggan, $IP)
        ])
            ->withBody(
                file_get_contents($file),
                'image'
            )
            ->put($endpoint . '/' . $object);

        if ($response->successful()) {
            $file_url = $url . $object;
            return
                [
                    'code' => ResponseCode::SUCCESS,
                    'message' => '上传成功！',
                    'file_url' => $file_url,
                    'img_md5' => $file_md5,
                ];
        } else {
            return
                [
                    'code' => 500,
                    'message' => '上传文件失败',
                    'file_url' => "",
                    'img_md5' => $file_md5,
                ];
        }
    }

    // 将图片上传到freeimg.cn的接口
    private function freeimg_upload(UploadedFile $file, string $mode)
    {
        //根据不同模式上传到不同文件夹
        $mode_dir_array = [
            'img' => 360,  //用户上传的图片
            'draw' => 359,  //涂鸦板上传的图片
        ];
        $album_id = $mode_dir_array[$mode];


        $token = config('app.freeimg_token'); //freeimg.cn上传token
        $file_md5  = md5(file_get_contents($file));
        $file_name = $file_md5 . '.' . $file->extension();

        $client = new Client([
            'base_uri' => "https://freeimg.cn/",
            'timeout'  => 5.0,
        ]);

        $response = $client->request(
            'POST',
            'api/v1/upload',
            [
                'headers' => [
                    // 'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0',
                    'Authorization' => $token,
                    'Accept' => 'application/json',
                    // "Content-Type" => 'multipart/form-data', //千万不要加这个。原本multipart/form-data后面会自动接boundary，如果加了这个配置会导致boundary消失，从而请求内容在服务器无法识别
                ],
                'multipart' => [
                    [
                        'name'     => 'file',
                        'contents' => fopen($file->getRealPath(), 'rb'),
                        'filename' => $file_name,
                        'headers'  => ['Content-Type' => 'image']
                    ],
                    [
                        'name'     => 'permission',
                        'contents' => 0,
                    ],
                    [
                        'name'     => 'album_id',
                        'contents' => $album_id,
                    ]
                ]
            ]
        );

        $response_json = json_decode($response->getBody(), true);
        if ($response->getStatusCode() == 200 && $response_json['status']) {
            return
                [
                    'code' => ResponseCode::SUCCESS,
                    'message' => '上传成功！',
                    'file_url' =>  $response_json['data']['links']['url'],
                    'img_md5' => $file_md5,
                ];
        } else {
            return
                [
                    'code' => 500,
                    'message' => '上传文件失败：' . $response_json['message'],
                    'file_url' => "",
                    'img_md5' => $file_md5,
                ];
        }
    }

    //已废弃
    public function new_binggan_enable(Request $request)
    {
        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已查询申请饼干开放状态',
                'data' =>  GlobalSetting::get('new_binggan'),
            ],
        );
    }

    public function new_binggan_enable_check(Request $request)
    {
        list($enable, $next_date) = NewBingganChecker::check();
        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已查询申请饼干开放状态',
                'data' =>  [
                    'enable' => $enable && GlobalSetting::get('new_binggan'), //全局变量中手动关闭时，仍然为false
                    'next_date' => $next_date->getTimestamp(),
                ],
            ],
        );
    }

    public function get_home_banners(Request $request)
    {
        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已获得主页banner数据',
                'data' =>  GlobalSetting::get('home_banners'),
            ],
        );
    }

    public function get_captcha()
    {
        $captcha = new Captcha(3);

        $key = "";
        do {
            $key = Str::random(6);
        } while (Redis::exists("captcha_key_" . $key));

        Redis::setex("captcha_key_" . $key, 60, $captcha->getCode());

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'data' => [
                    'captcha_key' => $key,
                    'captcha_img' =>  $captcha->base64Img(),
                ]
            ],
        );
    }

    public function img_upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|max:10240',
            'thread_id' => 'required|integer', //如果是在新建主题时候上传，应传入0
            'forum_id' => 'required|integer',
            'mode' => 'required|string|in:img,draw'
        ]);

        $user = $request->user();

        $upload_status = $this->freeimg_upload($request->file, $request->mode);

        if ($upload_status['code'] != ResponseCode::SUCCESS) {
            return response()->json(
                [
                    'code' => 500,
                    'message' => '上传失败',
                    'file_url' => $upload_status['file_url'],
                ]
            );
        }

        //记录用户上传行为
        DB::table('users_upload')->insert([
            [
                'user_id' => $user->id,
                'forum_id' => $request->forum_id,
                'thread_id' => $request->thread_id,
                'img_md5' => $upload_status['img_md5'],
                'img_size' => filesize($request->file),
                'created_at' => Carbon::now(),
            ],

        ]);

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '图片上传成功！',
                'data' => [
                    'file_url' => $upload_status['file_url'],
                ]
            ]
        );
    }

    public function new_loudspeaker_enable(Request $request)
    {
        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已查询大喇叭开放状态',
                'data' =>  GlobalSetting::get('new_loudspeaker'),
            ],
        );
    }

    public static  function post_hongbao(Request $request, Thread $thread, Post $post)
    {
        $user = $request->user();

        $coin = 0; //红包金额
        $message = ""; //红包回帖信息

        //TODO 这里每次活动要改
        if (Carbon::now() < Carbon::create("2025-1-29 0:0:0")) {
            $coin = 0;
            $message = "本次活动尚未开始，请稍等喔";
        } elseif (Carbon::now() > Carbon::create("2025-1-31 0:0:0")) {
            $coin = 0;
            $message = "本次活动已经结束，你来晚啦";
        } elseif (DB::table("hongbao_record")->where('user_id', $user->id)->lockForUpdate()->exists()) {
            $coin = 0;
            $message = "你已经领取过了，不要贪心喔！";
        } elseif (Carbon::parse($user->created_at) > Carbon::create("2025-1-26 0:0:0")) {
            $coin = 0;
            $message = "你的饼干不符合领取条件（需要是25年1月26日0点前领取的饼干）";
        } else {
            $rand_num = random_int(1, 1000);
            switch ($rand_num) {
                case $rand_num == 1000: {
                        if (DB::table("hongbao_record")->where('rand_num', 1000)->exists()) {
                            $coin = 10000;
                            $message = "哇喔！恭喜抽到1w个olo！祝新春快乐~";
                            break;
                        } else {
                            $coin = 100000;
                            $message = "这是岛主埋单唯一大礼！10w个olo！祝新春快乐~";
                            break;
                        }
                    }
                case $rand_num >= 990: {
                        $coin = 10000;
                        $message = "哇喔！恭喜抽到1w个olo！祝新春快乐~";
                        break;
                    }
                case $rand_num >= 900: {
                        $coin = 3000;
                        $message = "恭喜抽到3000个olo！祝新春快乐~";
                        break;
                    }
                case $rand_num >= 600: {
                        $coin = 1000;
                        $message = "恭喜抽到1000个olo！祝新春快乐~";
                        break;
                    }
                default: {
                        $coin = 500;
                        $message = "恭喜抽到500个olo！祝新春快乐~";
                        break;
                    }
            }
        }

        $message = "To №" . $post->floor . "：" . $message;

        //执行追加新回复流程
        try {
            DB::beginTransaction();

            $post = Post::create([
                'created_binggan' => $request->binggan,
                'forum_id' => $request->forum_id,
                'thread_id' => $request->thread_id,
                'content' => $message,
                'nickname' => '红包系统',
                'created_by_admin' => 2,
                'created_IP' => $request->ip(),
            ]);


            if ($coin > 0) {
                // $user->coin += $coin;
                $user->coinChange(
                    'normal', //记录类型
                    [
                        'olo' => $coin,
                        'content' => '红包奖励',
                        'thread_id' => $thread->id,
                        'thread_title' => $thread->title,
                        'post_id' => $post->id,
                        'floor' => $post->floor,
                    ]
                );
                $user->save();

                DB::table("hongbao_record")->insert([
                    "thread_id" => $thread->id,
                    "post_id" => $post->id,
                    "user_id" => $user->id,
                    "created_binggan" => $user->binggan,
                    "rand_num" => $rand_num,
                    "olo" => $coin,
                    "created_at" => Carbon::now(),
                ]);
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    public function store_hongbao_pool(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',
            'olo' => 'required|integer',
            'message' => 'nullable|string|max:100',
            'thread_id' => 'required|integer',
            'forum_id' => 'required|integer',
            'admin' => 'nullable|boolean',
        ]);

        $user = $request->user();

        //TODO 这里每次活动要改
        if ($request->admin && $user->admin == 99) {
            //管理员可以投入最初的30万
            $olo = 300000;
            $message = "我投入了300000个olo！<br>" . $request->message; //祝福池留言
        } else {
            $olo = 1000;
            $message = "我投入了1000个olo！<br>" . $request->message; //祝福池留言
        }

        if (Carbon::now() < Carbon::create("2025-1-29 0:0:0") && $user->admin != 99) {
            return response()->json([
                'code' => ResponseCode::USER_CANNOT,
                'message' => "本次活动尚未开始，请稍等喔",
            ]);
        }
        if (Carbon::now() > Carbon::create("2025-1-31 0:0:0")) {
            return response()->json([
                'code' => ResponseCode::USER_CANNOT,
                'message' => "本次活动已经结束，你来晚啦",
            ]);
        }
        if (Carbon::parse($user->created_at) > Carbon::create("2025-1-26 0:0:0")) {
            return response()->json([
                'code' => ResponseCode::USER_CANNOT,
                'message' => "你的饼干不符合参与条件（25年1月26日0点前领取的饼干）",
            ]);
        }

        if (DB::table("hongbao_pool")->where('user_id', $user->id)->exists()) {
            return response()->json([
                'code' => ResponseCode::USER_CANNOT,
                'message' => "已经投入过祝福池了，请勿重复投入喔！",
            ]);
        }

        // $matches = array();
        // if (preg_match("/暴毙|爆炸/", $request->message, $matches)) {
        //     return response()->json([
        //         'code' => ResponseCode::USER_CANNOT,
        //         'message' => sprintf('请勿投入黑锦鲤喔！关键词：%s', $matches[0]),
        //     ]);
        // }

        //执行追加新回复流程
        try {
            DB::beginTransaction();

            $post = Post::create([
                'created_binggan' => $request->binggan,
                'forum_id' => $request->forum_id,
                'thread_id' => $request->thread_id,
                'content' => $message,
                'nickname' => '祝福池系统',
                'created_by_admin' => 2,
                'created_IP' => $request->ip(),
            ]);


            $user->coinChange(
                'normal', //记录类型
                [
                    'olo' => -$olo,
                    'content' => '祝福池活动',
                    'thread_id' => $request->thread_id,
                    'thread_title' => "祝福池活动",
                    'post_id' => $post->id,
                    'floor' => $post->floor,
                ]
            );
            $user->save();

            DB::table("hongbao_pool")->insert([
                "post_id" => $post->id,
                "user_id" => $user->id,
                "message" => $message,
                'floor' => $post->floor,
                "olo" => $olo,
                "created_at" => Carbon::now(),
            ]);

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已投入祝福池！请等待开奖~',
            ],
        );
    }

    public function get_hongbao_pool(Request $request)
    {
        $request->validate([
            'binggan' => 'required|string',

        ]);

        $user = $request->user();

        $user_pool = DB::table('hongbao_pool')->where('user_id', $user->id)->select(['olo', 'floor', 'result', 'message', 'created_at'])->first();
        $olo_total = DB::table('hongbao_pool')->sum('olo');

        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已获取祝福池信息',
                'data' => [
                    'user_pool' => $user_pool,
                    'olo_total' => $olo_total
                ],
            ],
        );
    }
}
