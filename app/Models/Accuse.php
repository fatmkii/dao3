<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Accuse extends Model
{
    use HasFactory;

    protected $fillable = [
        'thread_id',
        'post_id',
        'forum_id',
        'floor',
        'target_binggan',
        'thread_title',
        'status',
        'uncertain',
        'handled_by_user_id',
        'handled_at',
        'handle_action',
        'handle_note',
        'handle_reduce_olo',
    ];

    protected $hidden = [
        'target_binggan',
        'handled_by_user_id',
        'updated_at',
    ];

    protected $casts = [
        'uncertain' => 'boolean',
        'handle_reduce_olo' => 'boolean',
        'handled_at' => 'datetime',
    ];

    public function reasons()
    {
        return $this->hasMany(AccuseReason::class);
    }

    public function handledBy()
    {
        return $this->belongsTo(User::class, 'handled_by_user_id');
    }

    protected function serializeDate($date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
