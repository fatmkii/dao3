<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\PersonalAccessToken;

class MobileSession extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'installation_id_hash',
        'refresh_token_hash',
        'device_name',
        'app_version',
        'last_used_at',
        'idle_expires_at',
        'absolute_expires_at',
        'revoked_at',
    ];

    protected $hidden = [
        'installation_id_hash',
        'refresh_token_hash',
    ];

    protected $casts = [
        'last_used_at' => 'datetime',
        'idle_expires_at' => 'datetime',
        'absolute_expires_at' => 'datetime',
        'revoked_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function accessTokens()
    {
        return $this->hasMany(PersonalAccessToken::class);
    }
}
