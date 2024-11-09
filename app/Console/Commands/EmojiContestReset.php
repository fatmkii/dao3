<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class EmojiContestReset extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'EmojiContest:reset';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '清空表情萌相关数据库';

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
        if (!$this->confirm('即将清空表情包萌相关数据库，是否确定？')) {
            return False;
        }
        DB::table('emoji_contest')->truncate();
        DB::table('emoji_contest_user')->truncate();
        DB::table('emoji_contest_user_total')->truncate();
        $this->info('已完成');
        return true;
    }
}
