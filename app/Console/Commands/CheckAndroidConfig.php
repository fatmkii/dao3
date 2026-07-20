<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CheckAndroidConfig extends Command
{
    protected $signature = 'android:check-config';

    protected $description = 'Validate required Android server configuration without exposing secrets';

    public function handle(): int
    {
        $registrationKey = config('mobile.registration_hmac_key');
        if (! is_string($registrationKey) || strlen($registrationKey) < 32) {
            $this->error('ANDROID_REGISTRATION_HMAC_KEY must contain at least 32 characters.');

            return self::FAILURE;
        }

        $this->info('Android server configuration is valid.');

        return self::SUCCESS;
    }
}
