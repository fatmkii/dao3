<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CompensateMyEmojiStorage extends Command
{
    private const COMPENSATION = 5000;

    protected $signature = 'user-lv:compensate-my-emoji';

    protected $description = '为已有用户等级记录补偿 5000 点自定义表情包容量';

    public function handle(): int
    {
        // 这是一次性补偿操作；重复执行会再次为所有记录增加 5000。
        $affectedRows = DB::table('users_lv')->increment('my_emoji', self::COMPENSATION);

        $this->info("补偿完成：已为 {$affectedRows} 条 users_lv 记录的 my_emoji 增加 5000。");

        return self::SUCCESS;
    }
}
