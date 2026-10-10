<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostRecording extends Model
{
    protected $guarded = [];

    protected $casts = [
        'uploaded_at' => 'immutable_datetime',
        'expires_at' => 'immutable_datetime',
        'duration_ms' => 'integer',
        'size_bytes' => 'integer',
    ];

    public function playbackData(): array
    {
        $expired = ! $this->expires_at || $this->expires_at->lte(now());

        return [
            'id' => $this->id,
            'duration_ms' => $this->duration_ms,
            'expires_at' => $this->expires_at?->toISOString(),
            'server_time' => now()->toISOString(),
            'expired' => $expired,
            'url' => $expired ? null : rtrim(config('recordings.r2.url'), '/').'/'.$this->object_key,
        ];
    }
}
