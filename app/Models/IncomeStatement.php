<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Thread;
use Carbon\Carbon;

class IncomeStatement extends ModelWithSuffix
{
    use HasFactory;

    const UPDATED_AT = null; //不使用updated_at

    protected $table = 'income_statement';

    protected $fillable = [
        'id',
        'created_at',
        'olo',
        'user_id',
        'binggan',
        'user_id_target',
        'binggan_target',
        'content',
        'type',
        'thread_id',
        'thread_title',
        'post_id',
        'floor',
    ];

    protected $hidden = [
        'id',
        'user_id',
        'binggan',
        'user_id_target',
        'binggan_target',
        'post_id',
    ];

    public function User()
    {
        return $this->belongsTo(User::class);
    }

    public function Thread()
    {
        return $this->belongsTo(Thread::class);
    }

    protected function serializeDate($date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    //查询收支表
    public static function incomeData($user_id, $date, ?array $type = null)
    {
        $date = Carbon::parse($date);
        $income_table = 'income_statement_' . $date->year;

        //用子查询join
        $sql_child = DB::table($income_table)
            ->select('id')
            ->where('user_id', $user_id)
            ->whereDate('created_at', '=', $date->toDateString());

        if ($type) {
            //如果有传入type，则筛选符合类型的type
            $sql_child->whereIn('type', $type);
        }

        $income = IncomeStatement::suffix($date->year)
            ->joinSub($sql_child, 'sql_child', function ($join) use ($income_table) {
                $join->on($income_table . '.id', '=', 'sql_child.id');
            })
            ->orderByDesc('created_at')
            ->get();

        return $income;
    }

    //查询收支表(V2改为期间查询)
    public static function incomeData_v2(int $user_id, int  $start_ts, int $end_ts, ?array $type = null)
    {
        function query(int $user_id, Carbon $from_date, Carbon $to_date, ?array $type = null)
        {
            $income_table = 'income_statement_' . $from_date->year;
            //用子查询join
            $sql_child = DB::table($income_table)
                ->select('id')
                ->where('user_id', $user_id)
                ->whereBetween('created_at', [$from_date, $to_date]);

            if ($type) {
                //如果有传入type，则筛选符合类型的type
                $sql_child->whereIn('type', $type);
            }

            $income = IncomeStatement::suffix($from_date->year)
                ->joinSub($sql_child, 'sql_child', function ($join) use ($income_table) {
                    $join->on($income_table . '.id', '=', 'sql_child.id');
                })
                ->orderByDesc('created_at')
                ->get();

            return $income;
        }

        $from_date = Carbon::createFromTimestamp($start_ts / 1000)->startOfDay(); //凑整为当日的0分0秒。
        $to_date = Carbon::createFromTimestamp($end_ts / 1000)->addDay()->startOfDay();    //凑整为第二天的0分0秒。也就是查询是闭区间[]

        //如果是跨年的话，需要两个表分别查询然后合并
        if ($from_date->year === $to_date->year) {
            $income = query($user_id, $from_date,  $to_date,  $type);
        } else {
            $middle_date =  $to_date->copy()->startOfYear();
            $income = query($user_id, $middle_date, $to_date, $type)->merge(query($user_id, $from_date, $middle_date, $type));
        }

        return $income;
    }
}
