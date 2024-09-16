<?php

namespace App\Http\Controllers\API;

use App\Common\ResponseCode;
use App\Http\Controllers\Controller;
use App\Models\AdminActive;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminActivesController extends Controller
{
    private function getAdminActivesData($date = null, $page = 1)
    {
        $limit = 30; //每页30;
        $offset = $page * $limit - $limit;
        $table = 'admin_actives';

        $sql_child = DB::table($table)
            ->select('id')
            ->when($date !== null, function ($query) use ($date) {
                return $query->whereDate('created_at', '=', $date);
            })
            ->offset($offset)->limit($limit);

        $data = AdminActive::joinSub($sql_child, 'sql_child', function ($join) use ($table) {
            $join->on($table . '.id', '=', 'sql_child.id');
        })
            ->orderByDesc('admin_actives.id')
            ->get();


        //查询最大页数
        $data_num = AdminActive::when($date !== null, function ($query) use ($date) {
            return $query->whereDate('created_at', '=', $date);
        })->count();
        $lastPage = ceil($data_num /  $limit);

        return array($data, $lastPage);
    }

    public function show(Request $request)
    {
        $request->validate([
            'page' => 'integer|nullable',
            'date' => 'nullable|date|after_or_equal:2024-09-14',
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

        //查询数据
        list($actives_data, $lastPage) = $this->getAdminActivesData($request->date, $request->page); //更好的分页sql语句
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
