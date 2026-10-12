<?php

namespace App\Console\Commands;

use App\Services\RecordingStorage;
use Aws\S3\Exception\S3Exception;
use Illuminate\Console\Command;

class ConfigureRecordingStorage extends Command
{
    protected $signature = 'recordings:configure-storage {--apply : Apply the previewed bucket rules}';

    protected $description = 'Preview or merge the recording lifecycle and playback CORS rules, preserving other bucket rules';

    public function handle(RecordingStorage $storage): int
    {
        $client = $storage->client();
        $bucket = config('recordings.r2.bucket');
        $lifecycle = $this->readRules(fn () => $client->getBucketLifecycleConfiguration(['Bucket' => $bucket]), 'NoSuchLifecycleConfiguration', 'Rules');
        $cors = $this->readRules(fn () => $client->getBucketCors(['Bucket' => $bucket]), 'NoSuchCORSConfiguration', 'CORSRules');
        $lifecycle = array_values(array_filter($lifecycle, fn ($rule) => ($rule['ID'] ?? '') !== 'post-recordings-14-days'));
        $lifecycle[] = [
            'ID' => 'post-recordings-14-days',
            'Status' => 'Enabled',
            'Filter' => ['Prefix' => 'recordings/'],
            'Expiration' => ['Days' => 14],
        ];
        $cors = array_values(array_filter($cors, fn ($rule) => ($rule['ID'] ?? '') !== 'post-recordings-playback'));
        $cors[] = [
            'ID' => 'post-recordings-playback',
            'AllowedMethods' => ['GET', 'HEAD'],
            'AllowedOrigins' => ['https://cpttmm.com', 'https://cpttmm.love', 'http://192.168.1.210', 'http://localhost'],
            'AllowedHeaders' => ['Range'],
            'ExposeHeaders' => ['Content-Length', 'Content-Range', 'Accept-Ranges', 'ETag'],
            'MaxAgeSeconds' => 3600,
        ];
        $this->line(json_encode(['lifecycle' => $lifecycle, 'cors' => $cors], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        if ($this->option('apply')) {
            $client->putBucketLifecycleConfiguration(['Bucket' => $bucket, 'LifecycleConfiguration' => ['Rules' => $lifecycle]]);
            $client->putBucketCors(['Bucket' => $bucket, 'CORSConfiguration' => ['CORSRules' => $cors]]);
            $this->info('Recording rules applied. Existing unrelated rules were preserved.');
        }

        return self::SUCCESS;
    }

    private function readRules(callable $read, string $missingCode, string $key): array
    {
        try {
            return $read()[$key] ?? [];
        } catch (S3Exception $e) {
            if ($e->getAwsErrorCode() !== $missingCode) {
                throw $e;
            }

            return [];
        }
    }
}
