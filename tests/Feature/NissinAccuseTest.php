<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Jobs\ProcessAdminActive;
use App\Models\Accuse;
use App\Models\AccuseReason;
use App\Models\Admin;
use App\Models\AdminActive;
use App\Models\Forum;
use App\Models\Post;
use App\Models\Thread;
use App\Models\User;
use App\Services\AccuseHandlingService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NissinAccuseTest extends TestCase
{
    use RefreshDatabase;

    private User $reporter;

    private User $admin;

    private Forum $forum;

    private Thread $thread;

    private int $postId = 100;

    protected function setUp(): void
    {
        parent::setUp();
        Carbon::setTestNow('2026-11-10 08:05:00');
        Bus::fake([ProcessAdminActive::class]);
        $this->reporter = User::factory()->create();
        $this->admin = User::factory()->admin()->create();
        $this->forum = Forum::create(['name' => '日清', 'description' => 'test']);
        $this->forum->forceFill(['is_nissin' => 1])->save();
        $this->thread = new Thread;
        $this->thread->forceFill([
            'forum_id' => $this->forum->id, 'title' => 'test', 'sub_title' => '[测试]',
            'created_binggan' => $this->reporter->binggan, 'is_delay' => 0,
        ])->save();
        $permission = new Admin;
        $permission->user_id = $this->admin->id;
        $permission->name = '管理员';
        $permission->forums = [$this->forum->id];
        $permission->save();
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    /** @dataProvider nissinStateProvider */
    public function test_submission_and_ignore_follow_actual_nissin_state(int $mode, bool $flag, ?string $expiry, int $subId, bool $exempt): void
    {
        $this->forum->forceFill(['is_nissin' => $mode])->save();
        $this->thread->forceFill(['has_nissined' => $flag, 'nissin_date' => $expiry, 'sub_id' => $subId])->save();
        $reason = $this->report();
        $this->ignore([$reason]);
        $this->assertSame($exempt, $reason->fresh()->invalid_report_consumed_at !== null);
        $this->assertSame('忽略', $reason->accuse->fresh()->handle_note);

        $post = Post::withoutEvents(fn () => Post::create([
            'thread_id' => $this->thread->id, 'forum_id' => $this->forum->id,
            'content' => 'test', 'created_binggan' => $this->admin->binggan,
        ]));
        Sanctum::actingAs($this->reporter);
        $before = Accuse::count();
        $this->postJson('/api/accuses', [
            'thread_id' => $this->thread->id, 'post_id' => $post->id,
            'floor' => $post->floor, 'reason' => '这是一个举报理由',
        ])->assertJson(['code' => $exempt ? ResponseCode::THREAD_WAS_NISSINED : ResponseCode::SUCCESS]);
        $this->assertSame($before + ($exempt ? 0 : 1), Accuse::count());
    }

    public static function nissinStateProvider(): array
    {
        return [
            'daily cleared' => [1, true, null, 0, true],
            'daily job not run yet' => [1, false, null, 0, false],
            'daily announcement' => [1, false, null, 10, false],
            'non daily forum' => [0, true, null, 0, false],
            'expiry without cleanup flag' => [2, false, '2026-11-10 08:04:59', 0, true],
            'exact expiry boundary' => [2, false, '2026-11-10 08:05:00', 0, false],
            'not expired' => [2, false, '2026-11-11 08:00:00', 0, false],
            'expiry announcement' => [2, true, '2026-11-09 08:00:00', 10, false],
        ];
    }

    public function test_nine_prior_invalid_reports_survive_cleanup_and_exemption_is_permanent(): void
    {
        $prior = [];
        for ($i = 0; $i < 9; $i++) {
            $prior[] = $this->report();
        }
        $this->ignore($prior);
        $pending = $this->report();
        $this->artisan('DailyNissinHandle:run');
        $this->ignore([$pending]);
        $this->assertSame(0, $this->reporter->fresh()->locked_count);
        $this->assertSame(1, AccuseReason::whereNotNull('invalid_report_consumed_at')->count());
        $this->thread->refresh()->forceFill(['has_nissined' => false])->save();
        $this->ignore([$this->report()]);
        $this->assertSame(1, $this->reporter->fresh()->locked_count);
        $this->assertSame(11, AccuseReason::whereNotNull('invalid_report_consumed_at')->count());
    }

    public function test_mixed_batch_excludes_all_exempt_reports_before_counting(): void
    {
        $pending = [];
        for ($i = 0; $i < 10; $i++) {
            $pending[] = $this->report();
        }
        $expired = $this->thread->replicate();
        $expired->has_nissined = true;
        $expired->save();
        $pending[9]->accuse->forceFill(['thread_id' => $expired->id])->save();
        $this->ignore($pending);
        $this->assertSame(0, $this->reporter->fresh()->locked_count);
        $this->assertSame(1, AccuseReason::whereNotNull('invalid_report_consumed_at')->count());
    }

    public function test_all_reporters_are_exempt_and_api_keeps_existing_text_and_log(): void
    {
        $reason = $this->report();
        $other = User::factory()->create();
        AccuseReason::create([
            'accuse_id' => $reason->accuse_id, 'post_id' => $reason->post_id,
            'reporter_user_id' => $other->id, 'reason' => 'another reason',
        ]);
        $this->thread->forceFill(['has_nissined' => true])->save();
        Sanctum::actingAs($this->admin, ['forum_admin']);
        $this->postJson('/api/accuses/'.$reason->accuse_id.'/handle', ['action' => 'ignore'])
            ->assertJson(['code' => ResponseCode::SUCCESS, 'data' => ['handle_action' => 'ignore', 'handle_note' => '忽略']]);
        $this->assertSame(2, AccuseReason::whereNotNull('invalid_report_consumed_at')->count());
        $this->assertSame(0, AdminActive::count());
        Bus::assertDispatched(ProcessAdminActive::class, function ($job) {
            $property = new \ReflectionProperty($job, 'admin_active');
            $payload = $property->getValue($job);

            return $payload['active_type'] === 'accuse_ignore' && $payload['content'] === null;
        });
        $this->postJson('/api/accuses/'.$reason->accuse_id.'/handle', ['action' => 'ignore']);
        Bus::assertDispatchedTimes(ProcessAdminActive::class, 1);
    }

    public function test_loudspeaker_linked_to_cleared_thread_still_counts(): void
    {
        $this->thread->forceFill(['has_nissined' => true])->save();
        $reason = $this->report();
        $reason->accuse->forceFill(['target_type' => 'loudspeaker', 'post_id' => null, 'loudspeaker_id' => 1])->save();
        $this->ignore([$reason]);
        $this->assertNull($reason->fresh()->invalid_report_consumed_at);
    }

    public function test_exemption_and_ignore_roll_back_together(): void
    {
        $reason = $this->report();
        $this->thread->forceFill(['has_nissined' => true])->save();
        DB::beginTransaction();
        $this->ignore([$reason]);
        $this->assertNotNull($reason->fresh()->invalid_report_consumed_at);
        DB::rollBack();
        $this->assertSame('pending', $reason->accuse->fresh()->status);
        $this->assertNull($reason->fresh()->invalid_report_consumed_at);
    }

    /** @dataProvider concurrentOperationProvider */
    public function test_daily_cleanup_and_report_operation_are_serialized(string $operation): void
    {
        if (! function_exists('pcntl_fork')) {
            $this->markTestSkipped('pcntl is required for the concurrency check');
        }
        $reason = $this->report();
        $post = Post::withoutEvents(fn () => Post::create([
            'thread_id' => $this->thread->id, 'forum_id' => $this->forum->id,
            'content' => 'test', 'created_binggan' => $this->admin->binggan,
        ]));
        $files = [];
        foreach (['locked', 'release', 'ready', 'cleanupError', 'operationError'] as $key) {
            $files[$key] = tempnam(sys_get_temp_dir(), 'nissin-concurrency-');
        }
        $wait = function (string $file): void {
            $deadline = microtime(true) + 5;
            while (file_get_contents($file) === '') {
                if (microtime(true) > $deadline) {
                    throw new \RuntimeException('Concurrent operation timed out');
                }
                usleep(1000);
            }
        };
        DB::commit();
        DB::disconnect();
        $children = [];
        try {
            $pid = pcntl_fork();
            if ($pid === 0) {
                DB::reconnect();
                try {
                    DB::transaction(function () use ($files, $wait) {
                        DB::table('threads')->where('id', $this->thread->id)->update(['has_nissined' => true]);
                        file_put_contents($files['locked'], '1');
                        $wait($files['release']);
                    });
                    exit(0);
                } catch (\Throwable $exception) {
                    file_put_contents($files['cleanupError'], $exception->getMessage());
                    exit(1);
                }
            }
            $this->assertGreaterThan(0, $pid);
            $children[] = $pid;
            $wait($files['locked']);
            $pid = pcntl_fork();
            if ($pid === 0) {
                DB::reconnect();
                try {
                    file_put_contents($files['ready'], '1');
                    if ($operation === 'ignore') {
                        $this->ignore([$reason]);
                    } else {
                        Sanctum::actingAs($this->reporter);
                        $this->postJson('/api/accuses', [
                            'thread_id' => $this->thread->id, 'post_id' => $post->id,
                            'floor' => $post->floor, 'reason' => '这是一个举报理由',
                        ])->assertJson(['code' => ResponseCode::THREAD_WAS_NISSINED]);
                    }
                    exit(0);
                } catch (\Throwable $exception) {
                    file_put_contents($files['operationError'], $exception->getMessage());
                    exit(1);
                }
            }
            $this->assertGreaterThan(0, $pid);
            $children[] = $pid;
            $wait($files['ready']);
            usleep(100000);
            file_put_contents($files['release'], '1');
            foreach ($children as $pid) {
                pcntl_waitpid($pid, $status);
                $this->assertSame(0, pcntl_wexitstatus($status), file_get_contents($files['cleanupError']).file_get_contents($files['operationError']));
            }
            $children = [];
            DB::reconnect();
            $this->assertSame($operation === 'ignore', $reason->fresh()->invalid_report_consumed_at !== null);
            $this->assertSame(1, Accuse::where('thread_id', $this->thread->id)->count());
            $this->assertSame(0, $this->reporter->fresh()->locked_count);
        } finally {
            file_put_contents($files['release'], '1');
            foreach ($children as $pid) {
                pcntl_waitpid($pid, $status);
            }
            DB::reconnect();
            Accuse::where('thread_id', $this->thread->id)->delete();
            Post::suffix(intval($this->thread->id / 10000))->where('thread_id', $this->thread->id)->delete();
            $this->thread->delete();
            $this->forum->delete();
            Admin::where('user_id', $this->admin->id)->delete();
            User::whereIn('id', [$this->admin->id, $this->reporter->id])->delete();
            foreach ($files as $file) {
                unlink($file);
            }
            DB::beginTransaction();
        }
    }

    public static function concurrentOperationProvider(): array
    {
        return [['ignore'], ['submit']];
    }

    private function report(): AccuseReason
    {
        $accuse = Accuse::create([
            'target_type' => 'post', 'thread_id' => $this->thread->id, 'forum_id' => $this->forum->id,
            'post_id' => ++$this->postId, 'floor' => 1, 'thread_title' => 'test', 'status' => 'pending',
            'target_user_id' => $this->admin->id, 'target_binggan' => $this->admin->binggan,
        ]);
        $reason = new AccuseReason([
            'accuse_id' => $accuse->id, 'post_id' => $accuse->post_id,
            'reporter_user_id' => $this->reporter->id, 'reason' => 'test reason',
        ]);
        $reason->created_at = Carbon::parse('2026-11-10 07:00:00');
        $reason->save();

        return $reason;
    }

    private function ignore(array $reasons): void
    {
        app(AccuseHandlingService::class)->markPendingByAccuseIds(
            array_map(fn ($reason) => $reason->accuse_id, $reasons), $this->admin, 'ignore', '忽略'
        );
    }
}
