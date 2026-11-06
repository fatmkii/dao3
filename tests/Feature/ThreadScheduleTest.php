<?php

namespace Tests\Feature;

use App\Jobs\ProcessIncomeStatement;
use App\Jobs\ProcessUserActive;
use App\Models\Forum;
use App\Models\Loudspeaker;
use App\Models\Thread;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\InteractsWithAntiSpamRedis;
use Tests\TestCase;

class ThreadScheduleTest extends TestCase
{
    use InteractsWithAntiSpamRedis, RefreshDatabase;

    private User $author;

    private Forum $forum;

    protected function setUp(): void
    {
        parent::setUp();
        $this->isolateAntiSpamRedis();
        Bus::fake([ProcessIncomeStatement::class, ProcessUserActive::class]);
        $this->withoutMiddleware(\App\Http\Middleware\ThrottlePost::class);
        $this->author = User::factory()->create(['coin' => 100000]);
        $this->forum = Forum::create(['name' => '预约测试', 'description' => 'test', 'is_nissin' => 2]);
        Sanctum::actingAs($this->author, ['normal']);
        Carbon::setTestNow('2026-11-01 20:00:00');
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function body(array $overrides = []): array
    {
        return array_replace([
            'binggan' => $this->author->binggan, 'forum_id' => $this->forum->id,
            'title' => '预约主题测试', 'content' => '预约主题正文', 'nickname' => '测试',
            'subtitle' => '[闲聊]', 'anti_jingfen' => false, 'nissin_time' => 2,
            'random_heads_group' => 1, 'post_with_admin' => false, 'thread_type' => 'normal',
            'is_delay' => true, 'is_private' => false, 'can_battle' => true,
        ], $overrides);
    }

    /** @dataProvider dateProvider */
    public function test_date_range(string $now, string $date, bool $valid): void
    {
        Carbon::setTestNow($now);
        $response = $this->postJson('/api/threads/create', $this->body(['scheduled_date' => $date]));
        if (! $valid) {
            $response->assertUnprocessable()->assertJsonValidationErrors('scheduled_date');
            $this->assertDatabaseCount('threads', 0);
            $this->assertSame(100000, $this->author->fresh()->coin);

            return;
        }
        $response->assertJsonPath('code', 200);
        $thread = Thread::findOrFail($response->json('data.thread_id'));
        $this->assertSame($date.' 08:00:00', $thread->scheduled_at->toDateTimeString());
        $this->assertSame(Carbon::parse($date.' 08:00')->addDays(2)->toDateTimeString(), $thread->nissin_date);
    }

    public static function dateProvider(): array
    {
        return [
            ['2026-11-01 20:00', '2026-11-02', true],
            ['2026-11-01 20:00', '2026-11-08', true],
            ['2026-11-02 01:00', '2026-11-02', true],
            ['2026-11-02 07:59:59', '2026-11-08', true],
            ['2026-11-02 08:00:00', '2026-11-02', false],
            ['2026-11-02 08:00:00', '2026-11-09', true],
            ['2026-11-01 20:00', '2026-11-09', false],
            ['2026-11-01 20:00', '2026-11-01', false],
            ['2026-11-01 20:00', '2026-11-02 08:00:00', false],
            ['2026-11-01 20:00', '2026-11-31', false],
            ['2026-11-01 20:00', '', false],
            ['2026-12-31 20:00', '2027-01-07', true],
            ['2026-11-30 01:00', '2026-12-06', true],
        ];
    }

    public function test_legacy_requests_and_immediate_posts(): void
    {
        $response = $this->postJson('/api/threads/create', $this->body())->assertJsonPath('code', 200);
        $this->assertSame('2026-11-02 08:00:00', Thread::find($response->json('data.thread_id'))->scheduled_at->toDateTimeString());
        $this->postJson('/api/threads/create', $this->body(['is_delay' => false, 'scheduled_date' => '2026-11-03']))
            ->assertUnprocessable()->assertJsonValidationErrors('scheduled_date');
        $response = $this->postJson('/api/threads/create', $this->body(['is_delay' => false, 'scheduled_date' => null]))->assertJsonPath('code', 200);
        $thread = Thread::find($response->json('data.thread_id'));
        $this->assertNull($thread->scheduled_at);
        $this->assertFalse($thread->is_delay);
    }

    public function test_activity_end_must_be_later_than_scheduled_time(): void
    {
        foreach (['vote', 'gamble', 'crowd'] as $type) {
            $this->postJson('/api/threads/create', $this->body([
                'scheduled_date' => '2026-11-08', 'thread_type' => $type,
                $type.'_params' => ['end_time' => '2026-11-08 08:00:00'],
            ]))->assertUnprocessable()->assertJsonValidationErrors($type.'_params.end_time');
        }
        $this->assertDatabaseCount('threads', 0);
        $this->assertSame(100000, $this->author->fresh()->coin);
    }

    public function test_release_only_publishes_due_non_deleted_threads_once(): void
    {
        foreach ([1 => ['2026-11-02 08:00:00', 0], 2 => ['2026-11-03 08:00:00', 0], 3 => [null, 0], 4 => ['2026-11-02 08:00:00', 1]] as $id => [$scheduledAt, $deleted]) {
            DB::table('threads')->insert(['id' => 10000 + $id, 'forum_id' => $this->forum->id, 'title' => '待发',
                'is_delay' => 1, 'scheduled_at' => $scheduledAt, 'is_deleted' => $deleted, 'created_at' => now(), 'updated_at' => now()]);
        }
        Carbon::setTestNow('2026-11-02 07:59:59');
        $this->artisan('DelayThreadHandle:run');
        $this->assertSame(4, Thread::where('is_delay', true)->count());
        Carbon::setTestNow('2026-11-02 08:00:00');
        $this->artisan('DailyNissinHandle:run');
        $this->artisan('DelayThreadHandle:run');
        $this->assertFalse(Thread::find(10001)->is_delay);
        $this->assertFalse(Thread::find(10003)->is_delay);
        $this->assertTrue(Thread::find(10002)->is_delay);
        $this->assertTrue(Thread::find(10004)->is_delay);
        $updated = Thread::find(10001)->updated_at;
        Carbon::setTestNow('2026-11-02 08:01:00');
        $this->artisan('DelayThreadHandle:run');
        $this->assertTrue($updated->equalTo(Thread::find(10001)->updated_at));
    }

    /** @dataProvider futureDayProvider */
    public function test_api_scheduled_thread_publishes_on_its_future_day(int $days): void
    {
        $this->forum->forceFill(['is_nissin' => 1])->save();
        $scheduledAt = now()->startOfDay()->addDays($days)->addHours(8);
        $response = $this->postJson('/api/threads/create', $this->body([
            'scheduled_date' => $scheduledAt->toDateString(),
        ]))->assertJsonPath('code', 200);
        $id = $response->json('data.thread_id');

        for ($day = 1; $day <= $days; $day++) {
            $morning = Carbon::parse('2026-11-01 08:00:00')->addDays($day);
            Carbon::setTestNow($morning->copy()->subSecond());
            $this->artisan('DelayThreadHandle:run');
            $this->assertTrue(Thread::findOrFail($id)->is_delay);

            Carbon::setTestNow($morning);
            $this->artisan('DailyNissinHandle:run');
            $this->artisan('DelayThreadHandle:run');
            $thread = Thread::findOrFail($id);
            $this->assertSame($day < $days, $thread->is_delay);
            $this->assertFalse($thread->has_nissined);
        }

        $this->assertSame($scheduledAt->copy()->addSeconds(10)->toDateTimeString(), $thread->created_at->toDateTimeString());
        $this->assertSame($scheduledAt->copy()->addSeconds(10)->toDateTimeString(), $thread->updated_at->toDateTimeString());
        $this->assertSame($scheduledAt->toDateTimeString(), $thread->scheduled_at->toDateTimeString());
    }

    public static function futureDayProvider(): array
    {
        return ['two days later' => [2], 'three days later' => [3]];
    }

    public function test_scheduler_runs_publication_at_eight_after_daily_cleanup(): void
    {
        $events = collect(Schedule::events());
        $publication = $events->first(fn ($event) => str_contains($event->command ?? '', 'DelayThreadHandle:run'));
        $cleanup = $events->first(fn ($event) => str_contains($event->command ?? '', 'DailyNissinHandle:run'));
        $this->assertNotNull($publication);
        $this->assertNotNull($cleanup);
        $this->assertLessThan($events->search($publication), $events->search($cleanup));

        foreach (['2026-11-03', '2026-11-04'] as $date) {
            Carbon::setTestNow($date.' 07:59:59');
            $this->assertFalse($publication->isDue($this->app));
            Carbon::setTestNow($date.' 08:00:00');
            $this->assertTrue($cleanup->isDue($this->app));
            $this->assertTrue($publication->isDue($this->app));
            Carbon::setTestNow($date.' 08:01:00');
            $this->assertFalse($publication->isDue($this->app));
        }
    }

    public function test_hongbao_loudspeaker_follows_schedule_and_is_removed_on_withdrawal(): void
    {
        // Isolate existing hongbao schema/model issues: migrations omit pic_url,
        // and the protected user_id property shadows the persisted attribute.
        $events = \App\Models\Hongbao::getEventDispatcher();
        \App\Models\Hongbao::setEventDispatcher(clone $events);
        $this->beforeApplicationDestroyed(fn () => \App\Models\Hongbao::setEventDispatcher($events));
        \App\Models\Hongbao::saving(function ($hongbao) {
            $hongbao->setAttribute('user_id', $this->author->id);
            unset($hongbao->pic_url);
        });
        $response = $this->postJson('/api/threads/create', $this->body([
            'scheduled_date' => '2026-11-08', 'thread_type' => 'hongbao',
            'hongbao_params' => ['olo' => 20000, 'num' => 10, 'type' => 1, 'keyword' => '红包',
                'message' => [], 'olo_hide' => false, 'loudspeaker' => true, 'pic_url' => null],
        ]))->assertJsonPath('code', 200);
        $id = $response->json('data.thread_id');
        $loudspeaker = Loudspeaker::where('thread_id', $id)->firstOrFail();
        $this->assertSame('2026-11-08 08:00:00', $loudspeaker->effective_date);
        $this->assertSame('2026-11-09 08:00:00', $loudspeaker->expire_date);
        $this->deleteJson('/api/threads/delay/'.$id)->assertJsonPath('code', 200);
        $this->assertNull(Loudspeaker::find($loudspeaker->id));
        Carbon::setTestNow('2026-11-08 08:00:00');
        $this->artisan('DelayThreadHandle:run');
        $this->assertFalse(Thread::find($id)->is_delay);
        $this->assertSame(1, Thread::find($id)->is_deleted);
    }
}
