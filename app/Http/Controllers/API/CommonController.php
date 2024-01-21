<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\ResponseCode;
use App\Facades\GlobalSetting;


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
}
