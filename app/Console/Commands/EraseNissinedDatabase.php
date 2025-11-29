<?php

namespace App\Console\Commands;

use App\Models\Battle;
use App\Models\BattleMessage;
use App\Models\Post;
use App\Models\Thread;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class EraseNissinedDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'EraseNissinedDatabase:run';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '清空已日清的数据（posts表、battle表、battle_messages表、failed_jobs表）';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->confirm('确定要清空已日清的数据吗？记得先备份！')) {
            return False;
        }

        $this->info('正在开始清理数据');
        $nissined_threads_id = Thread::where('has_nissined', 1)
            ->where('forum_id', '<>', 419) //咒岛不清
            ->pluck('id');
        Log::channel('database_log')->info('nissined_thread_id', [$nissined_threads_id]);

        $num_nissined_threads = count($nissined_threads_id);
        $this->info(sprintf('已日清的主题数：%d个', $num_nissined_threads));
        Log::channel('database_log')->info(sprintf('已日清的主题数：%d个', $num_nissined_threads));


        $this->info('开始清理posts表');
        $bar = $this->output->createProgressBar($num_nissined_threads);
        $bar->setFormat(' %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%/%estimated:-6s% %message%');
        $bar->start();

        foreach ($nissined_threads_id as $index => $thread_id) {
            $num_posts = Post::suffix(intval($thread_id / 10000))
                ->where('thread_id', $thread_id)
                ->count();
            Post::suffix(intval($thread_id / 10000))
                ->where('thread_id', $thread_id)
                ->delete();
            $bar->setMessage(sprintf('已清理主题id-%d  共有%d个回复', $thread_id, $num_posts));
            Log::channel('database_log')->info(sprintf('已清理主题id-%d  共有%d个回复', $thread_id, $num_posts));
            $bar->advance();
        }
        $bar->finish();

        $this->info('开始清理battle_messages表');
        $bar = $this->output->createProgressBar($num_nissined_threads);
        $bar->setFormat(' %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%/%estimated:-6s% %message%');
        $bar->start();

        foreach ($nissined_threads_id as $index => $thread_id) {
            $battles_id = Battle::where('thread_id', $thread_id)->pluck('id');
            if ($battles_id != null) {
                $num_battle = Battle::whereIn('id', $battles_id)->count();
                Battle::whereIn('id', $battles_id)->delete();
                // $num_battle_messages = BattleMessage::whereIn('battle_id', $battles_id)->count();
                BattleMessage::whereIn('battle_id', $battles_id)->delete();
            } else {
                $num_battle = 0;
            }
            $bar->setMessage(sprintf('已清理主题id-%d  共有%d个大乱斗', $thread_id, $num_battle));
            Log::channel('database_log')->info(sprintf('已清理主题id-%d  共有%d个大乱斗', $thread_id, $num_battle));
            // Log::channel('database_log')->info(sprintf('已清理主题id-%d  共有%d个大乱斗信息', $thread_id, $num_battle_messages));
            $bar->advance();
        }
        $bar->finish();

        $this->info('开始清理failed_jobs表');
        DB::table('failed_jobs')->truncate();
        Log::channel('database_log')->info('failed_jobs表已清理');


        $this->info('开始释放数据库空间');
        // 生成posts_xx表清单
        $thread_id_max = $nissined_threads_id->max();
        $max_suffix = intval($thread_id_max / 10000);
        $posts_tables = [];
        for ($i = 1; $i <= $max_suffix; $i++) {
            $posts_tables[] = 'posts_' . $i;
        }
        // 对所有posts_xx表执行alter table操作，以释放空间
        foreach ($posts_tables as $key => $table_name) {
            DB::raw(sprintf('ALTER TABLE %s', $table_name));
            $this->info(sprintf('已执行：ALTER TABLE %s', $table_name));
        }
        //对其他表执行alter table操作
        DB::raw('ALTER TABLE battle_messages');
        $this->info('ALTER TABLE battle_messages');
        DB::raw('ALTER TABLE failed_jobs');
        $this->info('ALTER TABLE failed_jobs');

        $this->info('数据库空间释放完成');

        $this->info('全部清理完成');

        return True;
    }
}
