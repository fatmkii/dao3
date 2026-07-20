<?php

namespace Tests\Feature;

use Tests\TestCase;

class CheckAndroidConfigCommandTest extends TestCase
{
    public function test_command_rejects_a_missing_or_short_registration_key(): void
    {
        config(['mobile.registration_hmac_key' => 'too-short']);

        $this->artisan('android:check-config')
            ->expectsOutput('ANDROID_REGISTRATION_HMAC_KEY must contain at least 32 characters.')
            ->assertFailed();
    }

    public function test_command_accepts_a_sufficient_registration_key(): void
    {
        config(['mobile.registration_hmac_key' => str_repeat('a', 32)]);

        $this->artisan('android:check-config')
            ->expectsOutput('Android server configuration is valid.')
            ->assertSuccessful();
    }
}
