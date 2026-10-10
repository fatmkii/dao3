<?php

namespace App\Services;

use App\Models\PostRecording;
use Aws\S3\S3Client;

class RecordingStorage
{
    public function client(): S3Client
    {
        return new S3Client([
            'version' => 'latest',
            'region' => 'auto',
            'endpoint' => config('recordings.r2.endpoint'),
            'credentials' => [
                'key' => config('recordings.r2.key'),
                'secret' => config('recordings.r2.secret'),
            ],
            'use_path_style_endpoint' => true,
            'request_checksum_calculation' => 'when_required',
            'signature_provider' => fn () => new RecordingUploadSignature('s3', 'auto'),
        ]);
    }

    public function presign(PostRecording $recording): array
    {
        $client = $this->client();
        $request = $client->createPresignedRequest($client->getCommand('PutObject', [
            'Bucket' => config('recordings.r2.bucket'),
            'Key' => $recording->object_key,
            'ContentType' => 'audio/mp4',
            'ContentLength' => $recording->size_bytes,
            'ContentMD5' => $recording->content_md5,
            'IfNoneMatch' => '*',
        ]), '+5 minutes');

        return [
            'url' => (string) $request->getUri(),
            'headers' => [
                'Content-Type' => 'audio/mp4',
                'Content-Length' => (string) $recording->size_bytes,
                'Content-MD5' => $recording->content_md5,
                'If-None-Match' => '*',
            ],
        ];
    }

    public function head(PostRecording $recording): array
    {
        return $this->client()->headObject([
            'Bucket' => config('recordings.r2.bucket'),
            'Key' => $recording->object_key,
        ])->toArray();
    }
}
