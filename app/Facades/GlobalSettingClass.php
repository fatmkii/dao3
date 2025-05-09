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

    public function get_tax(string $name, Carbon $time = null)
    {
        //各种税率整合

        $is_festival = false;
        $festival_days = [
            ['month' => 6, 'day' => 18],
            ['month' => 11, 'day' => 11],
            ['month' => 1, 'day' => 28], //TODO，春节用每次都要改
            ['month' => 1, 'day' => 29], //TODO，春节用每次都要改
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
                    //一般税率1.07（打赏、红包等），活动时候1.02
                    $tax_rate = $is_festival ? 1.02 : 1.07;
                    break;
                }
            case 'battle': {
                    //税率4%，也就是奖金是1.96倍。活动时候1.98
                    $tax_rate = $is_festival ? 1.98 : 1.96;
                    break;
                }
        }

        return $tax_rate;
    }
}
