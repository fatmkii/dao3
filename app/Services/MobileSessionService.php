<?php

namespace App\Services;

use App\Exceptions\MobileSessionException;
use App\Models\MobileSession;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MobileSessionService
{
    private const ACCESS_TOKEN_MINUTES = 60;

    private const IDLE_DAYS = 30;

    private const ABSOLUTE_DAYS = 180;

    public function create(User $user, string $installationId, string $deviceName, string $appVersion): array
    {
        return DB::transaction(function () use ($user, $installationId, $deviceName, $appVersion) {
            $now = CarbonImmutable::now();
            $secret = $this->newRefreshSecret();
            $session = MobileSession::create([
                'user_id' => $user->id,
                'installation_id_hash' => hash('sha256', $installationId),
                'refresh_token_hash' => hash('sha256', $secret),
                'device_name' => $deviceName,
                'app_version' => $appVersion,
                'last_used_at' => $now,
                'idle_expires_at' => $now->addDays(self::IDLE_DAYS),
                'absolute_expires_at' => $now->addDays(self::ABSOLUTE_DAYS),
            ]);

            return $this->sessionPayload($session, $secret);
        });
    }

    public function refresh(string $refreshToken): array
    {
        [$sessionId, $secret] = $this->parseRefreshToken($refreshToken);
        $result = DB::transaction(function () use ($sessionId, $secret) {
            $session = MobileSession::query()->lockForUpdate()->find($sessionId);
            if (! $session || $session->revoked_at) {
                return null;
            }

            if (! hash_equals($session->refresh_token_hash, hash('sha256', $secret))) {
                $this->revoke($session);

                return null;
            }

            $now = CarbonImmutable::now();
            if ($session->idle_expires_at->lte($now) || $session->absolute_expires_at->lte($now)) {
                $this->revoke($session);

                return null;
            }

            $newSecret = $this->newRefreshSecret();
            $session->forceFill([
                'refresh_token_hash' => hash('sha256', $newSecret),
                'last_used_at' => $now,
                'idle_expires_at' => $now->addDays(self::IDLE_DAYS),
            ])->save();
            $session->accessTokens()->delete();

            return $this->sessionPayload($session, $newSecret);
        });

        if (! $result) {
            throw new MobileSessionException('移动会话已失效，请重新登录');
        }

        return $result;
    }

    public function logout(string $refreshToken): void
    {
        [$sessionId, $secret] = $this->parseRefreshToken($refreshToken);
        DB::transaction(function () use ($sessionId, $secret) {
            $session = MobileSession::query()->lockForUpdate()->find($sessionId);
            if (! $session || $session->revoked_at) {
                return;
            }

            if (hash_equals($session->refresh_token_hash, hash('sha256', $secret))) {
                $this->revoke($session);
            }
        });
    }

    public function revokeAllForUser(User $user): void
    {
        $this->revokeForUserExcept($user, null);
    }

    public function revokeForUserExcept(User $user, ?string $retainedSessionId): void
    {
        DB::transaction(function () use ($user, $retainedSessionId) {
            MobileSession::query()
                ->where('user_id', $user->id)
                ->when($retainedSessionId, fn ($query) => $query->where('id', '!=', $retainedSessionId))
                ->lockForUpdate()
                ->get()
                ->each(fn (MobileSession $session) => $this->revoke($session));
        });
    }

    private function sessionPayload(MobileSession $session, string $refreshSecret): array
    {
        $accessExpiresAt = CarbonImmutable::now()->addMinutes(self::ACCESS_TOKEN_MINUTES);
        $newToken = $session->user->createToken('android', $session->user->tokenAbilities(), $accessExpiresAt);
        $newToken->accessToken->forceFill([
            'mobile_session_id' => $session->id,
            'client_type' => 'android',
        ])->save();

        return [
            'binggan' => $session->user->binggan,
            'access_token' => $newToken->plainTextToken,
            'access_expires_at' => $accessExpiresAt->toIso8601String(),
            'refresh_token' => $session->id.'.'.$refreshSecret,
            'idle_expires_at' => $session->idle_expires_at->toIso8601String(),
            'absolute_expires_at' => $session->absolute_expires_at->toIso8601String(),
        ];
    }

    private function revoke(MobileSession $session): void
    {
        $session->forceFill(['revoked_at' => now()])->save();
        $session->accessTokens()->delete();
    }

    private function parseRefreshToken(string $refreshToken): array
    {
        $parts = explode('.', $refreshToken, 2);
        if (count($parts) !== 2 || ! Str::isUuid($parts[0]) || strlen($parts[1]) < 40) {
            throw new MobileSessionException('移动会话凭据无效');
        }

        return $parts;
    }

    private function newRefreshSecret(): string
    {
        return Str::random(64);
    }
}
