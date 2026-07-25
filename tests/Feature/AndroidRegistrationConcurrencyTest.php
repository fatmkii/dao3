<?php

namespace Tests\Feature;

use App\Exceptions\RegistrationException;
use App\Jobs\ProcessUserCreatedLocation;
use App\Models\AndroidRegistrationDevice;
use App\Models\User;
use App\Services\AndroidRegistrationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Tests\TestCase;
use Throwable;

class AndroidRegistrationConcurrencyTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        DB::reconnect();
        if (DB::transactionLevel() > 0) {
            DB::rollBack();
        }
        User::query()->delete();
        AndroidRegistrationDevice::query()->delete();
        DB::table('global_setting')->where('key', 'new_binggan_force')->delete();
        Redis::del('reg_record_10.20.0.1', 'reg_record_10.20.0.2');
        DB::beginTransaction();

        parent::tearDown();
    }

    /**
     * @dataProvider concurrentClaimProvider
     */
    public function test_concurrent_claims_cannot_both_succeed(
        int $initialClaimCount,
        array $ips,
        int $expectedClaimCount,
        bool $expectedBanned,
    ): void {
        if (! function_exists('pcntl_fork')) {
            $this->markTestSkipped('pcntl is required for the concurrency check');
        }

        $hmacKey = 'test-android-registration-key-32-bytes-minimum';
        $digest = str_repeat('c', 64);
        config(['mobile.registration_hmac_key' => $hmacKey]);
        DB::table('global_setting')->updateOrInsert(
            ['key' => 'new_binggan_force'],
            ['value' => json_encode(true)],
        );
        DB::table('global_setting')->where('key', 'new_binggan')->update(['value' => json_encode(true)]);
        AndroidRegistrationDevice::create([
            'device_key' => hash_hmac('sha256', $digest, $hmacKey),
            'claim_count' => $initialClaimCount,
        ]);
        Redis::del('reg_record_10.20.0.1', 'reg_record_10.20.0.2');
        Bus::fake([ProcessUserCreatedLocation::class]);

        DB::commit();
        DB::disconnect();
        Redis::connection()->disconnect();
        $startAt = microtime(true) + 0.5;
        $children = [];
        $errorFiles = [];
        foreach ($ips as $index => $ip) {
            $errorFile = tempnam(sys_get_temp_dir(), 'android-registration-concurrency-');
            $this->assertNotFalse($errorFile);
            $pid = pcntl_fork();
            if ($pid === 0) {
                while (microtime(true) < $startAt) {
                    usleep(1000);
                }
                DB::reconnect();

                try {
                    app(AndroidRegistrationService::class)->register(
                        $digest,
                        $ip,
                        'concurrent-install-'.$index,
                        'Concurrent Test',
                        '0.1.0',
                    );
                    exit(0);
                } catch (RegistrationException) {
                    exit(2);
                } catch (Throwable $exception) {
                    file_put_contents($errorFile, $exception::class.': '.$exception->getMessage());
                    exit(3);
                }
            }
            $this->assertGreaterThan(0, $pid);
            $children[] = $pid;
            $errorFiles[] = $errorFile;
        }

        $exitCodes = [];
        foreach ($children as $pid) {
            pcntl_waitpid($pid, $status);
            $exitCodes[] = pcntl_wexitstatus($status);
        }
        sort($exitCodes);
        DB::reconnect();

        $errors = array_filter(array_map(fn ($file) => file_get_contents($file), $errorFiles));
        array_map('unlink', $errorFiles);
        $this->assertSame([0, 2], $exitCodes, implode("\n", $errors));
        $device = AndroidRegistrationDevice::firstOrFail();
        $this->assertSame($expectedClaimCount, $device->claim_count);
        $this->assertSame($expectedBanned, $device->is_banned);
        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseCount('mobile_sessions', 1);

    }

    public static function concurrentClaimProvider(): array
    {
        return [
            'device fifth-claim limit' => [4, ['10.20.0.1', '10.20.0.2'], 5, true],
            'same IP cooldown' => [0, ['10.20.0.1', '10.20.0.1'], 1, false],
        ];
    }
}
