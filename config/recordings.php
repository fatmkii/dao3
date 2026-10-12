<?php

return [
    'enabled' => (bool) env('RECORDINGS_ENABLED', false),
    'max_duration_ms' => (int) env('RECORDINGS_MAX_DURATION_MS', 15000),
    'retention_days' => 14,
    'uploads_per_minute' => (int) env('RECORDINGS_UPLOADS_PER_MINUTE', 6),
    'uploads_per_day' => (int) env('RECORDINGS_UPLOADS_PER_DAY', 100),
    'r2' => [
        'key' => env('R2_ACCESS_ID'),
        'secret' => env('R2_ACCESS_KEY'),
        'bucket' => env('R2_BUCKET'),
        'endpoint' => env('R2_ENDPOINT'),
        'url' => env('R2_URL'),
    ],
];
