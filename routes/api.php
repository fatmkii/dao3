<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CommonController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ForumController;
use App\Http\Controllers\API\PostController;
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

    // Route::post('/create_custom', [UserController::class, 'create_custom'])->middleware('CheckBinggan:create');   //新建自定义饼干
    Route::post('/reward', [UserController::class, 'reward'])->middleware('CheckBinggan:create');     //打赏
    // Route::get('/check_reg_record', [UserController::class, 'check_reg_record']); //返回注册记录TTL
    // Route::post('/pingbici_set', [UserController::class, 'pingbici_set'])->middleware('CheckBinggan:create');     //设定屏蔽词
    // Route::post('/pingbici_add', [UserController::class, 'pingbici_add'])->middleware('CheckBinggan:create');     //追加屏蔽词
    Route::post('/my_emoji_set', [UserController::class, 'my_emoji_set'])->middleware('CheckBinggan:create');     //设定表情包
    Route::post('/my_emoji_add', [UserController::class, 'my_emoji_add'])->middleware('CheckBinggan:create');     //追加表情包
    Route::post('/water_unlock', [UserController::class, 'water_unlock'])->middleware('CheckBinggan:create');     //解除灌水锁定
    // Route::post('/user_lv_up', [UserController::class, 'user_lv_up'])->middleware('CheckBinggan:create');
    // Route::get('/user_lv_show', [UserController::class, 'user_lv_show'])->middleware('CheckBinggan:show');
    // Route::post('/show_messages_index', [UserController::class, 'show_messages_index'])->middleware('CheckBinggan:show'); //获得站内消息列表
    // Route::post('/show_messages_content', [UserController::class, 'show_messages_content'])->middleware('CheckBinggan:show'); //获得站内消息具体内容
    // Route::post('/show_medals', [UserController::class, 'show_medals'])->middleware('CheckBinggan:show'); //获得已经获得的成就数据
    // Route::post('/show_medal_progress', [UserController::class, 'show_medal_progress'])->middleware('CheckBinggan:show'); //获得某个成就的进度
    // Route::get('/my_battle_chara', [UserController::class, 'my_battle_chara_show'])->middleware('CheckBinggan:show'); //获得已经获得的成就数据
    // Route::post('/my_battle_chara_set', [UserController::class, 'my_battle_chara_set'])->middleware('CheckBinggan:create'); //获得已经获得的成就数据
    // Route::post('/bank_deposit', [UserController::class, 'bank_deposit'])->middleware('CheckBinggan:create'); //往银行存款
    // Route::post('/bank_withdraw', [UserController::class, 'bank_withdraw'])->middleware('CheckBinggan:create'); //从银行提款
    // Route::post('/show_bank', [UserController::class, 'show_bank_deposit'])->middleware('CheckBinggan:show'); //查询银行存款
});

//Forum系列
Route::prefix('forums')->middleware('auth:sanctum')->group(function () {
    Route::get('', [ForumController::class, 'index'])->withoutMiddleware('auth:sanctum'); //查看板块列表
    Route::get('/{forum_id}', [ForumController::class, 'show'])->middleware('CheckBinggan:show'); //查看板块内主题列表（包括延时主题）
});

//thread系列
Route::prefix('threads')->middleware('auth:sanctum')->group(function () {
    Route::get('/{Thread_id}', [ThreadController::class, 'show'])->middleware('CheckBinggan:show'); //查看主题
    Route::post('/create', [ThreadController::class, 'create'])->middleware('CheckBinggan:create'); //发新主题
    Route::delete('/delay/{Thread_id}', [ThreadController::class, 'delay_thread_withdraw'])->middleware('CheckBinggan:create'); //撤回延时主题
    Route::post('/change_color', [ThreadController::class, 'change_color'])->middleware('CheckBinggan:create'); //改标题颜色
});

//Post系列
Route::prefix('posts')->middleware('auth:sanctum')->group(function () {
    Route::get('/{id}', [PostController::class, 'show'])->middleware('CheckBinggan:show'); //获得单个帖子数据
    Route::post('/create', [PostController::class, 'create'])->middleware('CheckBinggan:create'); //新帖子
    Route::delete('/{id}', [PostController::class, 'destroy'])->middleware('CheckBinggan:create'); //删除帖子
    // Route::post('/create_roll', [PostController::class, 'create_roll'])->middleware('CheckBinggan:create'); //新roll点
    Route::put('/recover/{post_id}', [PostController::class, 'recover'])->middleware('CheckBinggan:create'); //恢复删除的帖子
});

//各种杂项
Route::get('/new_binggan_enable', [CommonController::class, 'new_binggan_enable']);
Route::get('/home_banners', [CommonController::class, 'get_home_banners']);
// Route::get('/emoji', [CommonController::class, 'emoji_index']);
// Route::get('/subtitles', [CommonController::class, 'subtitles_index']);
// Route::get('/random_heads', [CommonController::class, 'random_heads_index']);
Route::get('/captcha', [CommonController::class, 'get_captcha']);
// Route::get('/new_loudspeaker_enable', [CommonController::class, 'new_loudspeaker_enable']);
// Route::post('/img_upload', [CommonController::class, 'img_upload'])->middleware('CheckBinggan:create'); //上传图片
// Route::post('/store_pool', [CommonController::class, 'store_hongbao_pool'])->middleware('CheckBinggan:create'); //投入祝福池
// Route::get('/get_pool', [CommonController::class, 'get_hongbao_pool'])->middleware('CheckBinggan:show'); //获取祝福池信息