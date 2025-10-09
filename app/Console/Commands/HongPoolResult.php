<?php

namespace App\Console\Commands;

use App\Models\Post;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HongPoolResult extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'HongPoolResult:run';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '发放祝福池奖励';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info("准备发放本次祝福池奖励");

        do {
            $thread_id = $this->ask('请输入本次祝福池thread_id:');
        } while (!ctype_digit($thread_id));
        if (!$this->confirm('是否确认thread_id: ' . $thread_id)) {
            return False;
        }

        $hongbao_pools = DB::table("hongbao_pool")->get(['id', 'user_id']);
        $olo_total = DB::table('hongbao_pool')->sum('olo');

        $this->info('投入用户共有：' . count($hongbao_pools));
        $this->info('olo总数' . $olo_total);

        $hongbao_pools_shuffled = $hongbao_pools->shuffle();

        $rank_0 = $hongbao_pools_shuffled->slice(0, 1);
        $rank_1 = $hongbao_pools_shuffled->slice(1, 4);
        $rank_2 = $hongbao_pools_shuffled->slice(5, 10);

        foreach ($rank_0 as $key => $pool_id) {
            $hongbao_pool = DB::table('hongbao_pool')->find($pool_id->id);
            $this->info('特等奖用户:' . $pool_id->user_id);
            $this->info($hongbao_pool->message);
        }
        foreach ($rank_1 as $key => $pool_id) {
            $hongbao_pool = DB::table('hongbao_pool')->find($pool_id->id);
            $this->info('一等奖用户:' . $pool_id->user_id);
            $this->info($hongbao_pool->message);
        }
        foreach ($rank_2 as $key => $pool_id) {
            $hongbao_pool = DB::table('hongbao_pool')->find($pool_id->id);
            $this->info('二等奖用户:' . $pool_id->user_id);
            $this->info($hongbao_pool->message);
        }


        if (!$this->confirm('是否确认以上结果？')) {
            return False;
        }
        $this->info("开始发放奖励回复");

        $message_format = "<span class='quote_content'>%s <br> №%s 祝福池系统  %s </span> <br> %s 共有%d个olo！";

        foreach ($rank_2 as $key => $pool_id) {
            //处理二等奖
            $user = User::find($pool_id->user_id);
            $hongbao_pool = DB::table('hongbao_pool')->find($pool_id->id);
            $post = Post::suffix(intval($thread_id / 10000))->find($hongbao_pool->post_id);
            $olo = ceil($olo_total * 0.01);
            $message = sprintf($message_format, $post->content, $hongbao_pool->floor, Carbon::parse($post->created_at)->toDateTimeString(), '感谢你的祝福~！恭喜获得二等奖，祝福池的1%', $olo);

            $this->info('二等奖用户:' . $user->binggan);
            Log::channel('temp_log')->info('二等奖用户:', [$user->binggan]);

            try {
                DB::beginTransaction();

                $post = Post::create([
                    'created_binggan' => $user->binggan,
                    'forum_id' => 2,
                    'thread_id' => $thread_id,
                    'content' => $message,
                    'nickname' => '祝福池系统',
                    'created_by_admin' => 2,
                    'created_IP' => '127.0.0.1',
                ]);


                $user->coinChange(
                    'normal', //记录类型
                    [
                        'olo' => $olo,
                        'content' => '国庆祝福池',
                        'thread_id' => $thread_id,
                        'thread_title' => "国庆祝福池活动",
                        'post_id' => $post->id,
                        'floor' => $post->floor,
                        'type' => 'hongbao_in',
                    ]
                );
                $user->save();

                DB::commit();
            } catch (Exception $e) {
                DB::rollback();
                throw $e;
            }
        }



        foreach ($rank_1 as $key => $pool_id) {
            //处理一等奖
            $user = User::find($pool_id->user_id);
            $hongbao_pool = DB::table('hongbao_pool')->find($pool_id->id);
            $post = Post::suffix(intval($thread_id / 10000))->find($hongbao_pool->post_id);
            $olo = ceil($olo_total * 0.1);
            $message = sprintf($message_format, $post->content, $hongbao_pool->floor, Carbon::parse($post->created_at)->toDateTimeString(), '感谢你的祝福~！恭喜获得一等奖，祝福池的10%', $olo);

            $this->info('一等奖用户:' . $user->binggan);
            Log::channel('temp_log')->info('一等奖用户:', [$user->binggan]);

            try {
                DB::beginTransaction();

                $post = Post::create([
                    'created_binggan' => $user->binggan,
                    'forum_id' => 2,
                    'thread_id' => $thread_id,
                    'content' => $message,
                    'nickname' => '祝福池系统',
                    'created_by_admin' => 2,
                    'created_IP' => '127.0.0.1',
                ]);


                $user->coinChange(
                    'normal', //记录类型
                    [
                        'olo' => $olo,
                        'content' => '国庆祝福池',
                        'thread_id' => $thread_id,
                        'thread_title' => "国庆祝福池活动",
                        'post_id' => $post->id,
                        'floor' => $post->floor,
                        'type' => 'hongbao_int',
                    ]
                );
                $user->save();


                DB::commit();
            } catch (Exception $e) {
                DB::rollback();
                throw $e;
            }
        }




        foreach ($rank_0 as $key => $pool_id) {
            //处理特等奖
            $user = User::find($pool_id->user_id);
            $hongbao_pool = DB::table('hongbao_pool')->find($pool_id->id);
            $post = Post::suffix(intval($thread_id / 10000))->find($hongbao_pool->post_id);
            $olo = ceil($olo_total * 0.5);
            $message = sprintf($message_format, $post->content, $hongbao_pool->floor, Carbon::parse($post->created_at)->toDateTimeString(), '哇喔！恭喜获得唯一至尊超级无敌特等奖！祝福池的50%', $olo);

            $this->info('特等奖用户:' . $user->binggan);
            Log::channel('temp_log')->info('特等奖用户:', [$user->binggan]);

            try {
                DB::beginTransaction();

                $post = Post::create([
                    'created_binggan' => $user->binggan,
                    'forum_id' => 2,
                    'thread_id' => $thread_id,
                    'content' => $message,
                    'nickname' => '祝福池系统',
                    'created_by_admin' => 2,
                    'created_IP' => '127.0.0.1',
                ]);


                $user->coinChange(
                    'normal', //记录类型
                    [
                        'olo' => $olo,
                        'content' => '国庆祝福池',
                        'thread_id' => $thread_id,
                        'thread_title' => "国庆祝福池活动",
                        'post_id' => $post->id,
                        'floor' => $post->floor,
                        'type' => 'hongbao_in',
                    ]
                );
                $user->save();

                DB::commit();
            } catch (Exception $e) {
                DB::rollback();
                throw $e;
            }
        }

        return true;
    }
}
