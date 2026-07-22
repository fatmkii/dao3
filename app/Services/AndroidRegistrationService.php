<?php

namespace App\Services;

use App\Common\ResponseCode;
use App\Exceptions\RegistrationException;
use App\Models\AndroidRegistrationDevice;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class AndroidRegistrationService
{
    private const MAX_CLAIMS = 5;

    public function __construct(
        private readonly UserRegistrationService $registration,
        private readonly MobileSessionService $sessions,
    ) {
    }

    public function register(
        string $clientDigest,
        string $ip,
        string $installationId,
        string $deviceName,
        string $appVersion,
    ): array {
        if (! $this->registration->isOpen()) {
            throw new RegistrationException(
                ResponseCode::USER_NEW_CLOSED,
                ResponseCode::$codeMap[ResponseCode::USER_NEW_CLOSED],
            );
        }

        if (($days = $this->registration->ipCooldownDays($ip)) !== null) {
            throw new RegistrationException(
                ResponseCode::USER_REGISTER_FAIL,
                ResponseCode::$codeMap[ResponseCode::USER_REGISTER_FAIL].'，你只能在'.$days.'天后再领取饼干。',
            );
        }

        $deviceKey = $this->deviceKey($clientDigest);
        $result = DB::transaction(function () use ($deviceKey, $ip, $installationId, $deviceName, $appVersion) {
            AndroidRegistrationDevice::query()->insertOrIgnore([
                'device_key' => $deviceKey,
                'claim_count' => 0,
                'is_banned' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $device = AndroidRegistrationDevice::query()
                ->where('device_key', $deviceKey)
                ->lockForUpdate()
                ->firstOrFail();

            if ($device->is_banned || $device->claim_count >= self::MAX_CLAIMS) {
                throw new RegistrationException(
                    ResponseCode::USER_REGISTER_FAIL,
                    '此 Android 设备领取饼干的次数已经达到上限。',
                );
            }

            $user = $this->registration->createUser($ip, $deviceKey);
            $newCount = $device->claim_count + 1;
            $device->forceFill([
                'claim_count' => $newCount,
                'is_banned' => $newCount >= self::MAX_CLAIMS,
                'banned_at' => $newCount >= self::MAX_CLAIMS ? now() : null,
            ])->save();

            return [
                'user' => $user,
                'session' => $this->sessions->create($user, $installationId, $deviceName, $appVersion),
            ];
        }, 3);

        $this->registration->complete($result['user'], $ip);

        return $result['session'];
    }

    private function deviceKey(string $clientDigest): string
    {
        $key = config('mobile.registration_hmac_key');
        if (! is_string($key) || strlen($key) < 32) {
            throw new RuntimeException('ANDROID_REGISTRATION_HMAC_KEY must contain at least 32 characters');
        }

        return hash_hmac('sha256', $clientDigest, $key);
    }
}
