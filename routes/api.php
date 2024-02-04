<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CommonController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ForumController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ThreadController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//Auth系列
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->Middleware('throttle:login')->withoutMiddleware('auth:sanctum'); //导入饼干
    Route::post('/logout', [AuthController::class, 'logout']); //退出饼干
    // Route::post('/set_password', [AuthController::class, 'set_password'])->middleware('CheckBinggan:create');   //设定饼干密码
});


//User系列
Route::prefix('user')->middleware('auth:sanctum')->group(function () {
    Route::post('/register', [UserController::class, 'create'])->withoutMiddleware('auth:sanctum');   //新建饼干
    Route::post('/show', [UserController::class, 'show']); //获得用户信息
});

//Forum系列
Route::prefix('forums')->middleware('auth:sanctum')->group(function () {
    Route::get('', [ForumController::class, 'index'])->withoutMiddleware('auth:sanctum'); //查看板块列表
    Route::get('/{forum_id}', [ForumController::class, 'show'])->middleware('CheckBinggan:show'); //查看板块内主题列表（包括延时主题）
});

//thread系列
Route::prefix('threads')->middleware('auth:sanctum')->group(function () {
    // Route::get('/{Thread_id}', [ThreadController::class, 'show'])->middleware('CheckBinggan:show'); //查看主题
    // Route::post('/create', [ThreadController::class, 'create'])->middleware('CheckBinggan:create'); //发新主题
    Route::delete('/delay/{Thread_id}', [ThreadController::class, 'delay_thread_withdraw'])->middleware('CheckBinggan:create'); //撤回延时主题
    // Route::post('/change_color', [ThreadController::class, 'change_color'])->middleware('CheckBinggan:create'); //改标题颜色
});

//各种杂项
Route::get('/new_binggan_enable', [CommonController::class, 'new_binggan_enable']);
Route::get('/home_banners', [CommonController::class, 'get_home_banners']);
