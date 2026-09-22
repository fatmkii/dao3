<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\UserActive;
use Illuminate\Support\Carbon;

class ProcessUserActive implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $user_active;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Array $user_active)
    {
        $this->user_active = $user_active;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // 兼容发布前已入队的旧反灌水日志，其他用户活动继续正常记录。
        if (in_array($this->user_active['active'] ?? null, [
            '反机器人多维评分',
            '用户触发了机器人刷帖警报',
            '用户触发了抢红包警报',
            '怀疑用户用脚本刷帖(JS脚本类型)',
            '怀疑用户用脚本刷帖(key不正确)',
            '用户输入验证码错误',
        ], true)) {
            return;
        }

        $model = new UserActive($this->user_active);
        $model->setsuffix(Carbon::now()->year . '_' . Carbon::now()->month);
        $model->save();
    }
}
