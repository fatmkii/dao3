<?php

namespace App\Console\Commands;

use App\Models\Battle;
use App\Models\BattleMessage;
use App\Models\Post;
use App\Models\Thread;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;


class EraseNissinedDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'EraseNissinedDatabase:run {--force : Skip confirmation prompt}';

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
        // 默认要求人工确认；定时任务或自动化场景可用 --force 跳过交互。
        if (!$this->option('force') && !$this->confirm('确定要清空已日清的数据吗？记得先备份！')) {
            return self::SUCCESS;
        }

        try {
            $this->info('正在开始清理数据');

            // 仅清理“已日清”且非咒岛(419)的主题，后续所有删除都基于该集合。
            $baseQuery = Thread::query()
                ->where('has_nissined', 1)
                ->where('forum_id', '<>', 419); // 咒岛不清

            $numNissinedThreads = (clone $baseQuery)->count();
            $this->info(sprintf('已日清的主题数：%d个', $numNissinedThreads));
            Log::channel('database_log')->info(sprintf('已日清的主题数：%d个', $numNissinedThreads));

            $this->info('开始批量清理 posts / battle_messages / battle');
            $bar = $this->output->createProgressBar($numNissinedThreads);
            $bar->setFormat(' %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%/%estimated:-6s% %message%');
            $bar->start();

            $totalPostsDeleted = 0;
            $totalBattlesDeleted = 0;
            $totalBattleMessagesDeleted = 0;
            $maxThreadId = 0;

            // 用 chunkById 流式处理，避免一次性 pluck 全量 thread_id 导致内存/SQL 压力。
            $baseQuery->select('id')->orderBy('id')->chunkById(1000, function ($threads) use (
                $bar,
                &$totalPostsDeleted,
                &$totalBattlesDeleted,
                &$totalBattleMessagesDeleted,
                &$maxThreadId
            ) {
                $threadIds = $threads->pluck('id')->all();
                if (empty($threadIds)) {
                    return;
                }

                $maxThreadId = max($maxThreadId, (int) max($threadIds));

                // posts 是按 thread_id/10000 分表的：同后缀的 thread_id 合并后批量删除，减少查询次数。
                $threadIdsBySuffix = [];
                foreach ($threadIds as $threadId) {
                    $suffix = (int) ($threadId / 10000);
                    if (!isset($threadIdsBySuffix[$suffix])) {
                        $threadIdsBySuffix[$suffix] = [];
                    }
                    $threadIdsBySuffix[$suffix][] = $threadId;
                }

                foreach ($threadIdsBySuffix as $suffix => $groupedThreadIds) {
                    $totalPostsDeleted += Post::suffix($suffix)
                        ->whereIn('thread_id', $groupedThreadIds)
                        ->delete();
                }

                // 先拿 battle_id，再批量删除 battle_messages 和 battles（避免逐主题 N+1）。
                $battleIds = Battle::whereIn('thread_id', $threadIds)->pluck('id');
                if ($battleIds->isNotEmpty()) {
                    $battleIdList = $battleIds->all();
                    $totalBattleMessagesDeleted += BattleMessage::whereIn('battle_id', $battleIdList)->delete();
                    $totalBattlesDeleted += Battle::whereIn('id', $battleIdList)->delete();
                }

                $bar->setMessage(sprintf('批次处理完成：%d个主题', count($threadIds)));
                $bar->advance(count($threadIds));
            });

            $bar->finish();
            $this->newLine();

            Log::channel('database_log')->info(sprintf('posts删除数：%d', $totalPostsDeleted));
            Log::channel('database_log')->info(sprintf('battle删除数：%d', $totalBattlesDeleted));
            Log::channel('database_log')->info(sprintf('battle_messages删除数：%d', $totalBattleMessagesDeleted));

            $this->info(sprintf('posts删除数：%d', $totalPostsDeleted));
            $this->info(sprintf('battle删除数：%d', $totalBattlesDeleted));
            $this->info(sprintf('battle_messages删除数：%d', $totalBattleMessagesDeleted));

            $this->info('开始清理failed_jobs表');
            DB::table('failed_jobs')->truncate();
            Log::channel('database_log')->info('failed_jobs表已清理');

            $this->info('开始释放数据库空间');
            // 通过 ALTER TABLE ... ENGINE=InnoDB 触发表重建，回收删除后的物理空间。
            $this->optimizeTables($maxThreadId);
            $this->info('数据库空间释放完成');

            $this->info('全部清理完成');
            return self::SUCCESS;
        } catch (Throwable $e) {
            Log::channel('database_log')->error('EraseNissinedDatabase运行失败', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            $this->error('清理失败：' . $e->getMessage());
            return self::FAILURE;
        }
    }

    private function optimizeTables(int $maxThreadId): void
    {
        // 根据本次处理到的最大 thread_id 推导需要整理的 posts_x 分表范围。
        if ($maxThreadId > 0) {
            $maxSuffix = (int) ($maxThreadId / 10000);
            for ($i = 1; $i <= $maxSuffix; $i++) {
                $tableName = 'posts_' . $i;
                DB::statement(sprintf('ALTER TABLE %s ENGINE=InnoDB', $tableName));
                $this->info(sprintf('已执行：ALTER TABLE %s ENGINE=InnoDB', $tableName));
            }
        }
        // 其他相关大表同样执行重建回收空间。
        DB::statement('ALTER TABLE battle_messages ENGINE=InnoDB');
        $this->info('ALTER TABLE battle_messages ENGINE=InnoDB');
        DB::statement('ALTER TABLE failed_jobs ENGINE=InnoDB');
        $this->info('ALTER TABLE failed_jobs ENGINE=InnoDB');
    }
}
