<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

// Artisan::command('inspire', function () {
//     $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote')->hourly();

Schedule::command('sanctum:prune-expired --hours=24')->daily(); //每天删除一次过期token
Schedule::command('BattlePolling:run')->everyMinute(); //过期大乱斗处理
Schedule::command('DailyNissinHandle:run')->dailyAt('8:00'); //日清的处理
Schedule::command('DelayThreadHandle:run')->dailyAt('8:00'); //延迟主题的处理，务必要要在日清处理之后！

//定时重启Echo-server（2.0下线之前要保留）
Schedule::exec('supervisorctl restart Laravel-Echo-server:Laravel-Echo-server_00')
    ->dailyAt('3:00')
    ->sendOutputTo('/var/log/Laravel-schedule.log');


//定时检查全局搜索的redis计时器失效
Schedule::call(function () {
    if (Redis::TTL('search_record_global') == -1) {
        Log::channel('my_log')->error('search_record_global expired failed');
        Redis::del('search_record_global');
    }
})->everyMinute();
