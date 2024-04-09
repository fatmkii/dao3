<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\CrowdRecord;
use App\Models\Thread;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class Crowd extends Model
{
    use HasFactory;

    public $hidden = [
        'thread_id',
        'created_at',
        'updated_at',
    ];

    public function CrowdRecord()
    {
        return $this->hasMany(CrowdRecord::class);
    }

    public function Thread()
    {
        return $this->belongsTo(Thread::class);
    }

    protected function serializeDate($date)
    {
        return $date->format('Y-m-d H:i');
    }

    public function CrowdUserRecord($user_id)
    {
        return CrowdRecord::where('crowd_id', $this->id)
            ->where('user_id', $user_id)->get();  //和vote不同，crowd返回的是collection类
    }

    public static function create(Request $request, $thread_id)
    {
        $request->validate([
            'crowd_params.title' => 'required|string|max:100',
            'crowd_params.end_time' => 'required|date_format:Y-m-d H:i:s|before:' . Carbon::now()->addMonth(1), //有效期时长最多一个月
            'crowd_params.olo_target' => 'required|integer|max:10000000|min:1',
        ]);

        $crowd = new Crowd();
        $crowd->thread_id = $thread_id;
        $crowd->title = $request->crowd_params['title'];
        $crowd->end_date = Carbon::parse($request->crowd_params['end_time']);
        $crowd->olo_target = $request->crowd_params['olo_target'];
        $crowd->save();

        return $crowd;
    }
}
