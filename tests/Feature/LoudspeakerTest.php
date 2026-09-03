<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Models\Loudspeaker;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class LoudspeakerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create(['binggan' => 'loudspeaker_owner']);
        Sanctum::actingAs($this->user);
    }

    public function test_range_mode_includes_both_selected_calendar_days(): void
    {
        $this->createLoudspeaker('2026-09-02 23:59:59');
        $rangeStart = $this->createLoudspeaker('2026-09-03 00:00:00');
        $rangeEnd = $this->createLoudspeaker('2026-09-09 23:59:59');
        $this->createLoudspeaker('2026-09-10 00:00:00');

        $response = $this->getJson('/api/loudspeaker/show?'.http_build_query([
            'binggan' => $this->user->binggan,
            'mode' => 'range',
            'date_start' => '2026-09-03',
            'date_end' => '2026-09-09',
        ]));

        $response->assertOk()
            ->assertJson(['code' => ResponseCode::SUCCESS])
            ->assertJsonCount(2, 'data');

        $this->assertSame(
            [$rangeStart->id, $rangeEnd->id],
            collect($response->json('data'))->pluck('id')->all(),
        );
        $response->assertJsonPath('data.0.is_your_loudspeaker', true);
    }

    public function test_range_mode_rejects_missing_reversed_and_long_ranges(): void
    {
        $this->getJson('/api/loudspeaker/show?'.http_build_query([
            'binggan' => $this->user->binggan,
            'mode' => 'range',
        ]))->assertUnprocessable()->assertJsonValidationErrors(['date_start', 'date_end']);

        $this->getJson('/api/loudspeaker/show?'.http_build_query([
            'binggan' => $this->user->binggan,
            'mode' => 'range',
            'date_start' => '2026-09-09',
            'date_end' => '2026-09-03',
        ]))->assertUnprocessable()->assertJsonValidationErrors('date_end');

        $this->getJson('/api/loudspeaker/show?'.http_build_query([
            'binggan' => $this->user->binggan,
            'mode' => 'range',
            'date_start' => '2026-09-03',
            'date_end' => '2026-09-10',
        ]))->assertUnprocessable()->assertJsonValidationErrors('date_end');
    }

    public function test_effective_mode_keeps_existing_behavior_without_date_parameters(): void
    {
        Carbon::setTestNow('2026-09-03 12:00:00');

        try {
            $effective = $this->createLoudspeaker('2026-09-03 11:59:59');
            $this->createLoudspeaker('2026-09-03 12:00:01');

            $response = $this->getJson('/api/loudspeaker/show?'.http_build_query([
                'binggan' => $this->user->binggan,
                'mode' => 'effective',
            ]));

            $response->assertOk()
                ->assertJson(['code' => ResponseCode::SUCCESS])
                ->assertJsonCount(1, 'data')
                ->assertJsonPath('data.0.id', $effective->id);
        } finally {
            Carbon::setTestNow();
        }
    }

    private function createLoudspeaker(string $effectiveDate): Loudspeaker
    {
        return Loudspeaker::create([
            'sub_id' => 0,
            'user_id' => $this->user->id,
            'created_binggan' => $this->user->binggan,
            'thread_id' => null,
            'content' => '测试大喇叭 '.$effectiveDate,
            'color' => null,
            'effective_date' => $effectiveDate,
            'expire_date' => Carbon::parse($effectiveDate)->addDay(),
            'days' => 1,
        ]);
    }
}
