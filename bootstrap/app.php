<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\CheckBinggan;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        channels: __DIR__ . '/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'CheckBinggan' => CheckBinggan::class
        ]);
        // $middleware->priority([
        //     \Illuminate\Contracts\Auth\Middleware\AuthenticatesRequests::class, //需要先执行过auth，才能在获得$request->user()
        //     \Illuminate\Auth\Middleware\Authorize::class,
        //     \App\Http\Middleware\CheckBinggan::class,
        // ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
