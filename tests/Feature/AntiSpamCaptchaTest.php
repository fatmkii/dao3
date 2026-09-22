<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Jobs\ProcessUserActive;
use App\Models\User;
use App\Services\AntiSpamService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Redis;
use Tests\Concerns\InteractsWithAntiSpamRedis;
use Tests\TestCase;

class AntiSpamCaptchaTest extends TestCase
{
    use InteractsWithAntiSpamRedis;
    use RefreshDatabase;

    private User $user;

    private AntiSpamService $service;

    private string $postKey;

    protected function setUp(): void
    {
        parent::setUp();
        $this->isolateAntiSpamRedis();
        $this->user = User::factory()->create(['admin' => 0, 'is_banned' => false, 'locked_until' => null]);
        $this->actingAs($this->user, 'sanctum');
        $this->service = app(AntiSpamService::class);
        $this->postKey = AntiSpamService::REDIS_POST_CAPTCHA.$this->user->id;
        Bus::fake([ProcessUserActive::class]);
    }

    private function reachLimit(): void
    {
        $reservation = $this->service->checkPostSpam('192.0.2.1', $this->user);
        $this->service->finishPostReservation($this->user, $reservation, true);
        Redis::hset($this->postKey, 'count', Redis::hget($this->postKey, 'limit'));
    }

    private function unlock(string $key, string $code = 'AbCd', string $type = 'new_post')
    {
        return $this->postJson('/api/user/water_unlock', [
            'binggan' => $this->user->binggan,
            'captcha_key' => $key,
            'captcha_code' => $code,
            'type' => $type,
        ]);
    }

    public function test_get_captcha_requires_authentication_and_no_type_parameter(): void
    {
        $this->app['auth']->forgetGuards();
        $this->getJson('/api/captcha')->assertUnauthorized();
        $this->actingAs($this->user, 'sanctum');
        $response = $this->getJson('/api/captcha')->assertOk()->assertJsonStructure(['data' => ['captcha_key', 'captcha_img']]);
        $key = AntiSpamService::REDIS_CAPTCHA.$this->user->id.':'.$response->json('data.captcha_key');
        $this->assertGreaterThanOrEqual(59, Redis::ttl($key));
        $this->assertStringStartsWith("\x89PNG", base64_decode($response->json('data.captcha_img')));
    }

    public function test_correct_code_unlocks_account_once_without_clearing_other_limits(): void
    {
        $this->reachLimit();
        $key = $this->service->issueCaptcha($this->user, 'abcd');
        Redis::setex(AntiSpamService::REDIS_POST_RECORD.'127.0.0.1', 60, 10);
        Redis::setex(AntiSpamService::REDIS_HONGBAO_RECORD_IP.'127.0.0.1', 300, 6);
        $this->unlock($key)->assertJson(['code' => ResponseCode::SUCCESS]);
        $this->assertSame(0, Redis::exists($this->postKey));
        $this->assertSame('10', Redis::get(AntiSpamService::REDIS_POST_RECORD.'127.0.0.1'));
        $this->assertSame('6', Redis::get(AntiSpamService::REDIS_HONGBAO_RECORD_IP.'127.0.0.1'));
        $this->unlock($key, 'abcd', 'hongbao_store')->assertJson(['code' => ResponseCode::CAPTCHA_NOT_FOUND]);
        Bus::assertNotDispatched(ProcessUserActive::class);
    }

    public function test_same_captcha_can_instead_be_used_for_hongbao_only(): void
    {
        $this->reachLimit();
        $key = $this->service->issueCaptcha($this->user, 'abcd');
        Redis::setex(AntiSpamService::REDIS_HONGBAO_RECORD_IP.'127.0.0.1', 300, 6);
        $this->unlock($key, 'abcd', 'hongbao_store')->assertJson(['code' => ResponseCode::SUCCESS]);
        $this->assertSame(0, Redis::exists(AntiSpamService::REDIS_HONGBAO_RECORD_IP.'127.0.0.1'));
        $this->assertSame(1, Redis::exists($this->postKey));
        $this->unlock($key)->assertJson(['code' => ResponseCode::CAPTCHA_NOT_FOUND]);
        Bus::assertNotDispatched(ProcessUserActive::class);
    }

    public function test_wrong_code_is_consumed_without_unlocking_or_logging(): void
    {
        $this->reachLimit();
        $key = $this->service->issueCaptcha($this->user, 'abcd');
        $this->unlock($key, 'wrong')->assertJson(['code' => ResponseCode::CAPTCHA_WRONG]);
        $this->unlock($key)->assertJson(['code' => ResponseCode::CAPTCHA_NOT_FOUND]);
        $this->assertSame(1, Redis::exists($this->postKey));
        Bus::assertNotDispatched(ProcessUserActive::class);
    }

    public function test_expired_code_and_another_accounts_code_cannot_unlock(): void
    {
        $this->reachLimit();
        $key = $this->service->issueCaptcha($this->user, 'abcd');
        Redis::expire(AntiSpamService::REDIS_CAPTCHA.$this->user->id.':'.$key, 0);
        $this->unlock($key)->assertJson(['code' => ResponseCode::CAPTCHA_NOT_FOUND]);
        $other = User::factory()->create();
        $otherKey = $this->service->issueCaptcha($other, 'abcd');
        $this->unlock($otherKey)->assertJson(['code' => ResponseCode::CAPTCHA_NOT_FOUND]);
        $this->assertSame(1, Redis::exists(AntiSpamService::REDIS_CAPTCHA.$other->id.':'.$otherKey));
        $this->assertSame(1, Redis::exists($this->postKey));
    }

    public function test_old_captcha_cannot_clear_new_round_even_if_new_round_is_blocked(): void
    {
        $this->reachLimit();
        $key = $this->service->issueCaptcha($this->user, 'abcd');
        Redis::expire($this->postKey, 0);
        $this->reachLimit();
        $newRound = Redis::hget($this->postKey, 'round');
        $this->unlock($key)->assertJson(['code' => ResponseCode::SUCCESS]);
        $this->assertSame($newRound, Redis::hget($this->postKey, 'round'));
        $this->assertSame(Redis::hget($this->postKey, 'limit'), Redis::hget($this->postKey, 'count'));
    }

    public function test_expired_window_can_be_acknowledged_without_recreating_counter(): void
    {
        $this->reachLimit();
        $key = $this->service->issueCaptcha($this->user, 'abcd');
        Redis::expire($this->postKey, 0);
        $this->unlock($key)->assertJson(['code' => ResponseCode::SUCCESS]);
        $this->assertSame(0, Redis::exists($this->postKey));
    }

    public function test_invalid_type_is_rejected_before_consuming_captcha(): void
    {
        $key = $this->service->issueCaptcha($this->user, 'abcd');
        $this->unlock($key, 'abcd', 'anything')->assertUnprocessable();
        $this->assertSame(1, Redis::exists(AntiSpamService::REDIS_CAPTCHA.$this->user->id.':'.$key));
    }

    public function test_get_and_unlock_rate_limits_are_independent_and_account_based(): void
    {
        for ($i = 0; $i < 10; $i++) {
            $this->withServerVariables(['REMOTE_ADDR' => '192.0.2.'.($i + 1)]);
            $this->getJson('/api/captcha')->assertOk();
            $this->unlock('missing')->assertOk()->assertJson(['code' => ResponseCode::CAPTCHA_NOT_FOUND]);
        }
        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.1']);
        $this->getJson('/api/captcha')->assertTooManyRequests();
        $this->unlock('missing')->assertTooManyRequests();
        $other = User::factory()->create(['admin' => 0, 'is_banned' => false, 'locked_until' => null]);
        $this->actingAs($other, 'sanctum');
        $this->getJson('/api/captcha')->assertOk();
        $this->unlock('missing')->assertOk();
        Bus::assertNotDispatched(ProcessUserActive::class);
    }

    public function test_retired_queued_logs_are_skipped_but_normal_activity_is_written(): void
    {
        $this->travelTo(now()->setDate(2021, 8, 1));
        foreach ([
            '反机器人多维评分', '用户触发了机器人刷帖警报', '用户触发了抢红包警报',
            '怀疑用户用脚本刷帖(JS脚本类型)', '怀疑用户用脚本刷帖(key不正确)', '用户输入验证码错误',
        ] as $active) {
            (new ProcessUserActive(['binggan' => $this->user->binggan, 'user_id' => $this->user->id, 'active' => $active]))->handle();
        }
        $this->assertDatabaseCount('user_actives_2021_8', 0);
        (new ProcessUserActive(['binggan' => $this->user->binggan, 'user_id' => $this->user->id, 'active' => '用户打赏了']))->handle();
        $this->assertDatabaseCount('user_actives_2021_8', 1);
        $this->assertDatabaseHas('user_actives_2021_8', ['active' => '用户打赏了']);
    }
}
