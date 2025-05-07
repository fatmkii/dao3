<?php

namespace App\Jobs;

use App\Models\IncomeStatement;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class ProcessIncomeStatement implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;


    protected $action = 'normal'; //一般记录'normal'，回帖记录'post'(因为要聚合)
    protected $IncomeStatement;
    //  $IncomeStatement有以下字段
    // [
    //     'created_at' => ,
    //     'olo'=> ,
    //     'user_id'=>,
    //     'binggan'=>,
    //     'user_id_target'=>,
    //     'binggan_target'=>,
    //     'content'=>,
    //     'type' => 枚举['default_in','default_out','battle_in', 'battle_out','post','hongbao_in','hongbao_out','penalty','reward_out','reward_in','gamble_out','gamble_in','bank_in','bank_out',],
    //     'thread_id'=>,
    //     'thread_title'=>,
    //     'post_id'=>,
    //     'floor'=>,
    // ]

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(string $action, array $IncomeStatement)
    {
        $this->IncomeStatement = $IncomeStatement;
        Log::debug('$IncomeStatement',[$IncomeStatement]);
        $this->action = $action;
        if (array_key_exists('content', $this->IncomeStatement) && strlen($this->IncomeStatement['content']) > 255) {
            //数据库最长记录255
            $this->IncomeStatement['content'] = mb_substr($this->IncomeStatement['content'], 0, 254, 'utf-8');
        }
        if (array_key_exists('thread_title', $this->IncomeStatement) && strlen($this->IncomeStatement['thread_title']) > 255) {
            //数据库最长记录255
            $this->IncomeStatement['thread_title'] = mb_substr($this->IncomeStatement['thread_title'], 0, 254, 'utf-8');
        }
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $carbon_date = Carbon::parse($this->IncomeStatement['created_at']);
        switch ($this->action) {
            case 'normal':
                $model = new IncomeStatement($this->IncomeStatement);
                $model->setsuffix($carbon_date->year);
                $model->save();
                break;
            case 'post':
                //用当天的23:59:0作为回帖的聚合记录时间
                $post_date = $carbon_date;
                $post_date->hour = 23;
                $post_date->minute = 59;
                $post_date->second = 0;

                $model = IncomeStatement::suffix($carbon_date->year)
                    ->where('user_id', $this->IncomeStatement['user_id'])
                    ->where('created_at', $post_date)
                    ->where('content', '回帖')
                    ->first();
                if ($model) {
                    // $model->olo += 10; 多个操作并发时会不准确
                    $model->increment('olo', 10);
                } else {
                    $statement_temp = $this->IncomeStatement;
                    $statement_temp['created_at'] = $post_date;
                    $model = new IncomeStatement($statement_temp);
                    $model->setsuffix($carbon_date->year);
                }
                $model->save();
                break;
        }
    }
}
