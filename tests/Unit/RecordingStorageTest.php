<?php

namespace Tests\Unit;

use App\Models\PostRecording;
use App\Services\RecordingStorage;
use Aws\MockHandler;
use Aws\Result;
use Aws\S3\S3Client;
use Tests\TestCase;

class RecordingStorageTest extends TestCase
{
    public function test_signed_upload_enforces_all_native_headers_and_five_minute_expiry(): void
    {
        config(['recordings.r2' => ['key' => 'fake-key', 'secret' => 'fake-secret', 'bucket' => 'test',
            'endpoint' => 'https://r2.example', 'url' => 'https://audio.example']]);
        $recording = new PostRecording(['object_key' => 'recordings/test.m4a', 'size_bytes' => 12345,
            'content_md5' => base64_encode(md5('audio', true))]);
        $upload = (new RecordingStorage)->presign($recording);
        parse_str(parse_url($upload['url'], PHP_URL_QUERY), $query);
        $this->assertSame('300', $query['X-Amz-Expires']);
        $this->assertSame('content-length;content-md5;content-type;host;if-none-match', $query['X-Amz-SignedHeaders']);
        $this->assertSame('*', $upload['headers']['If-None-Match']);
        $this->assertSame('12345', $upload['headers']['Content-Length']);
        $this->assertStringContainsString('/test/recordings/test.m4a?', $upload['url']);
    }

    public function test_confirmation_storage_only_issues_head_object(): void
    {
        $commands = [];
        $handler = new MockHandler([new Result(['ContentLength' => 123])]);
        $client = new S3Client(['region' => 'auto', 'version' => 'latest',
            'credentials' => ['key' => 'fake-key', 'secret' => 'fake-secret'],
            'handler' => function ($command, $request) use (&$commands, $handler) {
                $commands[] = $command->getName();

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
        config(['recordings.r2.bucket' => 'test']);
        $this->assertSame(123, $storage->head(new PostRecording(['object_key' => 'recordings/test.m4a']))['ContentLength']);
        $this->assertSame(['HeadObject'], $commands);
    }
}
