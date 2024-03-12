<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;


class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        //每天删除一次过期token
        $schedule->command('sanctum:prune-expired --hours=24')->daily();

        // $schedule->command('inspire')->hourly();
        $schedule->command('BattlePolling:run')->everyMinute(); //过期大乱斗处理
        $schedule->command('DailyNissinHandle:run')->dailyAt('8:00'); //日清的处理
        $schedule->command('DelayThreadHandle:run')->dailyAt('8:00'); //延迟主题的处理，务必要要在日清处理之后！

        //定时重启Echo-server
        $schedule->exec('supervisorctl restart Laravel-Echo-server:Laravel-Echo-server_00')
            ->dailyAt('3:00')
            ->sendOutputTo('/var/log/Laravel-schedule.log');

        //定时检查全局搜索的redis计时器失效
        $schedule->call(function () {
            if (Redis::TTL('search_record_global') == -1) {
                Log::channel('my_log')->error('search_record_global expired failed');
                Redis::del('search_record_global');
            }
        })->everyMinute();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
