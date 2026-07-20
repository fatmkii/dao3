<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Jobs\ProcessUserActive;
use App\Models\MobileSession;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class MobileSessionTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        Bus::fake([ProcessUserActive::class]);
        $this->user = User::factory()->create(['binggan' => 'MobileCookie']);
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        parent::tearDown();
    }

    public function test_login_creates_hashed_session_and_one_hour_android_access_token(): void
    {
        CarbonImmutable::setTestNow('2026-07-18 10:00:00');
        $data = $this->login();
        $session = MobileSession::firstOrFail();
        $accessToken = PersonalAccessToken::firstOrFail();

        $this->assertSame('MobileCookie', $data['binggan']);
        $this->assertStringStartsWith($session->id.'.', $data['refresh_token']);
        $this->assertSame(hash('sha256', 'install-123'), $session->installation_id_hash);
        $this->assertNotSame(explode('.', $data['refresh_token'], 2)[1], $session->refresh_token_hash);
        $this->assertSame('android', $accessToken->client_type);
        $this->assertSame($session->id, $accessToken->mobile_session_id);
        $this->assertTrue($accessToken->expires_at->equalTo(CarbonImmutable::now()->addHour()));
        $this->assertTrue($session->idle_expires_at->equalTo(CarbonImmutable::now()->addDays(30)));
        $this->assertTrue($session->absolute_expires_at->equalTo(CarbonImmutable::now()->addDays(180)));
        Bus::assertDispatched(ProcessUserActive::class);
    }

    public function test_login_preserves_admin_abilities(): void
    {
        $this->user->forceFill(['admin' => 99])->save();
        $this->login();

        $this->assertSame(
            ['forum_admin', 'admin', 'senior_admin', 'super_admin'],
            PersonalAccessToken::firstOrFail()->abilities,
        );
    }

    public function test_login_rejects_wrong_password_and_banned_user(): void
    {
        $this->user->forceFill([
            'password' => hash('sha256', 'right'.config('app.password_salt')),
        ])->save();
        $this->postJson('/api/mobile/login', $this->loginPayload(['password' => 'wrong']))
            ->assertJson(['code' => ResponseCode::USER_PASSWORD_ERROR]);
        $this->assertDatabaseCount('mobile_sessions', 0);

        $this->user->forceFill(['is_banned' => true])->save();
        $this->postJson('/api/mobile/login', $this->loginPayload(['password' => 'right']))
            ->assertJson(['code' => ResponseCode::USER_BANNED]);
        $this->assertDatabaseCount('mobile_sessions', 0);
    }

    public function test_existing_web_login_remains_a_web_token_with_admin_abilities(): void
    {
        Bus::fake([ProcessUserActive::class]);
        $this->user->forceFill(['admin' => 20])->save();

        $this->postJson('/api/login', ['binggan' => $this->user->binggan])
            ->assertOk()
            ->assertJson(['code' => ResponseCode::SUCCESS]);

        $token = PersonalAccessToken::firstOrFail();
        $this->assertSame('web', $token->client_type);
        $this->assertNull($token->mobile_session_id);
        $this->assertSame(['forum_admin', 'admin', 'senior_admin'], $token->abilities);
    }

    public function test_refresh_rotates_both_tokens_and_deletes_only_session_access_tokens(): void
    {
        $oldRefresh = $this->login()['refresh_token'];
        $oldMobileTokenId = PersonalAccessToken::where('client_type', 'android')->value('id');
        $otherSession = $this->login(['installation_id' => 'other-install']);
        $otherSessionId = explode('.', $otherSession['refresh_token'], 2)[0];
        $webTokenId = $this->user->createToken('web')->accessToken->id;

        $newData = $this->postJson('/api/mobile/token/refresh', ['refresh_token' => $oldRefresh])
            ->assertOk()
            ->assertJson(['code' => ResponseCode::SUCCESS])
            ->json('data');

        $this->assertNotSame($oldRefresh, $newData['refresh_token']);
        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $oldMobileTokenId]);
        $this->assertDatabaseHas('personal_access_tokens', ['id' => $webTokenId, 'client_type' => 'web']);
        $this->assertDatabaseHas('personal_access_tokens', [
            'mobile_session_id' => $otherSessionId,
            'client_type' => 'android',
        ]);
        $this->assertDatabaseHas('personal_access_tokens', [
            'mobile_session_id' => MobileSession::firstOrFail()->id,
            'client_type' => 'android',
        ]);
    }

    public function test_reusing_rotated_refresh_token_revokes_the_session(): void
    {
        $oldRefresh = $this->login()['refresh_token'];
        $this->postJson('/api/mobile/token/refresh', ['refresh_token' => $oldRefresh])->assertOk();

        $this->postJson('/api/mobile/token/refresh', ['refresh_token' => $oldRefresh])
            ->assertUnauthorized()
            ->assertJson(['code' => ResponseCode::USER_UNAUTHORIZED]);

        $this->assertNotNull(MobileSession::firstOrFail()->revoked_at);
        $this->assertDatabaseMissing('personal_access_tokens', ['client_type' => 'android']);
    }

    public function test_expired_session_is_revoked_on_refresh(): void
    {
        $refreshToken = $this->login()['refresh_token'];
        MobileSession::firstOrFail()->update(['idle_expires_at' => now()->subSecond()]);

        $this->postJson('/api/mobile/token/refresh', ['refresh_token' => $refreshToken])
            ->assertUnauthorized();

        $this->assertNotNull(MobileSession::firstOrFail()->revoked_at);
    }

    public function test_absolute_expiry_cannot_be_extended_by_refresh(): void
    {
        $refreshToken = $this->login()['refresh_token'];
        MobileSession::firstOrFail()->update([
            'idle_expires_at' => now()->addDay(),
            'absolute_expires_at' => now()->subSecond(),
        ]);

        $this->postJson('/api/mobile/token/refresh', ['refresh_token' => $refreshToken])
            ->assertUnauthorized()
            ->assertJson(['code' => ResponseCode::USER_UNAUTHORIZED]);

        $this->assertNotNull(MobileSession::firstOrFail()->revoked_at);
        $this->assertDatabaseMissing('personal_access_tokens', ['client_type' => 'android']);
    }

    public function test_logout_is_idempotent_and_does_not_revoke_other_tokens(): void
    {
        $refreshToken = $this->login()['refresh_token'];
        $webTokenId = $this->user->createToken('web')->accessToken->id;
        $otherSessionData = $this->login(['installation_id' => 'other-install']);
        $otherSessionId = explode('.', $otherSessionData['refresh_token'], 2)[0];

        $this->postJson('/api/mobile/logout', ['refresh_token' => $refreshToken])->assertOk();
        $this->postJson('/api/mobile/logout', ['refresh_token' => $refreshToken])->assertOk();

        $this->assertDatabaseHas('personal_access_tokens', ['id' => $webTokenId]);
        $this->assertDatabaseHas('personal_access_tokens', ['mobile_session_id' => $otherSessionId]);
        $this->assertDatabaseHas('mobile_sessions', ['id' => $otherSessionId, 'revoked_at' => null]);
    }

    public function test_version_returns_configured_public_release_metadata(): void
    {
        config(['mobile.release' => [
            'version_name' => '1.2.3',
            'version_code' => 123,
            'notes' => '修复登录问题',
            'apk_url' => 'https://cpttmm.com/download/android.apk',
            'github_url' => 'https://github.com/example/releases/tag/android-v1.2.3',
            'sha256' => str_repeat('a', 64),
        ]]);

        $this->getJson('/api/mobile/version')
            ->assertOk()
            ->assertJson([
                'code' => ResponseCode::SUCCESS,
                'data' => [
                    'version_name' => '1.2.3',
                    'version_code' => 123,
                    'notes' => '修复登录问题',
                    'apk_url' => 'https://cpttmm.com/download/android.apk',
                    'github_url' => 'https://github.com/example/releases/tag/android-v1.2.3',
                    'sha256' => str_repeat('a', 64),
                ],
            ]);
    }

    public function test_version_prefers_the_published_release_manifest(): void
    {
        $manifestPath = tempnam(sys_get_temp_dir(), 'android-release-');
        file_put_contents($manifestPath, json_encode([
            'version_name' => '2.0.1',
            'version_code' => 2000001,
            'notes' => '自动生成的发布说明',
            'apk_url' => 'https://cpttmm.com/downloads/android/app.apk',
            'github_url' => 'https://github.com/example/release',
            'sha256' => str_repeat('b', 64),
            'unexpected' => 'must not leak',
        ], JSON_THROW_ON_ERROR));
        config(['mobile.release_manifest_path' => $manifestPath]);

        try {
            $this->getJson('/api/mobile/version')
                ->assertOk()
                ->assertJsonPath('data.version_name', '2.0.1')
                ->assertJsonPath('data.version_code', 2000001)
                ->assertJsonPath('data.notes', '自动生成的发布说明')
                ->assertJsonMissingPath('data.unexpected');
        } finally {
            unlink($manifestPath);
        }
    }

    public function test_existing_web_custom_account_endpoint_uses_shared_service(): void
    {
        Bus::fake();
        $this->user->forceFill(['coin' => 200000])->save();
        $webToken = $this->user->createToken('web')->plainTextToken;

        $this->withToken($webToken)
            ->postJson('/api/user/create_custom', [
                'binggan' => $this->user->binggan,
                'binggan_apply' => 'CustomCookie',
                'password' => 'password_123',
                'transfer_binggan' => false,
            ])
            ->assertOk()
            ->assertJson([
                'code' => ResponseCode::SUCCESS,
                'data' => ['binggan' => 'CustomCookie'],
            ]);
    }

    public function test_mobile_custom_account_endpoint_is_not_available(): void
    {
        $this->postJson('/api/mobile/custom-account')->assertStatus(405);
    }

    public function test_android_password_change_keeps_current_session_and_revokes_others(): void
    {
        Bus::fake();
        $current = $this->login();
        $other = $this->login(['installation_id' => 'other-install']);
        $webTokenId = $this->user->createToken('web')->accessToken->id;

        $this->withToken($current['access_token'])
            ->postJson('/api/set_password', [
                'binggan' => $this->user->binggan,
                'old_password' => null,
                'new_password' => 'new_password',
            ])
            ->assertOk()
            ->assertJson(['code' => ResponseCode::SUCCESS]);

        $currentSessionId = explode('.', $current['refresh_token'], 2)[0];
        $otherSessionId = explode('.', $other['refresh_token'], 2)[0];
        $this->assertDatabaseHas('mobile_sessions', ['id' => $currentSessionId, 'revoked_at' => null]);
        $this->assertDatabaseMissing('personal_access_tokens', ['mobile_session_id' => $otherSessionId]);
        $this->assertNotNull(MobileSession::findOrFail($otherSessionId)->revoked_at);
        $this->assertDatabaseHas('personal_access_tokens', ['id' => $webTokenId, 'client_type' => 'web']);
    }

    public function test_web_password_change_revokes_all_mobile_sessions_only(): void
    {
        Bus::fake();
        $this->login();
        $this->login(['installation_id' => 'other-install']);
        $webToken = $this->user->createToken('web');

        $this->withToken($webToken->plainTextToken)
            ->postJson('/api/set_password', [
                'binggan' => $this->user->binggan,
                'old_password' => null,
                'new_password' => 'new_password',
            ])
            ->assertOk()
            ->assertJson(['code' => ResponseCode::SUCCESS]);

        $this->assertSame(2, MobileSession::whereNotNull('revoked_at')->count());
        $this->assertDatabaseMissing('personal_access_tokens', ['client_type' => 'android']);
        $this->assertDatabaseHas('personal_access_tokens', [
            'id' => $webToken->accessToken->id,
            'client_type' => 'web',
        ]);
    }

    public function test_web_custom_account_transfer_revokes_mobile_sessions(): void
    {
        Bus::fake();
        $this->user->forceFill(['coin' => 200000])->save();
        $this->login();
        $webToken = $this->user->createToken('web')->plainTextToken;

        $this->withToken($webToken)
            ->postJson('/api/user/create_custom', [
                'binggan' => $this->user->binggan,
                'binggan_apply' => 'CustomCookie',
                'password' => 'password_123',
                'transfer_binggan' => true,
            ])
            ->assertOk()
            ->assertJson(['code' => ResponseCode::SUCCESS]);

        $this->assertTrue($this->user->fresh()->is_banned);
        $this->assertNotNull(MobileSession::firstOrFail()->revoked_at);
        $this->assertDatabaseMissing('personal_access_tokens', ['client_type' => 'android']);
    }

    private function login(array $overrides = []): array
    {
        return $this->postJson('/api/mobile/login', $this->loginPayload($overrides))
            ->assertOk()
            ->assertJson(['code' => ResponseCode::SUCCESS])
            ->json('data');
    }

    private function loginPayload(array $overrides = []): array
    {
        return array_merge([
            'binggan' => $this->user->binggan,
            'installation_id' => 'install-123',
            'device_name' => 'Pixel Test',
            'app_version' => '0.1.0',
        ], $overrides);
    }
}
