<?php

namespace App\Console\Commands;

use App\Models\EmojiContest;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class EmojiContestInject extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'EmojiContest:inject';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '注入表情包萌活动数据到数据库';

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
        $this->info('正在注入表情包萌数据……');
        $file_path = app_path('Console/Commands/emojiContestData.json');
        $json_string = file_get_contents($file_path);
        $json_data = json_decode($json_string);
        foreach ($json_data as $emoji_data) {
            foreach ($emoji_data->emojis as $emoji_id => $emoji_url) {
                EmojiContest::create([
                    'emoji_group_id' => $emoji_data->id, //从1开始的
                    'emoji_id' => $emoji_id,
                    'votes_num_total' => 0,
                ]);
            }
        }
        $this->info('已完成');
        return true;
    }
}
