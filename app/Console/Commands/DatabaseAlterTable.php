<?php

namespace App\Console\Commands;

use App\Models\Thread;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DatabaseAlterTable extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'DatabaseAlterTable:run';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '通过对posts表、battle_messages表等执行alter table，以释放数据库空间';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('开始释放数据库空间');

        // 生成posts_xx表清单
        $maxThreadsId = (int) Thread::max('id');
        if ($maxThreadsId > 0) {
            $maxSuffix = (int) ($maxThreadsId / 10000);
            for ($i = 1; $i <= $maxSuffix; $i++) {
                $tableName = 'posts_' . $i;
                DB::statement(sprintf('ALTER TABLE %s ENGINE=InnoDB', $tableName));
                $this->info(sprintf('已执行：ALTER TABLE %s ENGINE=InnoDB', $tableName));
            }
        }

        // 对其他表执行alter table操作
        DB::statement('ALTER TABLE battle_messages ENGINE=InnoDB');
        $this->info('ALTER TABLE battle_messages ENGINE=InnoDB');
        DB::statement('ALTER TABLE failed_jobs ENGINE=InnoDB');
        $this->info('ALTER TABLE failed_jobs ENGINE=InnoDB');

        $this->info('数据库空间释放完成');
        return self::SUCCESS;
    }
}
