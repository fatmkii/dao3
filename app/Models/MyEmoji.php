<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class MyEmoji extends Model
{
    use HasFactory, SoftDeletes;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
    ];

    protected $hidden = [
        'id',
        'user_id',
        'deleted_at',
        'name',
    ];

    protected $casts = [
        'emoji_excluded' => 'array',
        'emojis' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
