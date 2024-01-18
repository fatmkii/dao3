<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ForumController;
use App\Http\Controllers\API\UserController;

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
    // Route::post('/admin_login', [AuthController::class, 'admin_login']);  //管理员登录(计划废弃)
    Route::post('/logout', [AuthController::class, 'logout']); //退出饼干
    // Route::post('/set_password', [AuthController::class, 'set_password'])->middleware('CheckBinggan:create');   //设定饼干密码
});


//User系列
Route::prefix('user')->middleware('auth:sanctum')->group(function () {
    Route::post('/register', [UserController::class, 'create'])->withoutMiddleware('auth:sanctum');   //新建饼干
    Route::post('/show', [UserController::class, 'show']); //获得用户信息
});

//Forum系列
Route::prefix('forums')->group(function () {
    Route::get('', [ForumController::class, 'index']); //查看板块列表
    // Route::get('/{forum_id}', [ForumController::class, 'show'])->middleware('CheckBinggan:show'); //查看板块内主题列表
    // Route::get('/delay/{forum_id}', [ForumController::class, 'show_delay'])->middleware('CheckBinggan:show'); //查看板块内延时发送主题列表
});
