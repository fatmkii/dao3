<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

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
        'emojis' => 'array',
    ];

    protected static function booted(): void
    {
        static::saving(function (MyEmoji $myEmoji): void {
            if (! $myEmoji->exists || $myEmoji->isDirty('emojis')) {
                $myEmoji->version = (string) Str::uuid();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
