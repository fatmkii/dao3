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
        $max_threads_id = Thread::max('id');
        $max_suffix = intval($max_threads_id / 10000);
        $posts_tables = [];
        for ($i = 1; $i <= $max_suffix; $i++) {
            $posts_tables[] = 'posts_' . $i;
        }
        // 对所有posts_xx表执行alter table操作，以释放空间
        foreach ($posts_tables as $key => $table_name) {
            DB::raw(sprintf('ALTER TABLE %s ENGINE=InnoDB;', $table_name));
            $this->info(sprintf('已执行：ALTER TABLE %s ENGINE=InnoDB;', $table_name));
        }
        //对其他表执行alter table操作
        DB::raw('ALTER TABLE battle_messages ENGINE=InnoDB;');
        $this->info('ALTER TABLE battle_messages ENGINE=InnoDB;');
        DB::raw('ALTER TABLE failed_jobs ENGINE=InnoDB;');
        $this->info('ALTER TABLE failed_jobs ENGINE=InnoDB;');

        $this->info('数据库空间释放完成');
    }
}
