<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class CompensateMyEmojiStorageCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_adds_5000_to_my_emoji_for_every_user_lv_record(): void
    {
        DB::table('users_lv')->insert([
            [
                'user_id' => 1,
                'my_emoji' => 10000,
                'title_pingbici' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 2,
                'my_emoji' => 30000,
                'title_pingbici' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $this->artisan('user-lv:compensate-my-emoji')
            ->expectsOutput('补偿完成：已为 2 条 users_lv 记录的 my_emoji 增加 5000。')
            ->assertSuccessful();

        $this->assertDatabaseHas('users_lv', [
            'user_id' => 1,
            'my_emoji' => 15000,
            'title_pingbici' => 2,
        ]);
        $this->assertDatabaseHas('users_lv', [
            'user_id' => 2,
            'my_emoji' => 35000,
            'title_pingbici' => 3,
        ]);
    }
}
