<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Models\EmojiContest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EmojiContestRankingTest extends TestCase
{
    use RefreshDatabase;

    public function test_ranking_requires_authentication(): void
    {
        $this->getJson('/api/emoji_contest/ranking')->assertUnauthorized();
    }

    public function test_banned_users_cannot_read_ranking(): void
    {
        Sanctum::actingAs(User::factory()->create(['is_banned' => true]));
        $this->getJson('/api/emoji_contest/ranking')->assertJsonPath('code', ResponseCode::USER_BANNED);
    }

    public function test_ranking_sums_images_sorts_ties_and_excludes_nonparticipants(): void
    {
        Sanctum::actingAs(User::factory()->create());
        foreach ([[1, 0, 40], [1, 1, 60], [2, 0, 100], [3, 0, 150], [4, 0, 0], [99, 0, 1000]] as [$group, $emoji, $votes]) {
            EmojiContest::create(['emoji_group_id' => $group, 'emoji_id' => $emoji, 'votes_num_total' => $votes]);
        }

        $response = $this->getJson('/api/emoji_contest/ranking')
            ->assertOk()->assertJsonPath('code', ResponseCode::SUCCESS)->assertJsonCount(9, 'data');
        $rows = $response->json('data');
        $this->assertSame([3, 1, 2, 4, 5, 6, 7, 8, 9], array_column($rows, 'emoji_group_id'));
        $this->assertSame([150, 100, 100, 0, 0, 0, 0, 0, 0], array_column($rows, 'votes_num_total'));
        $this->assertSame(['emoji_group_id', 'votes_num_total'], array_keys($rows[0]));

        EmojiContest::where('emoji_group_id', 2)->increment('votes_num_total', 100);
        $this->getJson('/api/emoji_contest/ranking')
            ->assertJsonPath('data.0.emoji_group_id', 2)->assertJsonPath('data.0.votes_num_total', 200);
    }

    public function test_empty_contest_has_all_groups_with_zero_votes_before_and_after_event(): void
    {
        Sanctum::actingAs(User::factory()->create());
        foreach (['2026-11-10', '2026-11-15'] as $date) {
            $this->travelTo(new \DateTimeImmutable($date));
            $rows = $this->getJson('/api/emoji_contest/ranking')->assertOk()->json('data');
            $this->assertSame(range(1, 9), array_column($rows, 'emoji_group_id'));
            $this->assertSame(array_fill(0, 9, 0), array_column($rows, 'votes_num_total'));
        }
        $this->travelBack();
    }
}
