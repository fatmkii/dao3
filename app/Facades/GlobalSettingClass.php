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
            ['month' => 2, 'day' => 5], //TODO，春节用每次都要改，27年已改
            ['month' => 2, 'day' => 6], //TODO，春节用每次都要改，27年已改
        ];


        if ($time == null) {
            $time = Carbon::now();
        }

        foreach ($festival_days as $date) {
            if ($time->month == $date['month'] && $time->day == $date['day']) {
                $is_festival = true;
            }
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
                    } else {
                        $tax_rate = 1.07;
                    }
                    break;
                }
        }

        return $tax_rate;
    }
}
