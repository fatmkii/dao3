<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Jobs\ProcessAdminActive;
use App\Models\Accuse;
use App\Models\AccuseReason;
use App\Models\Admin;
use App\Models\AdminActive;
use App\Models\MobileSession;
use App\Models\User;
use App\Services\AccuseHandlingService;
use App\Services\MobileSessionService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use RuntimeException;
use Tests\TestCase;

class InvalidAccuseAutoLockTest extends TestCase
{
    use RefreshDatabase;

    private User $reporter;

    private User $admin;

    private User $target;

    private int $postId = 100;

    protected function setUp(): void
    {
        parent::setUp();
        Carbon::setTestNow(Carbon::parse('2026-11-15 12:00:00'));
        Bus::fake([ProcessAdminActive::class]);
        $this->reporter = User::factory()->create();
        $this->admin = User::factory()->admin()->create();
        $this->target = User::factory()->create();
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    public function test_tenth_ignore_via_api_locks_reporter_and_writes_exact_system_log(): void
    {
        $this->history(8);
        $ninth = $this->report('2026-11-09 20:00:00');
        $this->ignore($ninth);
        $this->assertSame(0, $this->reporter->fresh()->locked_count);
        $tenth = $this->report('2026-11-09 20:05:00');
        $permission = new Admin;
        $permission->user_id = $this->admin->id;
        $permission->name = '测试管理员';
        $permission->forums = [1];
        $permission->save();
        Sanctum::actingAs($this->admin, ['forum_admin']);
        $this->postJson('/api/accuses/'.$tenth->accuse_id.'/handle', ['action' => 'ignore'])
            ->assertJson(['code' => ResponseCode::SUCCESS]);

        $this->assertSame(1, $this->reporter->fresh()->locked_count);
        $this->assertSame('2026-11-18 12:00:00', $this->reporter->fresh()->locked_until);
        $this->assertSame(0, $this->target->fresh()->locked_count);
        $this->assertSame(10, AccuseReason::whereNotNull('invalid_report_consumed_at')->count());
        $this->assertDatabaseHas('admin_actives', [
            'user_id' => '100000', 'binggan' => 'system', 'name' => '超凡智能', 'admin_level' => 0,
            'active' => '封禁饼干', 'active_type' => 'user_lock', 'content' => '无效举报1天内达到10次',
            'user_id_target' => $this->reporter->id, 'binggan_target' => $this->reporter->binggan,
            'olo' => null, 'post_id' => null, 'thread_id' => null, 'thread_title' => null, 'floor' => null,
            'is_rollbacked' => 0, 'created_at' => now()->toDateTimeString(),
        ]);
        $this->assertArrayNotHasKey('invalid_report_consumed_at', $tenth->fresh()->toArray());
        $this->postJson('/api/accuses/'.$tenth->accuse_id.'/handle', ['action' => 'ignore']);
        $this->assertSame(1, AdminActive::count());
        $this->assertSame(1, $this->reporter->fresh()->locked_count);
    }

    public function test_last_ignored_report_can_be_earliest_or_in_middle_of_window(): void
    {
        $this->history(5, '2026-11-09 10:00:00');
        $this->history(4, '2026-11-09 20:00:00');
        $this->ignore($this->report('2026-11-09 09:00:00'));
        $this->assertSame(1, $this->reporter->fresh()->locked_count);
        $this->reporter->refresh()->forceFill(['locked_until' => null])->save();
        $this->history(4, '2026-11-10 10:00:00');
        $this->history(5, '2026-11-10 20:00:00');
        $this->ignore($this->report('2026-11-10 15:00:00'));
        $this->assertSame(2, $this->reporter->fresh()->locked_count);
    }

    /** @dataProvider windowBoundaryProvider */
    public function test_exact_24_hour_boundary(string $earlier, bool $locks): void
    {
        $this->history(9, $earlier);
        $this->ignore($this->report('2026-11-09 20:05:00'));
        $this->assertSame($locks ? 1 : 0, $this->reporter->fresh()->locked_count);
    }

    public static function windowBoundaryProvider(): array
    {
        return [
            'exactly 24 hours' => ['2026-11-08 20:05:00', false],
            'one second inside' => ['2026-11-08 20:05:01', true],
            'one second outside' => ['2026-11-08 20:04:59', false],
            'future exactly 24 hours' => ['2026-11-10 20:05:00', false],
            'future one second inside' => ['2026-11-10 20:04:59', true],
        ];
    }

    public function test_cross_forum_and_loudspeaker_reports_count_per_reporter(): void
    {
        $other = User::factory()->create();
        for ($i = 0; $i < 9; $i++) {
            $reason = $this->report('2026-11-09 12:00:00', 'handled', 'ignore');
            $reason->accuse->forceFill(['forum_id' => $i + 2])->save();
        }
        $last = $this->report('2026-11-09 15:00:00', type: 'loudspeaker');
        AccuseReason::create([
            'accuse_id' => $last->accuse_id, 'loudspeaker_id' => $last->loudspeaker_id,
            'reporter_user_id' => $other->id, 'reason' => 'another reporter',
        ]);
        $this->ignore($last);
        $this->assertSame(1, $this->reporter->fresh()->locked_count);
        $this->assertSame(0, $other->fresh()->locked_count);
        $this->assertSame(2, AccuseReason::where('accuse_id', $last->accuse_id)->count());
    }

    public function test_pending_and_other_actions_do_not_count_or_trigger(): void
    {
        foreach (['delete', 'deleteAll', 'lock', 'ban'] as $action) {
            $this->report('2026-11-09 12:00:00', 'handled', $action);
        }
        $this->history(4);
        $this->report('2026-11-09 12:00:00');
        $this->ignore($this->report('2026-11-09 13:00:00'));
        $this->assertSame(0, $this->reporter->fresh()->locked_count);
        $this->history(5);
        $nonIgnore = $this->report('2026-11-09 14:00:00');
        app(AccuseHandlingService::class)->markPendingByAccuseIds([$nonIgnore->accuse_id], $this->admin, 'delete', '有效举报');
        $this->assertSame(0, $this->reporter->fresh()->locked_count);
    }

    public function test_unrelated_historical_threshold_does_not_trigger(): void
    {
        $this->history(10, '2026-10-01 12:00:00');
        $this->ignore($this->report('2026-11-09 12:00:00'));
        $this->assertSame(0, $this->reporter->fresh()->locked_count);
    }

    public function test_consumed_reports_cannot_be_reused_after_expiry(): void
    {
        $this->history(9);
        $this->ignore($this->report('2026-11-09 13:00:00'));
        Carbon::setTestNow(now()->addDays(4));
        $this->ignore($this->report('2026-11-09 14:00:00'));
        $this->assertSame(1, $this->reporter->fresh()->locked_count);
        $this->assertSame(10, AccuseReason::whereNotNull('invalid_report_consumed_at')->count());
    }

    /** @dataProvider lockedStateProvider */
    public function test_every_ignore_while_locked_is_covered_without_extra_penalty(bool $banned): void
    {
        $this->reporter->forceFill(['is_banned' => $banned, 'locked_count' => 1, 'locked_until' => now()->addDay()])->save();
        $until = $this->reporter->locked_until->toDateTimeString();
        for ($i = 1; $i <= 10; $i++) {
            $reason = $this->report('2026-11-09 13:00:00');
            $this->ignore($reason);
            $this->assertNotNull($reason->fresh()->invalid_report_consumed_at);
        }
        $this->assertSame(1, $this->reporter->fresh()->locked_count);
        $this->assertSame($until, $this->reporter->fresh()->locked_until);
        $this->assertSame(0, AdminActive::count());
        Carbon::setTestNow(now()->addDays(2));
        $this->reporter->forceFill(['is_banned' => false])->save();
        $this->ignore($this->report('2026-11-09 14:00:00'));
        $this->assertSame(1, $this->reporter->fresh()->locked_count);
    }

    public static function lockedStateProvider(): array
    {
        return [[false], [true]];
    }

    /** @dataProvider lockCountProvider */
    public function test_progressive_penalty_and_fourth_lock_revokes_sessions(int $priorCount, int $days): void
    {
        $this->reporter->forceFill(['locked_count' => $priorCount])->save();
        app(MobileSessionService::class)->create($this->reporter, 'test-install', 'Test', '1.0');
        $this->history(9);
        $this->ignore($this->report('2026-11-09 13:00:00'));
        $user = $this->reporter->fresh();
        $this->assertSame($priorCount + 1, $user->locked_count);
        $this->assertSame(now()->addDays($days)->toDateTimeString(), $user->locked_until);
        $this->assertSame($priorCount === 3, $user->is_banned);
        $session = MobileSession::where('user_id', $user->id)->firstOrFail();
        $this->assertSame($priorCount === 3, $session->revoked_at !== null);
        $this->assertSame($priorCount === 3 ? 0 : 1, $user->tokens()->count());
    }

    public static function lockCountProvider(): array
    {
        return [[0, 3], [1, 6], [2, 9], [3, 12]];
    }

    public function test_system_log_failure_rolls_back_ignore_consumption_and_lock(): void
    {
        $this->history(9);
        $last = $this->report('2026-11-09 13:00:00');
        AdminActive::creating(fn () => throw new RuntimeException('log failure'));
        try {
            $this->ignore($last);
            $this->fail('Expected log failure');
        } catch (RuntimeException $exception) {
            $this->assertSame('log failure', $exception->getMessage());
        } finally {
            AdminActive::flushEventListeners();
        }
        $this->assertSame('pending', $last->accuse->fresh()->status);
        $this->assertSame(0, $this->reporter->fresh()->locked_count);
        $this->assertSame(0, AccuseReason::whereNotNull('invalid_report_consumed_at')->count());
    }

    public function test_concurrent_ignores_do_not_miss_threshold_or_duplicate_penalty(): void
    {
        if (! function_exists('pcntl_fork')) {
            $this->markTestSkipped('pcntl is required for the concurrency check');
        }
        $this->history(8);
        $pending = [$this->report('2026-11-09 13:00:00'), $this->report('2026-11-09 14:00:00')];
        $accuseIds = Accuse::pluck('id')->all();
        $userIds = [$this->reporter->id, $this->admin->id, $this->target->id];
        DB::commit();
        DB::disconnect();
        $children = [];
        $errorFiles = [];
        $startAt = microtime(true) + 0.3;
        try {
            foreach ($pending as $reason) {
                $errorFile = tempnam(sys_get_temp_dir(), 'accuse-concurrency-');
                $errorFiles[] = $errorFile;
                $pid = pcntl_fork();
                if ($pid === 0) {
                    while (microtime(true) < $startAt) {
                        usleep(1000);
                    }
                    DB::reconnect();
                    try {
                        $this->ignore($reason);
                        exit(0);
                    } catch (\Throwable $exception) {
                        file_put_contents($errorFile, $exception::class.': '.$exception->getMessage());
                        exit(1);
                    }
                }
                $this->assertGreaterThan(0, $pid);
                $children[] = $pid;
            }
            foreach ($children as $index => $pid) {
                pcntl_waitpid($pid, $status);
                $this->assertSame(0, pcntl_wexitstatus($status), file_get_contents($errorFiles[$index]));
            }
            DB::reconnect();
            $this->assertSame(1, $this->reporter->fresh()->locked_count);
            $this->assertSame(10, AccuseReason::whereNotNull('invalid_report_consumed_at')->count());
            $this->assertSame(1, AdminActive::where('user_id_target', $this->reporter->id)->count());
        } finally {
            DB::reconnect();
            AdminActive::whereIn('user_id_target', $userIds)->delete();
            Accuse::whereIn('id', $accuseIds)->delete();
            User::whereIn('id', $userIds)->delete();
            foreach ($errorFiles as $file) {
                unlink($file);
            }
            DB::beginTransaction();
        }
    }

    private function history(int $count, string $time = '2026-11-09 12:00:00'): void
    {
        for ($i = 0; $i < $count; $i++) {
            $this->report($time, 'handled', 'ignore');
        }
    }

    private function report(string $time, string $status = 'pending', ?string $action = null, string $type = 'post'): AccuseReason
    {
        $id = ++$this->postId;
        $accuse = Accuse::create([
            'target_type' => $type, 'thread_id' => 1, 'forum_id' => 1, 'floor' => 1,
            'post_id' => $type === 'post' ? $id : null,
            'loudspeaker_id' => $type === 'loudspeaker' ? $id : null,
            'target_binggan' => $this->target->binggan, 'target_user_id' => $this->target->id,
            'thread_title' => 'test', 'status' => $status, 'handle_action' => $action,
        ]);
        $reason = new AccuseReason([
            'accuse_id' => $accuse->id, 'post_id' => $accuse->post_id, 'loudspeaker_id' => $accuse->loudspeaker_id,
            'reporter_user_id' => $this->reporter->id, 'reason' => 'test reason',
        ]);
        $reason->created_at = Carbon::parse($time);
        $reason->save();

        return $reason;
    }

    private function ignore(AccuseReason $reason): void
    {
        app(AccuseHandlingService::class)->markPendingByAccuseIds([$reason->accuse_id], $this->admin, 'ignore', '忽略');
    }
}
