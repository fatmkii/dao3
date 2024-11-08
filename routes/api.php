<?php

use App\Http\Controllers\API\AdminActivesController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CommonController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ForumController;
use App\Http\Controllers\API\PostController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ThreadController;
use App\Http\Controllers\API\HongbaoController;
use App\Http\Controllers\API\HongbaoPostController;
use App\Http\Controllers\API\BattleController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\CrowdController;
use App\Http\Controllers\API\EmojiConstestController;
use App\Http\Controllers\API\GambleController;
use App\Http\Controllers\API\VoteController;

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
    Route::post('/set_password', [AuthController::class, 'set_password'])->middleware('CheckBinggan:create');   //设定饼干密码
});


//User系列
Route::prefix('user')->middleware('auth:sanctum')->group(function () {
    Route::post('/show', [UserController::class, 'show']); //获得用户信息
    Route::get('/check_reg_record', [UserController::class, 'check_reg_record'])->withoutMiddleware('auth:sanctum'); //返回注册记录TTL
    Route::post('/register', [UserController::class, 'create'])->withoutMiddleware('auth:sanctum');   //新建饼干
    Route::post('/create_custom', [UserController::class, 'create_custom'])->middleware('CheckBinggan:create');   //新建自定义饼干
    Route::post('/reward', [UserController::class, 'reward'])->middleware('CheckBinggan:create');     //打赏
    Route::post('/pingbici_set', [UserController::class, 'pingbici_set'])->middleware('CheckBinggan:create');     //设定屏蔽词
    Route::post('/pingbici_add', [UserController::class, 'pingbici_add'])->middleware('CheckBinggan:create');     //追加屏蔽词
    Route::post('/my_emoji_set', [UserController::class, 'my_emoji_set'])->middleware('CheckBinggan:create');     //设定表情包
    Route::post('/my_emoji_add', [UserController::class, 'my_emoji_add'])->middleware('CheckBinggan:create');     //追加表情包
    Route::post('/water_unlock', [UserController::class, 'water_unlock'])->middleware('CheckBinggan:create');     //解除灌水锁定
    Route::post('/user_lv_up', [UserController::class, 'user_lv_up'])->middleware('CheckBinggan:create');  //升级饼干
    Route::get('/user_lv_show', [UserController::class, 'user_lv_show'])->middleware('CheckBinggan:show');  //查看饼干等级信息
    // Route::post('/show_messages_index', [UserController::class, 'show_messages_index'])->middleware('CheckBinggan:show'); //获得站内消息列表
    // Route::post('/show_messages_content', [UserController::class, 'show_messages_content'])->middleware('CheckBinggan:show'); //获得站内消息具体内容
    Route::post('/show_medals', [UserController::class, 'show_medals'])->middleware('CheckBinggan:show'); //获得已经获得的成就数据
    Route::post('/show_medal_progress', [UserController::class, 'show_medal_progress'])->middleware('CheckBinggan:show'); //获得某个成就的进度
    Route::get('/my_battle_chara', [UserController::class, 'my_battle_chara_show'])->middleware('CheckBinggan:show'); //查询自定义大乱斗角色
    Route::post('/my_battle_chara_set', [UserController::class, 'my_battle_chara_set'])->middleware('CheckBinggan:create'); //设定自定义大乱斗角色
    Route::post('/bank_deposit', [UserController::class, 'bank_deposit'])->middleware('CheckBinggan:create'); //往银行存款
    Route::post('/bank_withdraw', [UserController::class, 'bank_withdraw'])->middleware('CheckBinggan:create'); //从银行提款
    Route::post('/show_bank', [UserController::class, 'show_bank_deposit'])->middleware('CheckBinggan:show'); //查询银行存款
});

//Admin系列
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::post('/thread_delete', [AdminController::class, 'thread_delete']); //删主题
    Route::delete('/post_delete/{post_id}', [AdminController::class, 'post_delete']); //删帖
    Route::put('/post_recover/{post_id}', [AdminController::class, 'post_recover']); //恢复帖子
    Route::post('/post_delete_all', [AdminController::class, 'post_delete_all']); //删主题内该作者全部回帖
    Route::post('/user_ban', [AdminController::class, 'user_ban']); //碎饼
    Route::post('/user_lock', [AdminController::class, 'user_lock']); //封id（临时）
    Route::post('/set_banner', [AdminController::class, 'set_banner']); //设置版头
    Route::post('/check_post', [AdminController::class, 'check_post']); //查某个回复的用户的状态
    Route::post('/thread_set_top', [AdminController::class, 'thread_set_top']); //设置置顶
    Route::post('/thread_cancel_top', [AdminController::class, 'thread_cancel_top']); //取消置顶
    Route::post('/create_medal', [AdminController::class, 'create_medal']); //对用户发放成就
    Route::post('/set_user_olo', [AdminController::class, 'set_user_olo']); //对用户奖罚olo
    Route::get('/global_setting/{key?}', [AdminController::class, 'get_global_setting']); //读取全局变量
    Route::post('/set_global_setting', [AdminController::class, 'set_global_setting']); //设置全局变量
    // Route::post('/create_annoucement', [AdminController::class, 'create_annoucement']); //发布站内公告
    // Route::get('/annoucement', [AdminController::class, 'show_annoucements']); //查看站内公告
    // Route::delete('/annoucement/{annoucement_id}', [AdminController::class, 'del_annoucements']); //查看站内公告
    // Route::post('/check_jingfen', [AdminController::class, 'check_jingfen']); //查精分
    Route::post('/del_loudspeaker', [AdminController::class, 'del_loudspeaker']); //删除大喇叭
    Route::get('/actives', [AdminActivesController::class, 'show']); //查询管理员操作记录
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
    Route::post('/create_roll', [PostController::class, 'create_roll'])->middleware('CheckBinggan:create'); //新roll点
    Route::put('/recover/{post_id}', [PostController::class, 'recover'])->middleware('CheckBinggan:create'); //恢复删除的帖子
});

//Vote系列
Route::prefix('votes')->middleware('auth:sanctum')->group(function () {
    Route::get('/{vote_id}', [VoteController::class, 'show'])->middleware('CheckBinggan:show'); //显示投票结果
    Route::post('', [VoteController::class, 'store'])->middleware('CheckBinggan:create');  //用户参与投票
});

//Gamble系列
Route::prefix('gambles')->middleware('auth:sanctum')->group(function () {
    Route::get('/{gamble_id}', [GambleController::class, 'show']); //显示菠菜结果
    Route::post('', [GambleController::class, 'store'])->middleware('CheckBinggan:create');  //用户投注
    Route::post('/close', [GambleController::class, 'close']);  //开奖菠菜（只能由管理员操作）
    Route::post('/repeal', [GambleController::class, 'repeal']);  //中止菠菜（只能由管理员操作）
});

//Crowd系列
Route::prefix('crowds')->middleware('auth:sanctum')->group(function () {
    Route::get('/{crowd_id}', [CrowdController::class, 'show']); //显示众筹结果
    Route::post('', [CrowdController::class, 'store'])->middleware('CheckBinggan:create');  //用户参加众筹
    Route::post('/repeal', [CrowdController::class, 'repeal']);  //中止众筹（只能由管理员操作）
});


//IncomeStatement系列
Route::prefix('income')->middleware('auth:sanctum')->group(function () {
    Route::get('/show_day', [UserController::class, 'income_show_day'])->middleware('CheckBinggan:show'); //查看olo收益表（当日）
    Route::get('/show_sum', [UserController::class, 'income_show_sum'])->middleware('CheckBinggan:show'); //查看olo收益表（合计）
});


//Hongbao系列
Route::prefix('hongbao')->middleware('auth:sanctum')->group(function () {
    Route::get('/{hongbao_id}', [HongbaoController::class, 'show'])->middleware('CheckBinggan:show'); //显示红包数据
    Route::post('/store', [HongbaoController::class, 'store'])->middleware('CheckBinggan:show'); //抢主题红包
});

//HongbaoPost系列
Route::prefix('hongbao_post')->middleware('auth:sanctum')->group(function () {
    Route::post('create', [HongbaoPostController::class, 'create'])->middleware('CheckBinggan:create'); //发出新回帖红包
    Route::post('store', [HongbaoPostController::class, 'store'])->middleware('CheckBinggan:create'); //抢回帖红包
});

//Battle系列
Route::prefix('battles')->middleware('auth:sanctum')->group(function () {
    Route::get('/{battle_id}', [BattleController::class, 'show'])->middleware('CheckBinggan:show');  //获取大乱斗数据
    Route::post('', [BattleController::class, 'create'])->middleware('CheckBinggan:create');  //用户发起大乱斗
    Route::post('/c_roll', [BattleController::class, 'challenger_roll'])->middleware('CheckBinggan:create');  //挑战者投色子
});

//Loudspeaker系列
Route::prefix('loudspeaker')->middleware('auth:sanctum')->group(function () {
    Route::get('/show', [UserController::class, 'show_loudspeaker'])->middleware('CheckBinggan:show'); //获取大喇叭信息
    Route::post('/create', [UserController::class, 'create_loudspeaker'])->middleware('CheckBinggan:create'); //发起大喇叭
    Route::post('/repeal', [UserController::class, 'repeal_loudspeaker'])->middleware('CheckBinggan:create'); //撤回大喇叭

});

//EmojiContest系列
Route::prefix('emoji_contest')->middleware('auth:sanctum')->group(function () {
    Route::get('/{emoji_group_id}', [EmojiConstestController::class, 'show'])->where('emoji_group_id', '[0-9]+')->middleware('CheckBinggan:show'); //查询某表情包投票结果
    Route::get('/show_user_votes', [EmojiConstestController::class, 'show_user_votes'])->middleware('CheckBinggan:show'); //查询用户的投票结果
    Route::post('/user_vote', [EmojiConstestController::class, 'user_vote'])->middleware('CheckBinggan:create'); //用户投票
});


//各种杂项
Route::get('/new_binggan_enable', [CommonController::class, 'new_binggan_enable']); //已废弃
Route::get('/new_binggan_check', [CommonController::class, 'new_binggan_enable_check']);
Route::get('/home_banners', [CommonController::class, 'get_home_banners']);
Route::get('/captcha', [CommonController::class, 'get_captcha']);
Route::get('/new_loudspeaker_enable', [CommonController::class, 'new_loudspeaker_enable']);
Route::post('/img_upload', [CommonController::class, 'img_upload'])->middleware(['auth:sanctum', 'CheckBinggan:create']); //上传图片
Route::post('/store_pool', [CommonController::class, 'store_hongbao_pool'])->middleware('auth:sanctum', 'CheckBinggan:create'); //投入祝福池
Route::get('/get_pool', [CommonController::class, 'get_hongbao_pool'])->middleware('auth:sanctum', 'CheckBinggan:show'); //获取祝福池信息