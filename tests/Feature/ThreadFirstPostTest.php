<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Jobs\ProcessIncomeStatement;
use App\Models\Admin;
use App\Models\Forum;
use App\Models\Post;
use App\Models\Thread;
use App\Models\ThreadFirstPostRevision;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\InteractsWithAntiSpamRedis;
use Tests\TestCase;

class ThreadFirstPostTest extends TestCase
{
    use InteractsWithAntiSpamRedis, RefreshDatabase;

    private User $author;

    private Forum $forum;

    private Thread $thread;

    private Post $post;

    protected function setUp(): void
    {
        parent::setUp();
        $this->isolateAntiSpamRedis();
        Bus::fake();
        $this->author = User::factory()->create(['coin' => 3000]);
        $this->forum = Forum::create(['name' => '首楼编辑测试', 'description' => 'test']);
        $this->thread = new Thread;
        $this->thread->forceFill([
            'id' => 10001, 'forum_id' => $this->forum->id, 'title' => '不可变标题',
            'created_binggan' => $this->author->binggan, 'created_at' => '2026-10-01 10:00:00',
            'updated_at' => '2026-10-01 11:00:00',
        ])->save();
        $this->post = new Post;
        $this->post->setSuffix(1);
        $this->post->forceFill([
            'thread_id' => $this->thread->id, 'forum_id' => $this->forum->id, 'floor' => 0,
            'nickname' => '原始昵称', 'content' => 'A', 'created_binggan' => $this->author->binggan,
            'random_head' => 1, 'created_at' => '2026-10-01 10:00:00',
        ])->saveQuietly();
        Sanctum::actingAs($this->author, ['normal']);
    }

    private function url(string $suffix = ''): string
    {
        return '/api/threads/'.$this->thread->id.'/first-post'.$suffix;
    }

    private function editBody(string $content = 'B', ?string $id = null): array
    {
        return ['content' => $content, 'request_id' => $id ?? (string) Str::uuid()];
    }

    public function test_edit_charges_and_records_all_versions_without_bumping_or_changing_identity(): void
    {
        $payload = $this->editBody("  B\n正文  ") + ['nickname' => '冒名', 'title' => '改名', 'floor' => 1];
        $this->putJson($this->url(), $payload)->assertJsonPath('code', 200)->assertJsonPath('data.version', 1);
        $this->assertSame(2700, $this->author->fresh()->coin);
        $this->assertSame("  B\n正文  ", $this->post->fresh()->content);
        $this->assertSame('原始昵称', $this->post->fresh()->nickname);
        $this->assertSame('2026-10-01 10:00:00', $this->post->fresh()->created_at->format('Y-m-d H:i:s'));
        $this->assertSame('不可变标题', $this->thread->fresh()->title);
        $this->assertSame('2026-10-01 11:00:00', $this->thread->fresh()->updated_at->format('Y-m-d H:i:s'));
        $this->assertSame(0, $this->thread->fresh()->posts_num);
        $this->getJson($this->url('/history'))->assertJsonPath('data.versions.0.content', 'A')
            ->assertJsonPath('data.versions.0.version_at', '2026-10-01 10:00:00')
            ->assertJsonPath('data.versions.1.content', "  B\n正文  ")
            ->assertJsonPath('data.versions.1.is_current', true)
            ->assertJsonMissingPath('data.first_post.content')
            ->assertJsonMissingPath('data.first_post.created_binggan')
            ->assertJsonMissingPath('data.versions.1.request_id');
        Bus::assertDispatched(ProcessIncomeStatement::class, fn ($job) => $job->afterCommit === true);
    }

    public function test_same_content_with_a_new_confirmation_still_charges_and_records(): void
    {
        $this->putJson($this->url(), $this->editBody('A'))->assertJsonPath('data.version', 1);
        $this->putJson($this->url(), $this->editBody('A'))->assertJsonPath('data.version', 2);
        $this->assertSame(2400, $this->author->fresh()->coin);
        $this->assertDatabaseCount('thread_first_post_revisions', 3);
    }

    public function test_replayed_request_does_not_charge_or_overwrite_a_later_edit(): void
    {
        $first = $this->editBody();
        $this->putJson($this->url(), $first)->assertJsonPath('data.version', 1);
        $this->putJson($this->url(), $this->editBody('C'))->assertJsonPath('data.version', 2);
        $this->author->forceFill(['coin' => 0])->save();
        $this->putJson($this->url(), $first)->assertJsonPath('code', 200)->assertJsonPath('data.version', 1);
        $this->assertSame(0, $this->author->fresh()->coin);
        $this->assertSame('C', $this->post->fresh()->content);
        $this->assertDatabaseCount('thread_first_post_revisions', 3);
        $this->putJson($this->url(), array_replace($first, ['content' => 'D']))->assertUnprocessable();
    }

    public function test_insufficient_balance_rolls_back_content_and_original_snapshot(): void
    {
        $this->author->forceFill(['coin' => 299])->save();
        $this->putJson($this->url(), $this->editBody())->assertJsonPath('code', ResponseCode::COIN_NOT_ENOUGH);
        $this->assertSame('A', $this->post->fresh()->content);
        $this->assertSame(299, $this->author->fresh()->coin);
        $this->assertDatabaseCount('thread_first_post_revisions', 0);
        Bus::assertNotDispatched(ProcessIncomeStatement::class);
    }

    public function test_initial_history_is_read_only_and_edit_context_has_original_values(): void
    {
        $this->getJson($this->url('/history'))->assertJsonCount(1, 'data.versions')
            ->assertJsonPath('data.versions.0.version', 0)->assertJsonPath('data.versions.0.is_current', true);
        $this->assertDatabaseCount('thread_first_post_revisions', 0);
        $this->getJson($this->url('/edit'))->assertJsonPath('data.first_post.content', 'A')
            ->assertJsonPath('data.first_post.nickname', '原始昵称')->assertJsonPath('data.thread_data.title', '不可变标题');
    }

    public function test_non_authors_including_admins_cannot_edit_even_with_a_forged_cookie(): void
    {
        foreach ([0, 99] as $admin) {
            Sanctum::actingAs(User::factory()->create(['admin' => $admin, 'coin' => 3000]), ['*']);
            $this->getJson($this->url('/edit').'?binggan='.$this->author->binggan)->assertJsonPath('code', ResponseCode::POST_UNAUTHORIZED);
            $this->putJson($this->url(), $this->editBody() + ['binggan' => $this->author->binggan])->assertJsonPath('code', ResponseCode::POST_UNAUTHORIZED);
        }
        $this->assertSame('A', $this->post->fresh()->content);
        $this->assertSame(3000, $this->author->fresh()->coin);
    }

    public function test_thread_and_first_post_ownership_must_both_match(): void
    {
        $this->post->forceFill(['created_binggan' => 'someone_else'])->saveQuietly();
        $this->putJson($this->url(), $this->editBody())->assertJsonPath('code', ResponseCode::POST_UNAUTHORIZED);
    }

    public function test_deleted_first_post_history_is_only_visible_to_author_and_authorized_admin(): void
    {
        $this->putJson($this->url(), $this->editBody())->assertJsonPath('code', 200);
        foreach ([1, 2] as $state) {
            $this->post->forceFill(['is_deleted' => $state])->saveQuietly();
            Sanctum::actingAs($this->author, ['normal']);
            $this->getJson($this->url('/history'))->assertJsonPath('data.versions.0.content', 'A');
            $this->putJson($this->url(), $this->editBody())->assertJsonPath('code', ResponseCode::POST_UNAUTHORIZED);
            Sanctum::actingAs(User::factory()->create(), ['normal']);
            $this->getJson($this->url('/history'))->assertJsonPath('code', ResponseCode::POST_UNAUTHORIZED)->assertJsonMissingPath('data');
            $admin = User::factory()->create(['admin' => 10]);
            $permission = new Admin;
            $permission->forceFill(['user_id' => $admin->id, 'name' => '版管', 'forums' => [$this->forum->id]])->save();
            Sanctum::actingAs($admin, ['forum_admin']);
            $this->getJson($this->url('/history'))->assertJsonPath('code', 200);
            $permission->forceFill(['forums' => []])->save();
            $admin->unsetRelation('AdminPermissions');
            $this->getJson($this->url('/history'))->assertJsonPath('code', ResponseCode::POST_UNAUTHORIZED);
        }
        $this->post->forceFill(['is_deleted' => 0])->saveQuietly();
        $this->getJson($this->url('/history'))->assertJsonPath('code', 200);
    }

    public function test_history_and_edit_context_apply_private_coin_and_nissin_read_rules(): void
    {
        $reader = User::factory()->create(['coin' => 1000]);
        Sanctum::actingAs($reader, ['normal']);
        $this->thread->forceFill(['is_private' => true])->save();
        $this->getJson($this->url('/history'))->assertJsonPath('code', ResponseCode::THREAD_IS_PRIVATE);
        $this->getJson($this->url('/edit'))->assertJsonPath('code', ResponseCode::THREAD_IS_PRIVATE);
        $this->thread->forceFill(['is_private' => false, 'locked_by_coin' => 2000])->save();
        $this->getJson($this->url('/history'))->assertJsonPath('code', ResponseCode::THREAD_UNAUTHORIZED);
        $this->thread->forceFill(['locked_by_coin' => 0])->save();
        $this->forum->forceFill(['accessible_coin' => 2000])->save();
        $this->getJson($this->url('/history'))->assertJsonPath('code', ResponseCode::THREAD_UNAUTHORIZED);
        $this->forum->forceFill(['accessible_coin' => 0, 'is_nissin' => 1])->save();
        $this->thread->forceFill(['has_nissined' => true])->save();
        $this->getJson($this->url('/history'))->assertJsonPath('code', ResponseCode::THREAD_WAS_NISSINED);
        $this->thread->forceFill(['has_nissined' => false, 'nissin_date' => now()->subDay()])->save();
        $this->forum->forceFill(['is_nissin' => 2])->save();
        $this->getJson($this->url('/history'))->assertJsonPath('code', ResponseCode::THREAD_WAS_NISSINED);
        $this->thread->forceFill(['is_deleted' => 2])->save();
        $this->getJson($this->url('/history'))->assertJsonPath('code', ResponseCode::THREAD_NOT_FOUND);
    }

    public function test_delayed_and_special_threads_can_edit_without_changing_their_settings(): void
    {
        $this->thread->forceFill(['is_delay' => true, 'vote_question_id' => 5, 'hongbao_id' => 6, 'gamble_question_id' => 7, 'crowd_id' => 8])->save();
        $this->putJson($this->url(), $this->editBody())->assertJsonPath('code', 200);
        $thread = $this->thread->fresh();
        $this->assertTrue($thread->is_delay);
        $this->assertSame([5, 6, 7, 8], [$thread->vote_question_id, $thread->hongbao_id, $thread->gamble_question_id, $thread->crowd_id]);
    }

    public function test_validation_rejects_missing_oversized_content_and_invalid_operation_ids(): void
    {
        foreach (['', str_repeat('文', 100001)] as $content) {
            $this->putJson($this->url(), $this->editBody($content))->assertUnprocessable();
        }
        $this->putJson($this->url(), ['content' => 'B', 'request_id' => 'bad'])->assertUnprocessable();
        $this->assertDatabaseCount('thread_first_post_revisions', 0);
        $this->assertSame(3000, $this->author->fresh()->coin);
    }

    public function test_history_uses_version_order_with_twenty_per_page_even_at_the_same_time(): void
    {
        foreach (range(0, 21) as $version) {
            ThreadFirstPostRevision::create([
                'thread_id' => $this->thread->id, 'post_id' => $this->post->id, 'version' => $version,
                'content' => '正文'.$version, 'version_at' => now(),
            ]);
        }
        $this->getJson($this->url('/history'))->assertJsonCount(20, 'data.versions')
            ->assertJsonPath('data.versions.0.version', 0)->assertJsonPath('data.versions.19.version', 19)
            ->assertJsonPath('data.pagination.lastPage', 2)->assertJsonPath('data.pagination.total', 22);
        $this->getJson($this->url('/history').'?page=2')->assertJsonCount(2, 'data.versions')
            ->assertJsonPath('data.versions.0.version', 20)->assertJsonPath('data.versions.1.is_current', true);
        $this->getJson($this->url('/history').'?page=0')->assertUnprocessable();
    }

    public function test_edit_targets_the_correct_shard_and_floor(): void
    {
        DB::table('threads')->where('id', 10001)->update(['id' => 20001]);
        $this->thread->id = 20001;
        $attributes = $this->post->getAttributes();
        $attributes['thread_id'] = 20001;
        DB::table('posts_2')->insert($attributes);
        $this->putJson($this->url(), $this->editBody())->assertJsonPath('code', 200);
        $this->assertSame('A', DB::table('posts_1')->where('id', $this->post->id)->value('content'));
        $this->assertSame('B', DB::table('posts_2')->where('id', $this->post->id)->value('content'));
    }

    public function test_banned_locked_and_new_users_cannot_edit(): void
    {
        $this->author->forceFill(['is_banned' => true])->save();
        $this->putJson($this->url(), $this->editBody())->assertJsonPath('code', ResponseCode::USER_BANNED);
        $this->author->forceFill(['is_banned' => false, 'locked_until' => now()->addHour()])->save();
        $this->putJson($this->url(), $this->editBody())->assertJsonPath('code', ResponseCode::USER_LOCKED);
        $this->author->forceFill(['locked_until' => null])->save();
        \Illuminate\Support\Facades\Redis::setex('new_user_'.$this->author->binggan, 60, 1);
        $this->putJson($this->url(), $this->editBody())->assertJsonPath('code', ResponseCode::USER_CANNOT);
        $this->assertDatabaseCount('thread_first_post_revisions', 0);
    }

    public function test_thread_response_permissions_use_authenticated_identity(): void
    {
        $this->getJson('/api/threads/10001')->assertJsonPath('data.thread_data.can_edit_first_post', true)
            ->assertJsonPath('data.thread_data.can_view_first_post_history', true);
        Sanctum::actingAs(User::factory()->create(), ['normal']);
        $this->getJson('/api/threads/10001?binggan='.$this->author->binggan)
            ->assertJsonPath('data.thread_data.can_edit_first_post', false)
            ->assertJsonPath('data.thread_data.can_view_first_post_history', true);
        $this->post->forceFill(['is_deleted' => 1])->saveQuietly();
        $this->getJson('/api/threads/10001')->assertJsonPath('data.thread_data.can_view_first_post_history', false);
    }

    public function test_missing_first_post_is_not_replaced_by_a_reply(): void
    {
        $this->post->forceFill(['floor' => 1])->saveQuietly();
        $this->getJson($this->url('/edit'))->assertJsonPath('code', ResponseCode::POST_NOT_FOUND);
        $this->getJson($this->url('/history'))->assertJsonPath('code', ResponseCode::POST_NOT_FOUND);
        $this->putJson($this->url(), $this->editBody())->assertJsonPath('code', ResponseCode::POST_NOT_FOUND);
        $this->assertSame('A', $this->post->fresh()->content);
    }

    public function test_thread_includes_edit_count_only_for_the_first_post(): void
    {
        $reply = new Post;
        $reply->setSuffix(1);
        $reply->forceFill([
            'thread_id' => $this->thread->id, 'forum_id' => $this->forum->id, 'floor' => 1,
            'nickname' => '回复者', 'content' => '回复', 'created_binggan' => $this->author->binggan,
        ])->saveQuietly();
        $this->getJson('/api/threads/10001')->assertJsonPath('data.posts_data.data.0.edit_count', 0)
            ->assertJsonMissingPath('data.posts_data.data.1.edit_count');
        $this->putJson($this->url(), $this->editBody())->assertJsonPath('code', 200);
        $this->putJson($this->url(), $this->editBody('C'))->assertJsonPath('code', 200);
        $this->getJson('/api/threads/10001')->assertJsonPath('data.posts_data.data.0.edit_count', 2)
            ->assertJsonMissingPath('data.posts_data.data.1.edit_count');
    }

    public function test_physical_cleanup_removes_only_history_of_selected_threads(): void
    {
        $this->putJson($this->url(), $this->editBody())->assertJsonPath('code', 200);
        $this->thread->forceFill(['has_nissined' => true])->save();
        $excluded = new Forum;
        $excluded->forceFill(['id' => 419, 'name' => '咒岛', 'description' => 'excluded'])->save();
        foreach ([10002 => 419, 10003 => $this->forum->id] as $threadId => $forumId) {
            $thread = new Thread;
            $thread->forceFill(['id' => $threadId, 'forum_id' => $forumId, 'title' => '保留',
                'has_nissined' => $threadId === 10002])->save();
            ThreadFirstPostRevision::create(['thread_id' => $threadId, 'post_id' => 1,
                'version' => 0, 'content' => '保留', 'version_at' => now()]);
        }
        // Suppress physical table rebuilds and TRUNCATE, which implicitly commit a MySQL test transaction.
        $manager = DB::getFacadeRoot();
        $proxy = \Mockery::mock($manager)->makePartial();
        $proxy->shouldReceive('statement')->andReturn(true);
        $failedJobs = \Mockery::mock(\Illuminate\Database\Query\Builder::class);
        $failedJobs->shouldReceive('truncate')->once();
        $proxy->shouldReceive('table')->with('failed_jobs')->andReturn($failedJobs);
        DB::swap($proxy);
        try {
            $this->artisan('EraseNissinedDatabase:run', ['--force' => true])->assertExitCode(0);
        } finally {
            DB::swap($manager);
        }
        $this->assertDatabaseMissing('thread_first_post_revisions', ['thread_id' => 10001]);
        $this->assertDatabaseMissing('posts_1', ['thread_id' => 10001]);
        $this->assertDatabaseHas('thread_first_post_revisions', ['thread_id' => 10002]);
        $this->assertDatabaseHas('thread_first_post_revisions', ['thread_id' => 10003]);
    }

    /** @dataProvider concurrentEditProvider */
    public function test_concurrent_edits_serialize_without_duplicate_charges_or_negative_balance(
        int $balance, bool $sameRequest, int $expectedVersions, int $expectedSuccesses,
    ): void {
        if (! function_exists('pcntl_fork')) {
            $this->markTestSkipped('pcntl is required for the concurrency check');
        }
        $this->author->forceFill(['coin' => $balance])->save();
        $payload = $this->editBody();
        $authorId = $this->author->id;
        DB::commit();
        DB::disconnect();
        \Illuminate\Support\Facades\Redis::connection()->disconnect();
        $children = [];
        $files = [];
        $startAt = microtime(true) + 0.2;
        try {
            foreach ([0, 1] as $index) {
                $file = tempnam(sys_get_temp_dir(), 'thread-edit-concurrency-');
                $files[] = $file;
                $pid = pcntl_fork();
                if ($pid === 0) {
                    while (microtime(true) < $startAt) {
                        usleep(1000);
                    }
                    DB::reconnect();
                    try {
                        $input = $sameRequest ? $payload : $this->editBody('正文'.$index);
                        $request = \Illuminate\Http\Request::create($this->url(), 'PUT', $input);
                        $request->setUserResolver(fn () => User::findOrFail($authorId));
                        $response = app(\App\Http\Controllers\API\ThreadFirstPostController::class)->update($request, 10001);
                        file_put_contents($file, json_encode($response->getData(true)));
                        exit(0);
                    } catch (\App\Exceptions\CoinException) {
                        file_put_contents($file, json_encode(['code' => ResponseCode::COIN_NOT_ENOUGH]));
                        exit(0);
                    } catch (\Throwable $exception) {
                        file_put_contents($file, $exception::class.': '.$exception->getMessage());
                        exit(1);
                    }
                }
                $this->assertGreaterThan(0, $pid);
                $children[] = $pid;
            }
            $exitCodes = [];
            foreach ($children as $pid) {
                pcntl_waitpid($pid, $status);
                $exitCodes[] = pcntl_wexitstatus($status);
            }
            foreach ($exitCodes as $index => $code) {
                $this->assertSame(0, $code, file_get_contents($files[$index]));
            }
            DB::reconnect();
            $results = array_map(fn ($file) => json_decode(file_get_contents($file), true), $files);
            $this->assertCount($expectedSuccesses, array_filter($results, fn ($result) => $result['code'] === 200));
            $this->assertSame($balance - $expectedVersions * 300, $this->author->fresh()->coin);
            $this->assertDatabaseCount('thread_first_post_revisions', $expectedVersions + 1);
            $this->assertSame(ThreadFirstPostRevision::orderByDesc('version')->first()->content, $this->post->fresh()->content);
        } finally {
            DB::reconnect();
            foreach ($files as $file) {
                unlink($file);
            }
            ThreadFirstPostRevision::query()->delete();
            DB::table('posts_1')->where('thread_id', 10001)->delete();
            Thread::whereKey(10001)->delete();
            \App\Models\UserMedal::where('user_id', $authorId)->delete();
            User::whereKey($authorId)->delete();
            $this->forum->forceDelete();
            DB::beginTransaction();
        }
    }

    public static function concurrentEditProvider(): array
    {
        return [
            'two confirmed edits' => [600, false, 2, 2],
            'one affordable edit' => [300, false, 1, 1],
            'same operation retried' => [300, true, 1, 2],
        ];
    }
}
