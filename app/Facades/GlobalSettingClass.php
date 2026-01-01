<?php

namespace App\Facades;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


class GlobalSettingClass
{
    const TABLENAME = 'global_setting';


    public function get(string $key)
    {
        $value = json_decode(DB::table(self::TABLENAME)->where('key', $key)->value('value'));
        return $value;
    }

    public function get_all()
    {
        $data = DB::table(self::TABLENAME)->get();
        $keyed = $data->mapWithKeys(function ($item) {
            return [$item->key =>  json_decode($item->value)];
        });
        return $keyed;
    }

    public function set(string $key, $value)
    {
        if (gettype($value) == 'array') {
            $value = json_encode($value);
        }

        DB::table(self::TABLENAME)
            ->updateOrInsert(
                ['key' => $key],
                ['value' => $value]
            );
    }

    public function get_tax(string $name, ?Carbon $time = null, ?int $hongbao_num = 0)
    {
        //各种税率整合
        $is_festival = false;
        $festival_days = [
            ['month' => 6, 'day' => 18],
            ['month' => 11, 'day' => 11],
            ['month' => 2, 'day' => 16], //TODO，春节用每次都要改，26年已改
            ['month' => 2, 'day' => 17], //TODO，春节用每次都要改，26年已改
        ];

        $is_october_1st = false;


        if ($time == null) {
            $time = Carbon::now();
        }

        foreach ($festival_days as $date) {
            if ($time->month == $date['month'] && $time->day == $date['day']) {
                $is_festival = true;
            }
        }

        if ($time->month == 10 && $time->day == 1) {
            //25年国庆红包0税率
            $is_october_1st = true;
        }

        switch ($name) {
            case 'normal': {
                    //一般税率1.07（打赏等），活动时候1.02
                    $tax_rate = $is_festival ? 1.02 : 1.07;
                    break;
                }
            case 'battle': {
                    //税率4%，也就是奖金是1.96倍。活动时候1.98
                    $tax_rate = $is_festival ? 1.98 : 1.96;
                    break;
                }
            case 'hongbao': {
                    //红包税率。
                    if ($is_festival) {
                        $tax_rate = 1.02;
                    } elseif ($is_october_1st && $hongbao_num >= 20) {
                        //25年国庆特别地0税率（红包数量大于20时）
                        $tax_rate = 1;
                    } else {
                        $tax_rate = 1.07;
                    }
                    break;
                }
        }

        return $tax_rate;
    }
}
