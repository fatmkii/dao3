<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PostRecording;
use App\Services\PostRecordingService;
use App\Services\RecordingStorage;
use Aws\S3\Exception\S3Exception;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MobileRecordingController extends Controller
{
    public function config(Request $request, PostRecordingService $service)
    {
        $service->requireAndroid($request);

        return $this->success([
            'enabled' => config('recordings.enabled') && ! in_array(null, config('recordings.r2'), true)
                && ! in_array('', config('recordings.r2'), true),
            'max_duration_ms' => config('recordings.max_duration_ms'),
            'max_size_bytes' => $this->maxSize(),
            'retention_days' => config('recordings.retention_days'),
        ]);
    }

    public function uploads(Request $request, PostRecordingService $service, RecordingStorage $storage)
    {
        $service->requireAndroid($request);
        abort_unless(config('recordings.enabled'), 503, '录音暂不可用');
        $data = $request->validate([
            'thread_id' => 'required|integer|min:1',
            'size_bytes' => 'required|integer|min:1|max:'.$this->maxSize(),
            'duration_ms' => 'required|integer|min:1|max:'.config('recordings.max_duration_ms'),
            'content_md5' => ['required', 'string', 'regex:/^[A-Za-z0-9+\/]{22}==$/'],
        ]);
        $service->requireThread($request);
        $recording = Cache::lock('recording-upload:'.$request->user()->id, 10)->block(5, function () use ($request, $data) {
            $minute = 'recording-minute:'.$request->user()->id;
            $day = 'recording-day:'.$request->user()->id.':'.now()->format('Y-m-d');
            abort_if(RateLimiter::tooManyAttempts($minute, config('recordings.uploads_per_minute'))
                || RateLimiter::tooManyAttempts($day, config('recordings.uploads_per_day')), 429, '录音上传次数已达上限');
            RateLimiter::hit($minute, 60);
            RateLimiter::hit($day, now()->diffInSeconds(now()->endOfDay()) + 1);

            return PostRecording::create($data + [
                'user_id' => $request->user()->id,
                'object_key' => 'recordings/'.Str::uuid().'.m4a',
            ]);
        });

        return $this->success(['recording_id' => $recording->id, 'upload' => $storage->presign($recording), 'valid_for_seconds' => 300]);
    }

    public function complete(Request $request, int $id, PostRecordingService $service, RecordingStorage $storage)
    {
        $service->requireAndroid($request);

        return DB::transaction(function () use ($request, $id, $storage) {
            $recording = PostRecording::whereKey($id)->where('user_id', $request->user()->id)->lockForUpdate()->firstOrFail();
            if ($recording->status === 'ready') {
                return $this->success($recording->playbackData());
            }
            try {
                $head = $storage->head($recording);
            } catch (S3Exception $e) {
                if ($e->getStatusCode() !== 404) {
                    throw $e;
                }
                throw ValidationException::withMessages(['recording_id' => '录音尚未上传']);
            }
            if ((int) $head['ContentLength'] !== $recording->size_bytes || ($head['ContentType'] ?? '') !== 'audio/mp4'
                || strtolower(trim($head['ETag'] ?? '', '"')) !== bin2hex(base64_decode($recording->content_md5))) {
                throw ValidationException::withMessages(['recording_id' => '录音对象信息不符']);
            }
            $uploadedAt = CarbonImmutable::parse($head['LastModified'])->setTimezone(config('app.timezone'));
            $recording->update([
                'status' => 'ready',
                'uploaded_at' => $uploadedAt,
                'expires_at' => $uploadedAt->addDays(config('recordings.retention_days')),
            ]);

            return $this->success($recording->playbackData());
        });
    }

    private function maxSize(): int
    {
        return (int) ceil(config('recordings.max_duration_ms') * 16) + 65536;
    }

    private function success(array $data)
    {
        return response()->json(['code' => 200, 'message' => '成功', 'data' => $data]);
    }
}
