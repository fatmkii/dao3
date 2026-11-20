<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Facades\GlobalSetting;
use App\Jobs\ProcessIncomeStatement;
use App\Models\Forum;
use App\Models\HongbaoPost;
use App\Models\Post;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Broadcasting\BroadcastEvent;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Laravel\Sanctum\Sanctum;
use Tests\Concerns\InteractsWithAntiSpamRedis;
use Tests\TestCase;

class HongbaoPostTest extends TestCase
{
    use InteractsWithAntiSpamRedis, RefreshDatabase;

    private User $sender;

    private Thread $thread;

    protected function setUp(): void
    {
        parent::setUp();
        $this->isolateAntiSpamRedis();
        Queue::fake();
        $this->sender = User::factory()->create(['coin' => 20000]);
        $forum = Forum::create(['name' => '红包测试', 'description' => '']);
        $this->thread = $this->makeThread($forum->id, $this->sender);
        Post::create([
            'thread_id' => $this->thread->id,
            'forum_id' => $forum->id,
            'created_binggan' => $this->sender->binggan,
            'floor' => 0,
            'content' => '正文',
        ]);
    }

    public function test_send_and_claim_last_share_with_hidden_keyword(): void
    {
        $packet = $this->sendPacket();
        $tax = GlobalSetting::get_tax('hongbao', null, 5);
        $this->assertEquals(20000 - ceil(3000 * $tax), $this->sender->fresh()->coin);
        $packet->update(['num_remains' => 1, 'olo_remains' => 600]);
        $reader = User::factory()->create();

        $this->claim($packet, $reader)->assertJsonPath('code', ResponseCode::SUCCESS);

        $this->assertEquals(710, $reader->fresh()->coin);
        $this->assertDatabaseHas('hongbao_post_users', [
            'hongbao_post_id' => $packet->id, 'user_id' => $reader->id, 'olo' => 600,
        ]);
        $this->assertDatabaseHas('hongbao_post', ['id' => $packet->id, 'num_remains' => 0, 'olo_remains' => 0]);
        $this->assertSoftDeleted($packet);
        $this->assertDatabaseHas('posts_1', [
            'created_binggan' => $reader->binggan, 'content' => '--红包口令: （暗号红包已隐藏口令）',
        ]);
        $this->assertDatabaseCount('posts_1', 4);
        Queue::assertPushed(ProcessIncomeStatement::class, 3);
        Queue::assertPushed(BroadcastEvent::class, 4);
    }

    public function test_wrong_keyword_creates_one_reply_and_ip_and_duplicate_checks_block_extra_writes(): void
    {
        $packet = $this->sendPacket();
        $reader = User::factory()->create();
        $this->claim($packet, $reader, 'wrong')->assertJsonPath('code', ResponseCode::HONGBAO_KEYWORD_WRONG);
        $this->assertEquals(110, $reader->fresh()->coin);
        $this->assertDatabaseCount('hongbao_post_users', 0);
        $this->assertDatabaseCount('posts_1', 3);

        $this->claim($packet, $reader)->assertJsonPath('code', ResponseCode::SUCCESS);
        $this->claim($packet, $reader)->assertJsonPath('code', ResponseCode::HONGBAO_HAS_BEEN_USED);
        $other = User::factory()->create();
        $this->claim($packet, $other)->assertJsonPath('code', ResponseCode::HONGBAO_TOO_MANY);
        $this->assertEquals(100, $other->fresh()->coin);
        $this->assertDatabaseCount('hongbao_post_users', 1);
        $this->assertDatabaseCount('posts_1', 5);
    }

    public function test_request_with_an_open_snapshot_rechecks_stock_before_writing(): void
    {
        $packet = $this->sendPacket();
        $reader = User::factory()->create();
        $closeOnLookup = true;
        DB::listen(function (QueryExecuted $query) use ($packet, &$closeOnLookup) {
            if ($closeOnLookup && str_starts_with($query->sql, 'select * from `hongbao_post`')) {
                $closeOnLookup = false;
                $packet->forceFill(['num_remains' => 0, 'olo_remains' => 0, 'deleted_at' => now()])->save();
            }
        });

        $this->claim($packet, $reader)->assertJsonPath('code', ResponseCode::HONGBAO_HAS_BEEN_CLOSED);

        $this->assertEquals(100, $reader->fresh()->coin);
        $this->assertDatabaseCount('hongbao_post_users', 0);
        $this->assertDatabaseCount('posts_1', 2);
        Queue::assertPushed(ProcessIncomeStatement::class, 1);
        Queue::assertPushed(BroadcastEvent::class, 2);
    }

    public function test_batch_reads_only_requested_thread_and_matches_single_post_visibility(): void
    {
        $packet = $this->sendPacket();
        $otherThread = $this->makeThread($this->thread->forum_id, $this->sender);
        $otherPost = Post::create([
            'thread_id' => $otherThread->id,
            'forum_id' => $otherThread->forum_id,
            'created_binggan' => $this->sender->binggan,
            'floor' => 0,
            'content' => '另一个主题的正文',
        ]);
        $reader = User::factory()->create();
        Sanctum::actingAs($reader);
        $params = ['thread_id' => $this->thread->id, 'binggan' => $reader->binggan];
        $single = $this->getJson('/api/posts/'.$packet->post_id.'?'.http_build_query($params))->json('data');
        $url = '/api/posts/batch?'.http_build_query($params + ['post_ids' => [$otherPost->id, $packet->post_id]]);
        $this->getJson($url)->assertJsonCount(1, 'data')->assertJsonPath('data.0', $single);
        $this->assertArrayNotHasKey('key_word', $single['hongbao_data']);
        $this->getJson('/api/posts/batch?'.http_build_query($params + ['post_ids' => range(1, 51)]))
            ->assertUnprocessable();

        $this->thread->forceFill(['is_private' => true])->save();
        $this->getJson($url)->assertJsonPath('code', ResponseCode::THREAD_IS_PRIVATE);
    }

    private function makeThread(int $forumId, User $owner): Thread
    {
        $thread = new Thread;
        $thread->forceFill([
            'forum_id' => $forumId, 'title' => '红包测试', 'created_binggan' => $owner->binggan,
        ])->save();

        return $thread;
    }

    private function sendPacket(): HongbaoPost
    {
        Sanctum::actingAs($this->sender);
        $this->postJson('/api/hongbao_post/create', [
            'binggan' => $this->sender->binggan, 'forum_id' => $this->thread->forum_id, 'thread_id' => $this->thread->id,
            'hongbao_olo' => 3000, 'hongbao_num' => 5, 'type' => 2, 'key_word_type' => 3,
            'hongbao_key_word' => 'test-keyword', 'hongbao_olo_hide' => false,
        ])->assertJsonPath('code', ResponseCode::SUCCESS);

        return HongbaoPost::firstOrFail();
    }

    private function claim(HongbaoPost $packet, User $reader, string $keyword = 'test-keyword')
    {
        Sanctum::actingAs($reader);

        return $this->postJson('/api/hongbao_post/store', [
            'binggan' => $reader->binggan, 'forum_id' => $this->thread->forum_id, 'thread_id' => $this->thread->id,
            'content' => '--红包口令: '.$keyword, 'hongbao_post_id' => $packet->id, 'hongbao_key_word' => $keyword,
        ]);
    }
}
