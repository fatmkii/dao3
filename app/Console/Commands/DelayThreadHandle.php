<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Database\QueryException;

class DelayThreadHandle extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'DelayThreadHandle:run';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '把延迟发帖显示出来';

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

        $now = Carbon::now();
        DB::table('threads')->where('is_delay', 1)
            ->where('is_deleted', 0)
            ->where(function ($query) use ($now) {
                $query->where('scheduled_at', '<=', $now)
                    ->orWhere(function ($legacy) use ($now) {
                        $legacy->whereNull('scheduled_at')->whereRaw('? >= 8', [$now->hour]);
                    });
            })
            ->update([
                'is_delay' => 0,
                'created_at' => Carbon::now()->addSeconds(10),
                'updated_at' => Carbon::now()->addSeconds(10),
            ]);

        return false; //好像return false才是显示Done
    }
}
