<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AndroidRegistrationDevice extends Model
{
    protected $fillable = [
        'device_key',
        'claim_count',
        'is_banned',
        'banned_at',
    ];

    protected $hidden = [
        'device_key',
    ];

    protected $casts = [
        'is_banned' => 'boolean',
        'banned_at' => 'datetime',
    ];
}
