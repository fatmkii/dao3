<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\EmojiContestUserTotal;
use App\Models\UserMedal;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class EmojiContestMedal extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'EmojiContest:medal';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '发放冠军成就徽章';


    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user_ids = EmojiContestUserTotal::distinct()->pluck('user_id');
        $user_array = [];

        Log::channel('temp_log')->info('参与user_id:', [$user_ids->toArray()]);
        Log::channel('temp_log')->info('参与人数:', [$user_ids->count()]);
        $this->info('参与人数:' . $user_ids->count());

        // 发放冠军徽章
        foreach ($user_ids as $key => $user_id) {
            $user_vote_total = EmojiContestUserTotal::where('user_id', $user_id)
                ->orderBy('votes_num_total', 'desc')
                ->orderBy('updated_at', 'desc')
                ->first();
            if ($user_vote_total->emoji_group_id == 11) { //本次冠军FUFU是11号，这里记得每次改！！！ 
                array_push($user_array, $user_id);
                UserMedal::create([
                    'user_id' => $user_id,
                    'medal_id' => 284, //本次冠军徽章ID是284，这里记得每次改！！！ 
                    'created_at' => Carbon::now(),
                ]);
            }
        }
        Log::channel('temp_log')->info('冠军徽章，发放user_id', [$user_array]);
        Log::channel('temp_log')->info('冠军徽章，合计发放个数：', [count($user_array)]);
        $this->info('冠军徽章，合计发放个数：' . count($user_array));


        // 发放淘汰徽章
        $user_array = [];
        foreach ($user_ids as $key => $user_id) {
            $user_vote_total = EmojiContestUserTotal::where('user_id', $user_id)
                ->where('emoji_group_id', 10) //本次被淘汰的是小黄脸10号，这里记得每次改！！！ 
                ->get();

            foreach ($user_vote_total as $key => $value) {
                if ($value->votes_num_total >= 10) {
                    array_push($user_array, $user_id);
                    UserMedal::create([
                        'user_id' => $user_id,
                        'medal_id' => 283, //本次淘汰徽章ID是283，这里记得每次改！！！ 
                        'created_at' => Carbon::now(),
                    ]);
                }
            }
        }
        Log::channel('temp_log')->info('淘汰徽章，发放user_id', [$user_array]);
        Log::channel('temp_log')->info('淘汰徽章，合计发放个数：', [count($user_array)]);
        $this->info('淘汰徽章，合计发放个数：' . count($user_array));

        return true;
    }
}
