<?php

namespace App\Common;

use Illuminate\Support\Carbon;

class NewBingganChecker
{

    //开放饼干的日期列表
    //这里仅日期有用，年份无所谓
    //必须从小往大排列
    //由于农历的关系，这个列表必须每年维护…………呃呃
    const DATE_MAP = [
        '2025-2-1',
        '2025-2-8', //临时开放
        '2025-2-9', //临时开放
        '2025-3-1',
        '2025-4-1',
        '2025-5-1',
        '2025-5-31', //端午1天
        '2025-6-1',
        '2025-6-18',
        '2025-7-1',
        '2025-8-1',
        '2025-9-1',
        '2025-10-1',
        '2025-10-2',
        '2025-10-3',
        '2025-10-6', //中秋1天
        '2025-11-1', 
        '2025-11-11',
        '2025-12-1',
        '2026-1-1',
        '2026-2-17', //春节3天
        '2026-2-18', //春节3天
        '2026-2-19', //春节3天
    ];

    public static function check()
    {
        $now = Carbon::now();
        $flag = false;
        $next_date = Carbon::parse(self::DATE_MAP[0]);
        $next_date->setYear($now->year + 1); //如果下面的遍历均未找到，则next_date是下一年的第一个日期

        foreach (self::DATE_MAP as $date_str) {
            $current_date = Carbon::parse($date_str);
            $current_date->setYear($now->year); //将需要判断的日期设置为当前年份，方便对比

            if ($current_date->isSameDay($now)) {
                //如果是同一天，则开放饼干
                $flag = true;
            }

            if ($current_date->isFuture()) {
                //如果遍历到第一个是未来的日期，则跳出循环并返回该日期
                $next_date = $current_date;
                break;
            }
        }

        return [$flag, $current_date];
    }
}
