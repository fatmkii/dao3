<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Models\MyEmoji;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserEmojiCacheTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private MyEmoji $myEmoji;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'binggan' => 'emoji_cache_user',
        ]);
        $this->actingAs($this->user, 'sanctum');

        $this->myEmoji = new MyEmoji();
        $this->myEmoji->user_id = $this->user->id;
        $this->myEmoji->emojis = ['https://example.com/one.png'];
        $this->myEmoji->emoji_excluded = [2];
        $this->myEmoji->save();
    }

    public function test_user_data_response_omits_my_emoji_and_contains_version(): void
    {
        $response = $this->postJson('/api/user/show', [
            'binggan' => $this->user->binggan,
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('code', ResponseCode::SUCCESS)
            ->assertJsonPath('data.my_emoji_version', $this->myEmoji->version)
            ->assertJsonMissingPath('data.my_emoji');
    }

    public function test_my_emoji_endpoint_returns_the_current_version_and_data(): void
    {
        $response = $this->getJson('/api/user/my_emoji');

        $response
            ->assertOk()
            ->assertJsonPath('code', ResponseCode::SUCCESS)
            ->assertJsonPath('data.my_emoji_version', $this->myEmoji->version)
            ->assertJsonPath('data.my_emoji', ['https://example.com/one.png']);
    }

    public function test_my_emoji_version_changes_only_when_emojis_change(): void
    {
        $initialVersion = $this->myEmoji->version;

        $this->myEmoji->emoji_excluded = [3];
        $this->myEmoji->save();
        $this->assertSame($initialVersion, $this->myEmoji->version);

        $this->myEmoji->emojis = ['https://example.com/two.png'];
        $this->myEmoji->save();
        $this->assertNotSame($initialVersion, $this->myEmoji->version);
    }
}
