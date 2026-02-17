<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyData extends Model
{
    // 表名
    protected $table = 'daily_data';

    // 可批量赋值字段
    protected $fillable = ['date', 'login_count'];

    // 类型转换
    protected $casts = [
        'date' => 'date:Y-m-d',
    ];
}
