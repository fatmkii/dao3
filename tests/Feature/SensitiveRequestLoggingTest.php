<?php

namespace Tests\Feature;

use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use RuntimeException;
use Tests\TestCase;

class SensitiveRequestLoggingTest extends TestCase
{
    public function test_database_errors_redact_mobile_credentials_and_device_digest(): void
    {
        Route::post('/test/query-error', function () {
            throw new QueryException(
                'testing',
                'select * from missing_table',
                [],
                new RuntimeException('database failed'),
            );
        });
        Log::spy();

        $this->postJson('/test/query-error', [
            'registration_device_digest' => str_repeat('a', 64),
            'installation_id' => 'installation-secret',
            'refresh_token' => 'session.secret',
            'password' => 'password-secret',
            'device_name' => 'Pixel Test',
        ]);

        Log::shouldHaveReceived('error')->withArgs(function ($exception, array $context): bool {
            return $exception instanceof QueryException
                && $context['request_data'] === [
                    'registration_device_digest' => '[REDACTED]',
                    'installation_id' => '[REDACTED]',
                    'refresh_token' => '[REDACTED]',
                    'password' => '[REDACTED]',
                    'device_name' => 'Pixel Test',
                ];
        });
    }
}
