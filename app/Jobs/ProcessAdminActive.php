<?php

namespace App\Jobs;

use App\Models\Admin;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\AdminActive;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class ProcessAdminActive implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $admin_active;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(array $admin_active)
    {

        $this->admin_active = $admin_active;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // 查询并追加管理员的别名
        if ($this->admin_active['name'] == null) {
            $admin_info = Admin::where('user_id', $this->admin_active['user_id'])->first();
            $this->admin_active['name'] = $admin_info->name;
        }
        $model = new AdminActive($this->admin_active);
        $model->save();
    }
}
