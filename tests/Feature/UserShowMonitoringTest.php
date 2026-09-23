<?php

namespace Tests\Feature;

use App\Common\ResponseCode;
use App\Http\Controllers\API\UserController;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Mockery;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Tests\TestCase;

class UserShowMonitoringTest extends TestCase
{
    use RefreshDatabase;

    private array $records = [];

    private bool $failLogging = false;

    protected function setUp(): void
    {
        parent::setUp();

        $logger = Mockery::mock(LoggerInterface::class);
        $logger->shouldReceive('log')->andReturnUsing(function ($level, $message, $context) {
            if ($this->failLogging) {
                throw new RuntimeException('disk full');
            }
            $this->records[] = compact('level', 'message', 'context');
        });
        Log::partialMock()->shouldReceive('channel')->with('user_show')->andReturn($logger);
        Log::shouldReceive('error')->andReturnNull();
    }

    public function test_success_logs_safe_metadata_and_returns_request_id(): void
    {
        $user = User::factory()->create(['binggan' => 'private-binggan']);
        $token = $user->createToken('android', ['normal']);
        $token->accessToken->forceFill(['client_type' => 'android'])->save();
        $id = (string) Str::uuid();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer '.$token->plainTextToken,
            'X-Request-ID' => $id,
            'User-Agent' => 'test CpttmmAndroid',
        ])->postJson('/api/user/show', ['binggan' => $user->binggan]);

        $response->assertOk()->assertJsonPath('code', ResponseCode::SUCCESS)->assertHeader('X-Request-ID', $id);
        $context = $this->context('success');
        $this->assertSame($id, $context['request_id']);
        $this->assertSame($user->id, $context['user_id']);
        $this->assertSame('android', $context['client_type']);
        $this->assertTrue($context['android_webview']);
        $this->assertTrue($context['binggan_matches']);
        $this->assertGreaterThanOrEqual(0, $context['duration_ms']);
        $this->assertStringNotContainsString($user->binggan, json_encode($this->records));
        $this->assertStringNotContainsString($token->plainTextToken, json_encode($this->records));
    }

    public function test_authentication_failure_is_logged_before_controller_runs(): void
    {
        $response = $this->withToken('invalid-secret')->postJson('/api/user/show', ['binggan' => 'secret']);

        $response->assertUnauthorized()->assertHeader('X-Request-ID');
        $context = $this->context('unauthenticated');
        $this->assertNull($context['user_id']);
        $this->assertTrue($context['has_bearer_token']);
        $this->assertStringNotContainsString('invalid-secret', json_encode($this->records));
    }

    public function test_mismatch_and_banned_responses_are_distinguished(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum')->postJson('/api/user/show', ['binggan' => 'wrong'])
            ->assertUnauthorized()->assertJsonPath('code', ResponseCode::CANNOTLOGIN);
        $this->assertFalse($this->context('binggan_mismatch')['binggan_matches']);

        $this->records = [];
        $user->is_banned = true;
        $user->save();
        $this->postJson('/api/user/show', ['binggan' => $user->binggan])
            ->assertUnauthorized()->assertJsonPath('code', ResponseCode::USER_BANNED);
        $this->context('user_banned');
    }

    public function test_validation_failure_and_untrusted_request_id(): void
    {
        $this->actingAs(User::factory()->create(), 'sanctum');
        $response = $this->withHeader('X-Request-ID', 'private-untrusted-value')->postJson('/api/user/show');

        $response->assertUnprocessable();
        $context = $this->context('validation_failed');
        $this->assertTrue(Str::isUuid($context['request_id']));
        $this->assertStringNotContainsString('private-untrusted-value', json_encode($this->records));
    }

    public function test_server_exception_is_logged_without_its_message(): void
    {
        $this->actingAs(User::factory()->create(), 'sanctum');
        $this->mock(UserController::class)->shouldReceive('show')->andThrow(new RuntimeException('private-error-secret'));

        $this->postJson('/api/user/show', ['binggan' => 'secret'])->assertStatus(500)->assertHeader('X-Request-ID');
        $this->assertSame(RuntimeException::class, $this->context('server_exception')['exception_class']);
        $this->assertStringNotContainsString('private-error-secret', json_encode($this->records));
    }

    public function test_database_error_with_http_200_is_not_logged_as_success(): void
    {
        $this->actingAs(User::factory()->create(), 'sanctum');
        $this->mock(UserController::class)->shouldReceive('show')->andThrow(
            new QueryException('mysql', 'select 1', [], new RuntimeException('simulated database error'))
        );

        $this->postJson('/api/user/show', ['binggan' => 'secret'])
            ->assertOk()->assertJsonPath('code', ResponseCode::DATABASE_FAILED);
        $context = $this->context('server_exception');
        $this->assertSame(200, $context['http_status']);
        $this->assertSame(QueryException::class, $context['exception_class']);
    }

    public function test_other_endpoints_are_not_monitored(): void
    {
        $this->getJson('/api/user/my_emoji')->assertUnauthorized()->assertHeaderMissing('X-Request-ID');
        $this->assertSame([], $this->records);
    }

    public function test_non_json_authentication_redirect_error_is_also_monitored(): void
    {
        $this->post('/api/user/show', ['binggan' => 'secret'])
            ->assertStatus(500)->assertHeader('X-Request-ID');
        $this->assertFalse($this->context('server_exception')['expects_json']);
    }

    public function test_logging_failure_does_not_change_the_response(): void
    {
        $this->failLogging = true;

        $this->postJson('/api/user/show')->assertUnauthorized()->assertHeader('X-Request-ID');
    }

    private function context(string $reason): array
    {
        $this->assertCount(1, $this->records);
        $this->assertSame('user_show_completed', $this->records[0]['message']);
        $this->assertSame($reason, $this->records[0]['context']['reason']);
        $this->assertSame($reason === 'success' ? 'info' : 'warning', $this->records[0]['level']);

        return $this->records[0]['context'];
    }
}
