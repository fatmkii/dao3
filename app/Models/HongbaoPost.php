<?php

namespace App\Models;

use App\Facades\GlobalSetting;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\HongbaoPostUser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HongbaoPost extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "hongbao_post";

    protected $user_id = 0; //用于查询是否已经领取过红包的数据

    public $hidden = [
        'thread_id',
        'post_id',
        'user_id',
        'olo_remains',
        'message',
        'message_json',
        'created_binggan',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public $appends = [
        'hongbao_user'
    ];

    public $fillable = [
        'thread_id',
        'post_id',
        'floor',
        'olo_total',
        'num_total',
        'olo_remains',
        'num_remains',
        'type',
        'key_word_type',
        'key_word',
        'message',
        'message_json',
        'question',
        'olo_hide',
        'pic_url',
    ];

    protected $casts = [
        'message_json' => 'array',
    ];

    public function HongbaoPostUser()
    {
        return $this->hasMany(HongbaoPostUser::class);
    }

    public function Thread()
    {
        return $this->belongsTo(Thread::class);
    }

    protected function serializeDate($date)
    {
        return $date->format('Y-m-d H:i');
    }

    public function setUserID($user_id)
    {
        $this->user_id = $user_id;
    }

    public function getHongbaoUserAttribute()
    {
        if ($this->user_id != 0) {
            $hongbao_post_user = HongbaoPostUser::where('user_id', $this->user_id)->where('hongbao_post_id', $this->id)->first();

            if ($hongbao_post_user) {
                return $hongbao_post_user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}
