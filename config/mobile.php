<?php

return [
    'registration_hmac_key' => env('ANDROID_REGISTRATION_HMAC_KEY', ''),
    'release_manifest_path' => env(
        'ANDROID_RELEASE_MANIFEST_PATH',
        '/data/wwwroot/v3.cpttmm.com/shared/downloads/android/version.json',
    ),
    'release' => [
        'version_name' => env('ANDROID_LATEST_VERSION_NAME', '0.1.0'),
        'version_code' => (int) env('ANDROID_LATEST_VERSION_CODE', 1),
        'notes' => env('ANDROID_RELEASE_NOTES', ''),
        'apk_url' => env('ANDROID_APK_URL', ''),
        'github_url' => env('ANDROID_GITHUB_RELEASE_URL', ''),
        'sha256' => env('ANDROID_APK_SHA256', ''),
    ],
];
