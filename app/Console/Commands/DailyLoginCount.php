<?php

namespace App\Console\Commands;

use App\Models\DailyData;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class DailyLoginCount extends Command
{
    /**
     * 控制台命令名称
     *
     * @var string
     */
    protected $signature = 'DailyLoginCount:run';

    /**
     * 控制台命令描述
     *
     * @var string
     */
    protected $description = '统计前一天的登录binggan数并写入daily_data表';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // 统计前一天（yesterday 00:00:00 ~ today 00:00:00）内登录过的binggan数
        $yesterday = Carbon::yesterday();
        $today = Carbon::today();

        $count = User::where('last_login', '>=', $yesterday)
            ->where('last_login', '<', $today)
            ->count();

        // 写入daily_data表（如果当天已有记录则更新）
        DailyData::updateOrCreate(
            ['date' => $yesterday->toDateString()],
            ['login_count' => $count]
        );

        $this->info("已统计 {$yesterday->toDateString()} 的登录数：{$count}");

        return 0;
    }
}
