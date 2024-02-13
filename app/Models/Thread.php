<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\ModelWithSuffix;
use App\Models\Post;
use App\Models\Forum;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;
use App\Models\VoteQuestion;
use App\Models\GambleQuestion;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Thread extends ModelWithSuffix
{
    use HasFactory;

    protected $binggan = '';

    public $hidden = [
        'created_binggan',
        'created_IP',
        'is_deleted',
        'forum',
        'is_your_thread'
    ];
    protected $fillable = [
        'forum_id', 'title', 'content', 'created_binggan', 'created_IP',
        'anti_jingfen', 'sub_id', 'nissin_date', 'author_name'
    ];
    protected $guarded = [
        'id', 'created_at', 'updated_at',
    ];

    protected $appends = [
        'is_your_thread',
    ];

    protected $casts = [
        'anti_jingfen' => 'boolean',
        'has_nissined' => 'boolean',
        'can_battle' => 'boolean',
        'is_delay' => 'boolean',
        'is_private' => 'boolean',
    ];


    public function Forum()
    {
        return $this->belongsTo(Forum::class);
    }

    public function Posts()
    {
        // Posts数据库表分表。根据Tread->id万位以上数字作为Post表后缀
        // 例如thread->id是2xxxx的post在表post_2表里。
        // suffix方法写在ModelWithSuffix类里
        // $posts = Post::suffix(intval($this->id / 10000));
        $posts = new Post;
        $posts->setSuffix(intval($this->id / 10000));
        return new HasMany($posts->newQuery(), $this, 'thread_id', 'id');
    }

    // public function VoteQuestion()
    // {
    //     return $this->hasOne(VoteQuestion::class);
    // }

    // public function GambleQuestion()
    // {
    //     return $this->hasOne(GambleQuestion::class);
    // }

    // public function Crowd()
    // {
    //     return $this->hasOne(Crowd::class);
    // }

    // public function Hongbao()
    // {
    //     return $this->hasOne(Hongbao::class);
    // }

    protected function serializeDate($date)
    {
        return $date->format('Y-m-d H:i');
    }

    public function setBinggan($binggan)
    {
        $this->binggan = $binggan;
    }

    public function isYourThread(): Attribute
    {
        if ($this->binggan) {
            if ($this->binggan == $this->created_binggan) {
                return Attribute::make(get: fn () => true);
            } else {
                return Attribute::make(get: fn () => false);
            }
        } else {
            return Attribute::make(get: fn () => null);;
        }
    }
}
