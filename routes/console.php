<?php

use App\Models\Loudspeaker;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

Schedule::command('sanctum:prune-expired --hours=24')->dailyAt('4:00');; //每天删除一次过期token
Schedule::command('BattlePolling:run')->everyMinute(); //过期大乱斗处理
Schedule::command('DailyNissinHandle:run')->dailyAt('8:00'); //日清的处理
Schedule::command('DelayThreadHandle:run')->dailyAt('8:00'); //延迟主题的处理，务必要要在日清处理之后！

//定时检查全局搜索的redis计时器失效
Schedule::call(function () {
    if (Redis::TTL('search_record_global') == -1) {
        Log::channel('common')->error('search_record_global expired failed');
        Redis::del('search_record_global');
    }
})->everyMinute();

//每分钟检查过期大喇叭
$schedule->call(function () {
    Loudspeaker::where('expire_date', "<", Carbon::now())->delete();
})->everyMinute();
