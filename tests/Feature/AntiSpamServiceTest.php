<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Exceptions\SpamDetectedException;
use App\Http\Middleware\ThrottlePost;
use App\Jobs\ProcessUserActive;
use App\Models\User;
use App\Services\AntiSpamService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Redis;
use RuntimeException;
use Tests\Concerns\InteractsWithAntiSpamRedis;
use Tests\TestCase;

class AntiSpamServiceTest extends TestCase
{
    use InteractsWithAntiSpamRedis;

    private AntiSpamService $service;

    private User $user;

    private string $key;

    protected function setUp(): void
    {
        parent::setUp();
        $this->isolateAntiSpamRedis();
        $this->service = new AntiSpamService;
        $this->user = new User(['binggan' => 'antispam_test', 'admin' => 0]);
        $this->user->id = 100001;
        $this->key = AntiSpamService::REDIS_POST_CAPTCHA.$this->user->id;
        Bus::fake([ProcessUserActive::class]);
    }

    private function reply(string $ip = '192.0.2.1'): array
    {
        $reservation = $this->service->checkPostSpam($ip, $this->user);
        $this->service->finishPostReservation($this->user, $reservation, true);

        return $reservation;
    }

    private function assertCaptchaRequired(string $ip = '192.0.2.1'): void
    {
        try {
            $this->service->checkPostSpam($ip, $this->user);
            $this->fail('The reply should require a captcha');
        } catch (SpamDetectedException $exception) {
            $this->assertSame(ResponseCode::POST_TOO_MANY_MAYBE_ROBOT, $exception->render(request())->getData(true)['code']);
        }
        Bus::assertNotDispatched(ProcessUserActive::class);
    }

    /** @dataProvider limits */
    public function test_threshold_is_fixed_for_the_round_and_reached_after_n_successes(int $limit): void
    {
        $this->service = new class($limit) extends AntiSpamService
        {
            public function __construct(private int $limit)
            {
            }

            protected function newPostCaptchaLimit(): int
            {
                return $this->limit;
            }
        };
        $this->reply();
        $this->assertSame($limit, (int) Redis::hget($this->key, 'limit'));
        // Later requests provide different random candidates, but must retain the first threshold.
        $this->service = new AntiSpamService;
        for ($i = 1; $i < $limit; $i++) {
            $this->reply('192.0.2.'.($i + 1));
        }
        $this->assertSame($limit, (int) Redis::hget($this->key, 'count'));
        $this->assertCaptchaRequired('198.51.100.1');
        $this->assertCaptchaRequired('198.51.100.2');
        $this->assertSame($limit, (int) Redis::hget($this->key, 'limit'));
    }

    public static function limits(): array
    {
        return [[80], [97], [120]];
    }

    public function test_users_on_the_same_ip_have_independent_hourly_counts(): void
    {
        $this->reply();
        Redis::hset($this->key, 'count', 120);
        $other = new User(['admin' => 0]);
        $other->id = 100002;
        $reservation = $this->service->checkPostSpam('192.0.2.1', $other);
        $this->assertNotNull($reservation);
        $this->service->finishPostReservation($other, $reservation, true);
        $this->assertCaptchaRequired();
    }

    public function test_hour_starts_at_first_success_and_is_not_extended(): void
    {
        $reservation = $this->service->checkPostSpam('192.0.2.1', $this->user);
        Redis::expire($this->key, 20);
        $this->service->finishPostReservation($this->user, $reservation, true);
        $this->assertGreaterThanOrEqual(3599, Redis::ttl($this->key));
        Redis::expire($this->key, 20);
        $this->reply();
        $this->assertLessThanOrEqual(20, Redis::ttl($this->key));
    }

    public function test_expiration_starts_a_new_round_and_ignores_old_completions(): void
    {
        $old = $this->reply();
        $pending = $this->service->checkPostSpam('192.0.2.1', $this->user);
        Redis::hset($this->key, 'count', 120);
        $this->assertCaptchaRequired();
        Redis::expire($this->key, 0);
        $new = $this->reply();
        $this->assertNotSame($old['round'], $new['round']);
        $this->service->finishPostReservation($this->user, $pending, false);
        $this->service->finishPostReservation($this->user, $old, true);
        $this->assertSame(1, (int) Redis::hget($this->key, 'count'));
        $this->assertSame(0, (int) Redis::hget($this->key, 'pending'));
        $this->assertGreaterThanOrEqual(80, (int) Redis::hget($this->key, 'limit'));
        $this->assertLessThanOrEqual(120, (int) Redis::hget($this->key, 'limit'));
    }

    public function test_inflight_requests_cannot_overbook_and_failures_release_the_slot(): void
    {
        $this->reply();
        $limit = (int) Redis::hget($this->key, 'limit');
        Redis::hset($this->key, 'count', $limit - 1);
        $pending = $this->service->checkPostSpam('192.0.2.1', $this->user);
        $this->assertCaptchaRequired('198.51.100.1');
        $this->service->finishPostReservation($this->user, $pending, false);
        $last = $this->reply();
        $this->service->finishPostReservation($this->user, $last, true);
        $this->assertSame($limit, (int) Redis::hget($this->key, 'count'));
        $this->assertCaptchaRequired();
    }

    public function test_failed_first_reply_leaves_no_counter(): void
    {
        $pending = $this->service->checkPostSpam('192.0.2.1', $this->user);
        $this->service->finishPostReservation($this->user, $pending, false);
        $this->assertSame(0, Redis::exists($this->key));
    }

    public function test_concurrent_requests_cannot_claim_the_same_last_slot(): void
    {
        if (! function_exists('pcntl_fork')) {
            $this->markTestSkipped('pcntl is required for the concurrency check');
        }
        $this->reply();
        $limit = (int) Redis::hget($this->key, 'limit');
        Redis::hset($this->key, 'count', $limit - 1);
        $prefix = Redis::connection()->client()->getOption(\Redis::OPT_PREFIX);
        Redis::purge('default');
        $startAt = microtime(true) + 0.3;
        $children = [];
        for ($i = 0; $i < 4; $i++) {
            $pid = pcntl_fork();
            if ($pid === 0) {
                Redis::connection()->client()->setOption(\Redis::OPT_PREFIX, $prefix);
                while (microtime(true) < $startAt) {
                    usleep(1000);
                }
                try {
                    $this->reply('192.0.2.'.($i + 1));
                    exit(0);
                } catch (SpamDetectedException) {
                    exit(2);
                } catch (\Throwable $exception) {
                    fwrite(STDERR, $exception->getMessage());
                    exit(3);
                }
            }
            $this->assertGreaterThan(0, $pid);
            $children[] = $pid;
        }
        $codes = [];
        foreach ($children as $pid) {
            pcntl_waitpid($pid, $status);
            $codes[] = pcntl_wexitstatus($status);
        }
        Redis::connection()->client()->setOption(\Redis::OPT_PREFIX, $prefix);
        sort($codes);
        $this->assertSame([0, 2, 2, 2], $codes);
        $this->assertSame($limit, (int) Redis::hget($this->key, 'count'));
    }

    public function test_minute_limit_remains_shared_by_ip_and_does_not_extend(): void
    {
        for ($i = 0; $i < 9; $i++) {
            $this->service->recordPost('192.0.2.1');
        }
        $minuteKey = AntiSpamService::REDIS_POST_RECORD.'192.0.2.1';
        Redis::expire($minuteKey, 20);
        $this->service->recordPost('192.0.2.1');
        $this->assertLessThanOrEqual(20, Redis::ttl($minuteKey));
        $other = new User(['admin' => 0]);
        $other->id = 100002;
        try {
            $this->service->checkPostSpam('192.0.2.1', $other);
            $this->fail('IP minute limit should apply to both users');
        } catch (SpamDetectedException $exception) {
            $this->assertSame(ResponseCode::POST_TOO_MANY, $exception->render(request())->getData(true)['code']);
        }
        $this->assertNotNull($this->service->checkPostSpam('192.0.2.2', $other));
    }

    public function test_admin_reply_exemption_and_thread_and_hongbao_limits_are_preserved(): void
    {
        $this->user->admin = 10;
        Redis::setex(AntiSpamService::REDIS_POST_RECORD.'192.0.2.1', 60, 10);
        $this->assertNull($this->service->checkPostSpam('192.0.2.1', $this->user));
        $this->assertSame(0, Redis::exists($this->key));
        $this->user->admin = 0;
        $this->service->recordThread($this->user->binggan);
        try {
            $this->service->checkThreadSpam($this->user->binggan, $this->user);
            $this->fail('Thread cooldown should apply');
        } catch (SpamDetectedException $exception) {
            $this->assertSame(ResponseCode::THREAD_TOO_MANY, $exception->render(request())->getData(true)['code']);
        }
        for ($i = 0; $i < 6; $i++) {
            $this->service->checkHongbaoSpam('192.0.2.1', $this->user);
            $this->service->recordHongbao('192.0.2.1');
        }
        $this->assertGreaterThanOrEqual(299, Redis::ttl(AntiSpamService::REDIS_HONGBAO_RECORD_IP.'192.0.2.1'));
        try {
            $this->service->checkHongbaoSpam('192.0.2.1', $this->user);
            $this->fail('Hongbao should require captcha');
        } catch (SpamDetectedException $exception) {
            $this->assertSame(ResponseCode::POST_TOO_MANY_MAYBE_ROBOT, $exception->render(request())->getData(true)['code']);
        }
        Bus::assertNotDispatched(ProcessUserActive::class);
    }

    /** @dataProvider failedResponses */
    public function test_middleware_releases_failures_and_counts_committed_replies(bool $throws, bool $committed): void
    {
        $request = Request::create('/api/posts/create', 'POST');
        $request->setUserResolver(fn () => $this->user);
        try {
            (new ThrottlePost($this->service))->handle($request, function ($request) use ($throws, $committed) {
                $request->attributes->set('anti_spam_post_committed', $committed);
                if ($throws) {
                    throw new RuntimeException('business failure');
                }

                return new JsonResponse(['code' => ResponseCode::THREAD_NOT_FOUND]);
            });
        } catch (RuntimeException $exception) {
            $this->assertTrue($throws);
        }
        $this->assertSame($committed ? 1 : 0, (int) Redis::hget($this->key, 'count'));
        $this->assertSame($committed ? 1 : 0, (int) Redis::get(AntiSpamService::REDIS_POST_RECORD.'127.0.0.1'));
    }

    public static function failedResponses(): array
    {
        return [[false, false], [true, false], [true, true]];
    }

    public function test_posts_and_battles_share_one_counter_and_views_do_not_reset_it(): void
    {
        foreach (['/api/posts/create', '/api/battles'] as $path) {
            $request = Request::create($path, 'POST', ['forum_id' => 1]);
            $request->setUserResolver(fn () => $this->user);
            (new ThrottlePost($this->service))->handle($request, fn () => new JsonResponse(['code' => ResponseCode::SUCCESS]));
        }
        $request = Request::create('/api/threads/1', 'GET');
        $request->setUserResolver(fn () => $this->user);
        (new ThrottlePost($this->service))->handle($request, fn () => new JsonResponse(['code' => ResponseCode::SUCCESS]));
        $this->assertSame(2, (int) Redis::hget($this->key, 'count'));
    }

    public function test_cleanup_only_removes_retired_redis_keys(): void
    {
        $retired = ['post_timeline:example', 'new_post_record_IP2_192.0.2.1', 'new_post_record_IP_192.0.2.1'];
        $retained = [AntiSpamService::REDIS_POST_RECORD.'192.0.2.1', AntiSpamService::REDIS_HONGBAO_RECORD_IP.'192.0.2.1', 'post_timeline_backup:example'];
        foreach (array_merge($retired, $retained) as $key) {
            Redis::set($key, '1');
        }
        $this->reply('192.0.2.2');
        $this->artisan('antispam:cleanup-legacy', ['--dry-run' => true])->expectsOutput('匹配旧键：3')->assertSuccessful();
        foreach ($retired as $key) {
            $this->assertSame(1, Redis::exists($key));
        }
        $this->artisan('antispam:cleanup-legacy')->expectsOutput('已删除旧键：3')->assertSuccessful();
        foreach ($retired as $key) {
            $this->assertSame(0, Redis::exists($key));
        }
        foreach (array_merge($retained, [$this->key]) as $key) {
            $this->assertSame(1, Redis::exists($key));
        }
    }
}
