<?php

namespace Tests\Feature;

use App\Http\Middleware\ThrottlePost;
use App\Models\Forum;
use App\Models\MobileSession;
use App\Models\Post;
use App\Models\PostRecording;
use App\Models\Thread;
use App\Models\User;
use App\Services\PostRecordingService;
use App\Services\RecordingStorage;
use Aws\Command;
use Aws\S3\Exception\S3Exception;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;
use Tests\Concerns\InteractsWithAntiSpamRedis;
use Tests\TestCase;

class PostRecordingTest extends TestCase
{
    use InteractsWithAntiSpamRedis, RefreshDatabase;

    private User $user;

    private Thread $thread;

    private RecordingStorage $storage;

    protected function setUp(): void
    {
        parent::setUp();
        $this->isolateAntiSpamRedis();
        Bus::fake();
        $this->withoutMiddleware(ThrottlePost::class);
        config(['recordings.enabled' => true, 'recordings.r2.url' => 'https://audio.example',
            'recordings.r2.key' => 'key', 'recordings.r2.secret' => 'secret',
            'recordings.r2.bucket' => 'bucket', 'recordings.r2.endpoint' => 'https://r2.example']);
        $this->user = User::factory()->create(['binggan' => 'recording_cookie', 'coin' => 100]);
        $forum = Forum::create(['name' => '录音测试', 'description' => '', 'status' => 1, 'accessible_coin' => 0]);
        $this->thread = new Thread;
        $this->thread->forceFill(['id' => 10001, 'forum_id' => $forum->id, 'title' => '录音',
            'sub_title' => '', 'created_binggan' => $this->user->binggan, 'locked_by_coin' => 0,
            'is_delay' => 0, 'is_deleted' => 0, 'is_private' => false])->save();
        $this->androidToken();
        $this->storage = $this->mock(RecordingStorage::class);
        $this->storage->shouldReceive('presign')->andReturn(['url' => 'https://r2.example/signed', 'headers' => []]);
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();
        \Carbon\Carbon::setTestNow();
        parent::tearDown();
    }

    private function androidToken(): MobileSession
    {
        $session = MobileSession::create(['user_id' => $this->user->id, 'installation_id_hash' => hash('sha256', uniqid()),
            'refresh_token_hash' => hash('sha256', uniqid()), 'device_name' => 'test', 'app_version' => 'test', 'last_used_at' => now(), 'idle_expires_at' => now()->addDays(30)]);
        $token = $this->user->createToken('android', ['*'], now()->addHour())->accessToken;
        $token->forceFill(['mobile_session_id' => $session->id, 'client_type' => 'android'])->save();
        $this->user->withAccessToken($token);
        $this->actingAs($this->user, 'sanctum');

        return $session;
    }

    private function payload(array $overrides = []): array
    {
        return array_replace(['thread_id' => $this->thread->id, 'size_bytes' => 12000,
            'duration_ms' => 1000, 'content_md5' => base64_encode(md5('audio', true))], $overrides);
    }

    private function recording(array $overrides = []): PostRecording
    {
        return PostRecording::create(array_replace($this->payload(), ['user_id' => $this->user->id,
            'object_key' => 'recordings/'.uniqid().'.m4a', 'status' => 'ready',
            'uploaded_at' => now(), 'expires_at' => now()->addDays(14)], $overrides));
    }

    public function test_migration_adds_indexed_attachment_to_existing_shards(): void
    {
        foreach (Schema::getTableListing() as $table) {
            if (preg_match('/^posts_\d+$/', $table)) {
                $this->assertTrue(Schema::hasColumn($table, 'recording_id'));
                $this->assertTrue(Schema::hasIndex($table, ['recording_id']));
            }
        }
    }

    public function test_config_is_android_only_and_uses_configured_duration_and_size(): void
    {
        config(['recordings.max_duration_ms' => 30000]);
        $this->getJson('/api/mobile/recordings/config')->assertOk()->assertJsonPath('data.max_size_bytes', 545536);
        $token = $this->user->createToken('web')->accessToken;
        $this->user->withAccessToken($token);
        $this->getJson('/api/mobile/recordings/config')->assertForbidden();
    }

    public function test_revoked_session_is_rejected(): void
    {
        $session = $this->androidToken();
        $session->update(['revoked_at' => now()]);
        $this->postJson('/api/mobile/recordings/uploads', $this->payload())->assertForbidden();
    }

    public function test_upload_validates_fields_and_thread_access(): void
    {
        foreach ([['duration_ms' => 15001], ['duration_ms' => 0], ['size_bytes' => 305537],
            ['content_md5' => 'invalid'], ['thread_id' => 99999]] as $invalid) {
            $this->postJson('/api/mobile/recordings/uploads', $this->payload($invalid))->assertUnprocessable();
        }
        $this->thread->forceFill(['is_private' => true, 'created_binggan' => 'other'])->save();
        $this->postJson('/api/mobile/recordings/uploads', $this->payload())->assertUnprocessable();
        $this->assertDatabaseCount('post_recordings', 0);
    }

    public function test_banned_and_locked_accounts_cannot_upload(): void
    {
        $this->user->forceFill(['is_banned' => true])->save();
        $this->postJson('/api/mobile/recordings/uploads', $this->payload())->assertJsonPath('code', \App\Common\ResponseCode::USER_BANNED);
        $this->user->forceFill(['is_banned' => false, 'locked_until' => now()->addHour()])->save();
        $this->postJson('/api/mobile/recordings/uploads', $this->payload())->assertJsonPath('code', \App\Common\ResponseCode::USER_LOCKED);
        $this->assertDatabaseCount('post_recordings', 0);
    }

    public function test_upload_minute_limit_is_shared_by_sessions_for_one_account(): void
    {
        config(['recordings.uploads_per_minute' => 2]);
        $this->postJson('/api/mobile/recordings/uploads', $this->payload())->assertJsonPath('code', 200);
        $this->androidToken();
        $this->postJson('/api/mobile/recordings/uploads', $this->payload())->assertJsonPath('code', 200);
        $this->postJson('/api/mobile/recordings/uploads', $this->payload())->assertStatus(429);
        $this->assertDatabaseCount('post_recordings', 2);
    }

    public function test_daily_limit_remains_after_minute_window(): void
    {
        config(['recordings.uploads_per_day' => 1]);
        $this->postJson('/api/mobile/recordings/uploads', $this->payload())->assertJsonPath('code', 200);
        $this->travel(61)->seconds();
        $this->postJson('/api/mobile/recordings/uploads', $this->payload())->assertStatus(429);
    }

    public function test_complete_uses_head_upload_time_and_is_idempotent_without_reading_audio(): void
    {
        $recording = $this->recording(['status' => 'pending', 'uploaded_at' => null, 'expires_at' => null]);
        $uploadedAt = now()->subMinutes(4)->startOfSecond()->toImmutable();
        $this->storage->shouldReceive('head')->once()->andReturn([
            'ContentLength' => 12000, 'ContentType' => 'audio/mp4',
            'ETag' => '"'.md5('audio').'"', 'LastModified' => $uploadedAt,
        ]);
        $response = $this->postJson("/api/mobile/recordings/{$recording->id}/complete")->assertJsonPath('code', 200);
        $this->travel(2)->days();
        $this->androidToken();
        $again = $this->postJson("/api/mobile/recordings/{$recording->id}/complete")->assertJsonPath('code', 200);
        $this->assertSame($response->json('data.expires_at'), $again->json('data.expires_at'));
        $this->assertTrue($recording->fresh()->expires_at->equalTo($uploadedAt->addDays(14)));
    }

    public function test_complete_preserves_utc_upload_instant_in_non_utc_application_timezone(): void
    {
        $originalTimezone = date_default_timezone_get();
        config(['app.timezone' => 'Asia/Shanghai']);
        date_default_timezone_set('Asia/Shanghai');
        try {
            $recording = $this->recording(['status' => 'pending', 'uploaded_at' => null, 'expires_at' => null]);
            $uploadedAt = CarbonImmutable::now('UTC')->subMinutes(4)->startOfSecond();
            $this->storage->shouldReceive('head')->once()->andReturn([
                'ContentLength' => 12000, 'ContentType' => 'audio/mp4',
                'ETag' => '"'.md5('audio').'"', 'LastModified' => new \DateTimeImmutable($uploadedAt->toISOString()),
            ]);
            $response = $this->postJson("/api/mobile/recordings/{$recording->id}/complete")->assertJsonPath('code', 200);
            $this->assertTrue($recording->fresh()->uploaded_at->equalTo($uploadedAt));
            $this->assertTrue($recording->fresh()->expires_at->equalTo($uploadedAt->addDays(14)));
            $this->assertSame($uploadedAt->addDays(14)->toISOString(), $response->json('data.expires_at'));
            $again = $this->postJson("/api/mobile/recordings/{$recording->id}/complete")->assertJsonPath('code', 200);
            $this->assertSame($response->json('data.expires_at'), $again->json('data.expires_at'));
        } finally {
            date_default_timezone_set($originalTimezone);
        }
    }

    public function test_complete_rejects_missing_or_mismatched_object(): void
    {
        $recording = $this->recording(['status' => 'pending']);
        $this->storage->shouldReceive('head')->once()->andThrow(new S3Exception('missing', new Command('HeadObject'), ['response' => new \GuzzleHttp\Psr7\Response(404)]));
        $this->postJson("/api/mobile/recordings/{$recording->id}/complete")->assertUnprocessable();
        $this->storage->shouldReceive('head')->once()->andReturn(['ContentLength' => 10, 'ContentType' => 'audio/mp4']);
        $this->postJson("/api/mobile/recordings/{$recording->id}/complete")->assertUnprocessable();
        $this->assertSame('pending', $recording->fresh()->status);
    }

    public function test_completion_rejects_wrong_content_type_and_checksum(): void
    {
        foreach ([['ContentType' => 'text/plain'], ['ETag' => 'wrong-md5']] as $invalid) {
            $recording = $this->recording(['status' => 'pending']);
            $this->storage->shouldReceive('head')->once()->andReturn(array_replace([
                'ContentLength' => 12000, 'ContentType' => 'audio/mp4', 'ETag' => md5('audio'),
                'LastModified' => now(),
            ], $invalid));
            $this->postJson("/api/mobile/recordings/{$recording->id}/complete")->assertUnprocessable();
            $this->assertSame('pending', $recording->fresh()->status);
        }
    }

    public function test_web_attachment_publish_and_empty_reply_are_rejected(): void
    {
        $recording = $this->recording();
        $params = ['binggan' => $this->user->binggan, 'forum_id' => $this->thread->forum_id,
            'thread_id' => 10001, 'recording_id' => $recording->id, 'content' => '正文', 'nickname' => '= ='];
        $this->postJson('/api/posts/create', array_replace($params, ['content' => '']))->assertUnprocessable();
        $this->user->withAccessToken($this->user->createToken('web')->accessToken);
        $this->postJson('/api/posts/create', $params)->assertForbidden();
        $this->assertNull($recording->fresh()->post_id);
        $this->assertSame(0, Post::suffix(1)->count());
    }

    public function test_attachment_checks_owner_thread_status_expiry_and_existing_binding(): void
    {
        foreach ([['user_id' => $this->user->id + 1], ['thread_id' => 20001], ['status' => 'pending'],
            ['expires_at' => now()], ['post_id' => 123]] as $invalid) {
            $recording = $this->recording($invalid);
            $request = Request::create('/', 'POST', ['thread_id' => 10001, 'recording_id' => $recording->id]);
            $request->setUserResolver(fn () => $this->user);
            try {
                DB::transaction(fn () => app(PostRecordingService::class)->lockAttachment($request));
                $this->fail('Invalid attachment accepted');
            } catch (ValidationException $e) {
                $this->assertArrayHasKey('recording_id', $e->errors());
            }
        }
    }

    public function test_binding_and_reply_roll_back_together_and_cannot_be_reused(): void
    {
        $recording = $this->recording();
        $request = Request::create('/', 'POST', ['thread_id' => 10001, 'recording_id' => $recording->id]);
        $request->setUserResolver(fn () => $this->user);
        try {
            DB::transaction(function () use ($request) {
                $attachment = app(PostRecordingService::class)->lockAttachment($request);
                $post = Post::create(['thread_id' => 10001, 'forum_id' => $this->thread->forum_id,
                    'recording_id' => $attachment->id, 'content' => '正文']);
                $attachment->update(['post_id' => $post->id]);
                throw new \RuntimeException('rollback');
            });
        } catch (\RuntimeException $e) {
            $this->assertSame('rollback', $e->getMessage());
        }
        $this->assertNull($recording->fresh()->post_id);
        $this->assertSame(0, Post::suffix(1)->count());
        $params = ['binggan' => $this->user->binggan, 'forum_id' => $this->thread->forum_id,
            'thread_id' => 10001, 'recording_id' => $recording->id, 'content' => '正文', 'nickname' => '= ='];
        $this->postJson('/api/posts/create', $params)->assertJsonPath('code', 200);
        $post = Post::suffix(1)->firstOrFail();
        $this->assertSame($post->id, $recording->fresh()->post_id);
        $this->postJson('/api/posts/create', $params)->assertUnprocessable();
        $this->assertSame(1, Post::suffix(1)->count());
    }

    public function test_attachment_lock_prevents_a_second_connection_from_binding_it(): void
    {
        $recording = $this->recording();
        $request = Request::create('/', 'POST', ['thread_id' => 10001, 'recording_id' => $recording->id]);
        $request->setUserResolver(fn () => $this->user);
        config(['database.connections.recording_concurrent' => config('database.connections.mysql')]);
        try {
            DB::transaction(function () use ($request, $recording) {
                app(PostRecordingService::class)->lockAttachment($request);
                try {
                    DB::connection('recording_concurrent')->select('SELECT id FROM post_recordings WHERE id = ? FOR UPDATE NOWAIT', [$recording->id]);
                    $this->fail('Second connection acquired attachment lock');
                } catch (\Illuminate\Database\QueryException $e) {
                    $this->assertSame(3572, $e->errorInfo[1]);
                }
            });
        } finally {
            DB::purge('recording_concurrent');
        }
    }

    public function test_deleted_restored_and_fourteen_day_boundary(): void
    {
        $recording = $this->recording();
        $post = Post::create(['thread_id' => 10001, 'forum_id' => $this->thread->forum_id,
            'recording_id' => $recording->id, 'content' => '正文']);
        $post->load('recording');
        $this->assertFalse($post->recording_data['expired']);
        $post->is_deleted = 1;
        $this->assertNull($post->recording_data);
        $this->assertSame($recording->id, $post->recording_id);
        $post->is_deleted = 0;
        $this->assertFalse($post->recording_data['expired']);
        $this->travelTo($recording->expires_at->subSecond());
        $this->assertFalse($post->recording_data['expired']);
        $this->travelTo($recording->expires_at);
        $this->assertTrue($post->recording_data['expired']);
        $this->assertNull($post->recording_data['url']);
    }

    public function test_batch_playback_serialization_does_not_query_each_attachment(): void
    {
        $recording = $this->recording();
        for ($i = 0; $i < 3; $i++) {
            Post::create(['thread_id' => 10001, 'forum_id' => $this->thread->forum_id,
                'recording_id' => $recording->id, 'content' => '正文']);
        }
        DB::enableQueryLog();
        $posts = Post::suffix(1)->with('recording')->get();
        DB::flushQueryLog();
        foreach ($posts as $post) {
            $this->assertSame($recording->id, $post->recording_data['id']);
        }
        $this->assertCount(0, DB::getQueryLog());
        DB::disableQueryLog();
    }
}
