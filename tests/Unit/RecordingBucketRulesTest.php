<?php

namespace Tests\Unit;

use App\Services\RecordingStorage;
use Aws\MockHandler;
use Aws\Result;
use Aws\S3\S3Client;
use Tests\TestCase;

class RecordingBucketRulesTest extends TestCase
{
    public function test_bucket_rule_merge_preserves_apk_rules_and_only_expires_recordings_prefix(): void
    {
        $oldLifecycle = ['ID' => 'apk-distribution', 'Status' => 'Enabled', 'Filter' => ['Prefix' => 'downloads/'], 'Expiration' => ['Days' => 365]];
        $oldCors = ['ID' => 'existing', 'AllowedMethods' => ['GET'], 'AllowedOrigins' => ['https://existing.example']];
        $commands = [];
        $handler = new MockHandler([
            new Result(['Rules' => [$oldLifecycle]]), new Result(['CORSRules' => [$oldCors]]),
            new Result(), new Result(),
        ]);
        $client = new S3Client(['region' => 'auto', 'version' => 'latest', 'credentials' => ['key' => 'fake', 'secret' => 'fake'],
            'handler' => function ($command, $request) use (&$commands, $handler) {
                $commands[] = ['name' => $command->getName(), 'args' => $command->toArray()];

                return $handler($command, $request);
            }]);
        $storage = new class($client) extends RecordingStorage
        {
            public function __construct(private S3Client $s3)
            {
            }

            public function client(): S3Client
            {
                return $this->s3;
            }
        };
        $this->app->instance(RecordingStorage::class, $storage);
        config(['recordings.r2.bucket' => 'test']);
        $this->artisan('recordings:configure-storage', ['--apply' => true])->assertSuccessful();
        $lifecycle = $commands[2]['args']['LifecycleConfiguration']['Rules'];
        $this->assertSame($oldLifecycle, $lifecycle[0]);
        $this->assertSame(['Prefix' => 'recordings/'], $lifecycle[1]['Filter']);
        $this->assertSame(['Days' => 14], $lifecycle[1]['Expiration']);
        $cors = $commands[3]['args']['CORSConfiguration']['CORSRules'];
        $this->assertSame($oldCors, $cors[0]);
        $this->assertSame(['GET', 'HEAD'], $cors[1]['AllowedMethods']);
        $this->assertContains('Range', $cors[1]['AllowedHeaders']);
    }
}
