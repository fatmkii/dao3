<?php

namespace Tests\Feature;

use Tests\TestCase;

class AndroidPrivacyTest extends TestCase
{
    public function test_android_privacy_page_explains_ssaid_retention_and_local_security(): void
    {
        $this->get('/privacy/android')
            ->assertOk()
            ->assertSee('Settings.Secure.ANDROID_ID', escape: false)
            ->assertSee('HMAC-SHA256')
            ->assertSee('保存期限与删除')
            ->assertSee('Android Keystore');
    }
}
