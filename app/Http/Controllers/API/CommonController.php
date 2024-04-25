<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\ResponseCode;
use App\Facades\GlobalSetting;
use App\Common\Captcha;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use App\Models\Post;
use App\Models\Thread;
use Exception;

class CommonController extends Controller
{
    private function oss_upload(UploadedFile $file, string $dir = "xhg_upload/", string $binggan = "", string $IP = "")
    {

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
            'mode' => 'required|string'
        ]);

        //不同的上传模式上传到不同的oss文件夹
        $mode_dir_array = [
            'img' => 'xhg_upload/',
            'draw' => 'xhg_draw/',
        ];
        if (array_key_exists($request->mode, $mode_dir_array)) {
            $upload_dir = $mode_dir_array[$request->mode];
        } else {
            $upload_dir = 'xhg_upload';
        }

        $user = $request->user();


        $upload_status = $this->oss_upload($request->file, $upload_dir);


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

        if (Carbon::now() < Carbon::create("2024-4-28 8:0:0")) {
            $coin = 0;
            $message = "本次活动尚未开始，请稍等喔";
        } elseif (Carbon::now() > Carbon::create("2024-5-1 0:0:0")) {
            $coin = 0;
            $message = "本次活动已经结束，你来晚啦";
        } elseif (DB::table("hongbao_record")->where('user_id', $user->id)->lockForUpdate()->exists()) {
            $coin = 0;
            $message = "你已经领取过了，不要贪心喔！";
        } elseif (Carbon::parse($user->created_at) > Carbon::create("2024-4-28 0:0:0")) {
            $coin = 0;
            $message = "你的饼干不符合领取条件（需要是24年4月28日0点前领取的饼干）";
        } else {
            $rand_num = random_int(1, 1000);
            switch ($rand_num) {
                case $rand_num == 1000: {
                        if (DB::table("hongbao_record")->where('rand_num', 1000)->exists()) {
                            $coin = 10000;
                            $message = "哇喔！恭喜抽到1w个olo！谢谢你一直支持小火锅~";
                            break;
                        } else {
                            $coin = 100000;
                            $message = "这是岛主埋单唯一大礼！10w个olo！谢谢你一直支持小火锅~";
                            break;
                        }
                    }
                case $rand_num >= 990: {
                        $coin = 10000;
                        $message = "哇喔！恭喜抽到1w个olo！谢谢你一直支持小火锅~";
                        break;
                    }
                case $rand_num >= 900: {
                        $coin = 3000;
                        $message = "恭喜抽到3000个olo！谢谢你一直支持小火锅~";
                        break;
                    }
                case $rand_num >= 600: {
                        $coin = 1000;
                        $message = "恭喜抽到1000个olo！谢谢你一直支持小火锅~";
                        break;
                    }
                default: {
                        $coin = 500;
                        $message = "恭喜抽到500个olo！谢谢你一直支持小火锅~";
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
                'nickname' => '3周年红包系统',
                'created_by_admin' => 2,
                'created_IP' => $request->ip(),
            ]);


            if ($coin > 0) {
                // $user->coin += $coin;
                $user->coinChange(
                    'normal', //记录类型
                    [
                        'olo' => $coin,
                        'content' => '3周年红包奖励',
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
}
