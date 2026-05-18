<?php

namespace App\Http\Controllers\API;

use App\Common\ResponseCode;
use App\Http\Controllers\Controller;
use App\Models\AdminActive;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AdminActivesController extends Controller
{
    const SUPER_ACTIVE_TYPE = ['set_user_olo', 'create_medal', 'unlock_uuid', 'transfer_thread']; //定义属于超管动作的active_type

    private function getAdminActivesData($date = null, $page = 1, $is_super_admin = false)
    {
        $limit = 30; //每页30;
        $offset = $page * $limit - $limit;
        $table = 'admin_actives';

        $sql_child = DB::table($table)
            ->select('id')
            ->when($date !== null, function ($query) use ($date) {
                return $query->whereDate('created_at', '=', $date);
            })
            ->orderByDesc('id')
            ->offset($offset)->limit($limit);

        if ($is_super_admin) {
            //超管状况页面，仅查询这几个动作
            $sql_child->whereIn('active_type', self::SUPER_ACTIVE_TYPE);
        } else {
            //一般管理状况页面，查询除此之外的动作
            $sql_child->whereNotIn('active_type', self::SUPER_ACTIVE_TYPE);
        }

        $data = AdminActive::joinSub($sql_child, 'sql_child', function ($join) use ($table) {
            $join->on($table . '.id', '=', 'sql_child.id');
        })
            ->get();
        if ($is_super_admin) {
            $data->makeVisible('binggan_target');
        }

        //查询最大页数
        $data_num = AdminActive::when($date !== null, function ($query) use ($date) {
            return $query->whereDate('created_at', '=', $date);
        })->count();
        $lastPage = ceil($data_num /  $limit);

        return array($data, $lastPage);
    }

    public function antibotScores(Request $request)
    {
        $request->validate([
            'date_from' => 'required|date|date_format:Y-m-d',
            'date_to' => 'required|date|date_format:Y-m-d|after_or_equal:date_from',
            'page' => 'integer|nullable',
        ]);

        $user = $request->user();
        if (!$user->tokenCan('super_admin')) {
            return response()->json([
                'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
            ]);
        }

        $dateFrom = Carbon::parse($request->date_from);
        $dateTo = Carbon::parse($request->date_to);

        // 校验同月
        if ($dateFrom->format('Y-m') !== $dateTo->format('Y-m')) {
            return response()->json([
                'code' => ResponseCode::PARAM_FAILED,
                'message' => '只能查询同一个月的数据',
            ]);
        }

        $monthSuffix = $dateFrom->format('Y_n'); // 例：2026_5
        $tableName = 'user_actives_' . $monthSuffix;

        if (!Schema::hasTable($tableName)) {
            return response()->json([
                'code' => ResponseCode::SUCCESS,
                'message' => '该月暂无评分数据',
                'data' => ['data' => [], 'last_page' => 1],
            ]);
        }

        $page = $request->page ?? 1;
        $limit = 10;
        $offset = ($page - 1) * $limit;

        $query = DB::table($tableName)
            ->select('binggan', 'content', 'created_at')
            ->where('active', '反机器人多维评分')
            ->whereBetween('created_at', [
                $dateFrom->startOfDay()->toDateTimeString(),
                $dateTo->endOfDay()->toDateTimeString(),
            ])
            ->orderByDesc('id');

        $total = $query->count();
        $data = $query->offset($offset)->limit($limit)->get();
        $lastPage = max(1, (int) ceil($total / $limit));

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '已查询数据',
            'data' => [
                'data' => $data,
                'last_page' => $lastPage,
            ],
        ]);
    }

    public function show(Request $request)
    {
        $request->validate([
            'page' => 'integer|nullable',
            'date' => 'nullable|date|after_or_equal:2024-09-14',
            'show_super' => 'nullable|boolean',
        ]);

        $user = $request->user();
        if (!$user->tokenCan('admin')) {
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        };

        if ($request->show_super && !$user->tokenCan('super_admin')) {
            // 超管查询权限
            return response()->json(
                [
                    'code' => ResponseCode::ADMIN_UNAUTHORIZED,
                    'message' => ResponseCode::$codeMap[ResponseCode::ADMIN_UNAUTHORIZED],
                ],
            );
        };


        //查询数据
        list($actives_data, $lastPage) = $this->getAdminActivesData($request->date, $request->page, $request->show_super); //更好的分页sql语句
        return response()->json(
            [
                'code' => ResponseCode::SUCCESS,
                'message' => '已查询数据',
                'data' => [
                    "data" => $actives_data,
                    "last_page" => $lastPage,
                ]
            ]
        );
    }
}
