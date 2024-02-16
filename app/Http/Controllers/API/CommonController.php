<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\ResponseCode;
use App\Facades\GlobalSetting;
use App\Common\Captcha;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class CommonController extends Controller
{
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
}
