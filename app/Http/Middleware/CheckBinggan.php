<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Common\ResponseCode;
use App\Models\User;
use Illuminate\Support\Facades\Redis;

class CheckBinggan
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $mode)
    {
        $user = $request->user();
        if (!$user) {
            //如果饼干不存在，返回错误
            if (!$user) {
                return response()->json(
                    [
                        'code' => ResponseCode::USER_NOT_FOUND,
                        'message' => ResponseCode::$codeMap[ResponseCode::USER_NOT_FOUND],
                    ],
                    401
                );
            }
        }
        //如果饼干被ban，返回错误
        if ($user->is_banned) {
            return response()->json(
                [
                    'code' => ResponseCode::USER_BANNED,
                    'message' => ResponseCode::$codeMap[ResponseCode::USER_BANNED],
                    'data' => [
                        'binggan' => $user->binggan,
                    ], //这里不返回401，因为在/user/show路由那里必然返回401。避免前端多次弹出401错误的弹窗。
                ],
            );
        }
        switch ($mode) {
            case 'create': //发帖等
                {

                    //新饼干24小时内不能发帖
                    if (Redis::exists('new_user_' . $user->binggan)) {
                        return response()->json(
                            [
                                'code' => ResponseCode::USER_CANNOT,
                                'message' => '新领取的饼干24小时内暂时不能发表回复哦',
                            ],
                        );
                    }

                    //查询饼干是否在封禁期
                    if ($user->lockedTTL) {
                        $lockTTL_hours = intval($user->lockedTTL / 3600) + 1;
                        return response()->json(
                            [
                                'code' => ResponseCode::USER_LOCKED,
                                'message' => ResponseCode::$codeMap[ResponseCode::USER_LOCKED] . '，将于' . $lockTTL_hours . '小时后解封',
                            ],
                        );
                    }
                    break;
                }
            case 'show': //看帖等
                {
                }
        }

        return $next($request);
    }
}
