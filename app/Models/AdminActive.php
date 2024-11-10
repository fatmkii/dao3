<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Casts\Attribute;

class AdminActive extends Model
{
    use HasFactory;

    protected $table = 'admin_actives';

    protected $fillable = [
        'id',
        'user_id',
        'binggan',
        'name',
        'admin_level',
        'active',
        'active_type',
        'content',
        'olo',
        'post_id',
        'thread_id',
        'thread_title',
        'floor',
        'user_id_target',
        'binggan_target',
        'is_rollbacked',
    ];

    protected $hidden = [
        'id',
        'admin_level',
        'user_id',
        'binggan',
        'user_id_target',
        'binggan_target',
    ];

    protected $appends = [
        'post_content'
    ];

    public function User()
    {
        return $this->belongsTo(User::class);
    }

    protected function serializeDate($date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    //查询数据（更高效的SQL语句）
    public  function getDataInDate($date)
    {
        $date = Carbon::parse($date);
        $table = 'admin_actives';

        //用子查询join
        $sql_child = DB::table($table)
            ->select('id')
            ->whereDate('created_at', '=', $date->toDateString());

        $data = $this->joinSub($sql_child, 'sql_child', function ($join) use ($table) {
            $join->on($table . '.id', '=', 'sql_child.id');
        })
            ->orderByDesc('created_at')
            ->get();

        return $data;
    }


    //如果有post_id，则查询post的内容
    protected function postContent(): Attribute
    {
        if ($this->post_id !== null && $this->thread_id !== null) {
            $content = Post::suffix(intval($this->thread_id / 10000))->select('content')->find($this->post_id);
            if ($content) {
                $post_content = $content->content; // 获取 content 值
            } else {
                $post_content = null; // 处理未找到的情况
            }
        } else {
            $post_content = null;
        }

        return Attribute::make(
            get: fn() => $post_content,
        );
    }

    //如果是碎饼干和封禁饼干，则往前端暴露饼干的前2位
    protected function active(): Attribute
    {
        if ($this->active_type == 'user_ban' || $this->active_type == 'user_lock') {
            return Attribute::make(
                get: fn(string $value) => $value . substr($this->binggan_target, 0, 2) . '**',
            );
        } else {
            return Attribute::make(
                get: fn(string $value) => $value,
            );
        }
    }
}
