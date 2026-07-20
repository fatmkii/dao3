<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Jobs\ProcessUserCreatedLocation;
use App\Models\AndroidRegistrationDevice;
use App\Models\MobileSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Tests\TestCase;

class AndroidRegistrationTest extends TestCase
{
    use RefreshDatabase;

    private const HMAC_KEY = 'test-android-registration-key-32-bytes-minimum';

    private const DIGEST = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    protected function setUp(): void
    {
        parent::setUp();
        config(['mobile.registration_hmac_key' => self::HMAC_KEY]);
        DB::table('global_setting')->updateOrInsert(
            ['key' => 'new_binggan_force'],
            ['value' => json_encode(true)],
        );
        DB::table('global_setting')->where('key', 'new_binggan')->update(['value' => json_encode(true)]);
        Bus::fake([ProcessUserCreatedLocation::class]);
        $this->clearRegistrationRedis();
    }

    protected function tearDown(): void
    {
        $this->clearRegistrationRedis();
        parent::tearDown();
    }

    public function test_register_requires_a_valid_ssaid_digest(): void
    {
        $payload = $this->payload();
        unset($payload['registration_device_digest']);

        $this->postJson('/api/mobile/register', $payload)
            ->assertUnprocessable()
            ->assertJson(['code' => 422]);
        $this->assertDatabaseCount('users', 0);
        $this->assertDatabaseCount('android_registration_devices', 0);
    }

    public function test_register_hmacs_device_digest_and_returns_mobile_session(): void
    {
        $data = $this->register(self::DIGEST, '10.10.0.1');
        $user = User::firstOrFail();
        $device = AndroidRegistrationDevice::firstOrFail();

        $this->assertSame(hash_hmac('sha256', self::DIGEST, self::HMAC_KEY), $device->device_key);
        $this->assertNotSame(self::DIGEST, $device->device_key);
        $this->assertSame(1, $device->claim_count);
        $this->assertFalse($device->is_banned);
        $this->assertNull($user->created_UUID);
        $this->assertSame($user->binggan, $data['binggan']);
        $this->assertDatabaseHas('mobile_sessions', ['user_id' => $user->id]);
        $this->assertDatabaseHas('personal_access_tokens', [
            'mobile_session_id' => MobileSession::firstOrFail()->id,
            'client_type' => 'android',
        ]);
        $this->assertGreaterThan(0, Redis::ttl('reg_record_10.10.0.1'));
        $this->assertGreaterThan(0, Redis::ttl('new_user_'.$user->binggan));
    }

    public function test_registration_status_reports_availability_and_ip_cooldown(): void
    {
        $ip = '10.10.4.1';

        $this->withServerVariables(['REMOTE_ADDR' => $ip])
            ->getJson('/api/mobile/registration-status')
            ->assertOk()
            ->assertJsonPath('data.enable', true)
            ->assertJsonPath('data.reg_record_TTL', -2)
            ->assertJsonStructure(['data' => ['next_date']]);

        Redis::setex('reg_record_'.$ip, 3600, 1);

        $ttl = $this->withServerVariables(['REMOTE_ADDR' => $ip])
            ->getJson('/api/mobile/registration-status')
            ->assertOk()
            ->json('data.reg_record_TTL');
        $this->assertGreaterThan(0, $ttl);

        DB::table('global_setting')->where('key', 'new_binggan')->update(['value' => json_encode(false)]);
        $this->withServerVariables(['REMOTE_ADDR' => $ip])
            ->getJson('/api/mobile/registration-status')
            ->assertOk()
            ->assertJsonPath('data.enable', false);
    }

    public function test_fifth_claim_succeeds_and_atomically_locks_device(): void
    {
        for ($claim = 1; $claim <= 5; $claim++) {
            $this->register(self::DIGEST, '10.10.1.'.$claim, ['installation_id' => 'install-'.$claim]);
        }

        $device = AndroidRegistrationDevice::firstOrFail();
        $this->assertSame(5, $device->claim_count);
        $this->assertTrue($device->is_banned);
        $this->assertNotNull($device->banned_at);
        $this->assertDatabaseCount('users', 5);

        $this->withServerVariables(['REMOTE_ADDR' => '10.10.1.6'])
            ->postJson('/api/mobile/register', $this->payload([
                'registration_device_digest' => self::DIGEST,
                'installation_id' => 'install-6',
            ]))
            ->assertOk()
            ->assertJson(['code' => ResponseCode::USER_REGISTER_FAIL]);
        $this->assertDatabaseCount('users', 5);
        $this->assertSame(5, $device->fresh()->claim_count);
    }

    public function test_ip_cooldown_is_shared_across_android_devices(): void
    {
        $this->register(self::DIGEST, '10.10.2.1');

        $this->withServerVariables(['REMOTE_ADDR' => '10.10.2.1'])
            ->postJson('/api/mobile/register', $this->payload([
                'registration_device_digest' => str_repeat('b', 64),
                'installation_id' => 'other-install',
            ]))
            ->assertOk()
            ->assertJson(['code' => ResponseCode::USER_REGISTER_FAIL]);

        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseCount('android_registration_devices', 1);
    }

    public function test_global_registration_switch_is_respected(): void
    {
        DB::table('global_setting')->where('key', 'new_binggan')->update(['value' => json_encode(false)]);

        $this->withServerVariables(['REMOTE_ADDR' => '10.10.3.1'])
            ->postJson('/api/mobile/register', $this->payload())
            ->assertOk()
            ->assertJson(['code' => ResponseCode::USER_NEW_CLOSED]);

        $this->assertDatabaseCount('users', 0);
    }

    public function test_existing_web_registration_still_uses_canvas_bucket_and_web_token(): void
    {
        $uuid = 'canvas-device-01';
        $plaintext = str_pad('XiaoHuoGuo'.$uuid, 32, "\0");
        $registerKey = openssl_encrypt(
            $plaintext,
            'aes-128-cbc',
            'XiaoHuoGuoCpttmm',
            OPENSSL_ZERO_PADDING,
            'abcdef0123456789',
        );

        $this->withServerVariables(['REMOTE_ADDR' => '10.10.3.1'])
            ->postJson('/api/user/register', ['register_key' => $registerKey])
            ->assertOk()
            ->assertJson(['code' => ResponseCode::SUCCESS]);

        $user = User::firstOrFail();
        $this->assertSame($uuid, $user->created_UUID);
        $this->assertDatabaseHas('user_register', [
            'created_UUID' => $uuid,
            'count' => 1,
            'is_banned' => false,
        ]);
        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'client_type' => 'web',
            'mobile_session_id' => null,
        ]);
    }

    private function register(string $digest, string $ip, array $overrides = []): array
    {
        return $this->withServerVariables(['REMOTE_ADDR' => $ip])
            ->postJson('/api/mobile/register', $this->payload(array_merge([
                'registration_device_digest' => $digest,
            ], $overrides)))
            ->assertOk()
            ->assertJson(['code' => ResponseCode::SUCCESS])
            ->json('data');
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'registration_device_digest' => self::DIGEST,
            'installation_id' => 'install-123',
            'device_name' => 'Pixel Test',
            'app_version' => '0.1.0',
        ], $overrides);
    }

    private function clearRegistrationRedis(): void
    {
        $ips = ['10.10.0.1', '10.10.2.1', '10.10.3.1', '10.10.4.1'];
        for ($claim = 1; $claim <= 6; $claim++) {
            $ips[] = '10.10.1.'.$claim;
        }
        foreach ($ips as $ip) {
            Redis::del('reg_record_'.$ip);
        }
    }
}
