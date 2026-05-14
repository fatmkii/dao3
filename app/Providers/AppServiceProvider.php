<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use \Illuminate\Pagination\LengthAwarePaginator;
use App\Common\MyPaginator;
use App\Facades\GlobalSettingClass;

use App\Models\Post;
use App\Services\AntiSpamService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //自定义的分页器，减少多余的返回数据以节省流量
        $this->app->bind(LengthAwarePaginator::class, MyPaginator::class);

        $this->app->bind('GlobalSetting', function () {
            return new GlobalSettingClass();
        });

        // 注册 AntiSpamService 为单例
        $this->app->singleton(AntiSpamService::class, function ($app) {
            return new AntiSpamService();
        });

        if ($this->app->environment('local')) {
            //仅在本地环境注册使用telescope
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //一般API速率限制480次每分钟（根据IP）  这个疑似没有在使用？？
        RateLimiter::for('api', function (Request $request) {
            // return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
            return Limit::perMinute(480)->by($request->ip());
        });
        //发帖的API速率限制1秒4次（根据IP）
        RateLimiter::for('new_post', function (Request $request) {
            return Limit::perSecond(4)->by($request->ip());
        });
        //登录密码尝试速率限制3次每分钟（根据IP）
        RateLimiter::for('login', function (Request $request) {
            // return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
            return Limit::perMinute(3)->by($request->ip());
        });

        // Post 创建事件监听：自动记录发帖时间线（用于机器人评分）
        Post::created(function (Post $post) {
            // 排除系统消息（大乱斗提示、Roll点结果等）
            if ($post->created_by_admin != 2) {
                app(AntiSpamService::class)->recordPostTimeline(
                    $post->created_binggan,
                    $post->id
                );
            }
        });
    }
}
