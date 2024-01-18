<?php

namespace App\Providers;

use App\Facades\GlobalSettingClass;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        $this->app->bind('GlobalSetting', function () {
            return new GlobalSettingClass();
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
        //
    }
}
