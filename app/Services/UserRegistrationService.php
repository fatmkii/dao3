<?php

namespace App\Services;

use App\Common\NewBingganChecker;
use App\Facades\GlobalSetting;
use App\Jobs\ProcessUserCreatedLocation;
use App\Models\User;
use Illuminate\Support\Facades\Redis;

class UserRegistrationService
{
    private const IP_COOLDOWN_SECONDS = 7 * 24 * 3600;

    private const NEW_USER_SECONDS = 24 * 3600;

    private const BINGGAN_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnprstuvwxyz1234567890';

    public function isOpen(): bool
    {
        [$isOpen] = NewBingganChecker::check();

        return (bool) GlobalSetting::get('new_binggan') && $isOpen;
    }

    public function ipCooldownDays(string $ip): ?int
    {
        $key = 'reg_record_'.$ip;
        if (! Redis::exists($key)) {
            return null;
        }

        return intval(Redis::ttl($key) / 86400) + 1;
    }

    public function createUser(string $ip, ?string $registrationReference = null): User
    {
        do {
            $binggan = $this->randomBinggan(9);
        } while (User::where('binggan', $binggan)->exists());

        $user = new User;
        $user->binggan = $binggan;
        $user->created_ip = $ip;
        $user->created_UUID = $registrationReference;
        $user->coin = 300;
        $user->save();

        return $user;
    }

    public function complete(User $user, string $ip): void
    {
        Redis::setex('reg_record_'.$ip, self::IP_COOLDOWN_SECONDS, 1);
        Redis::setex('new_user_'.$user->binggan, self::NEW_USER_SECONDS, 1);

        ProcessUserCreatedLocation::dispatch([
            'IP' => $ip,
            'user_id' => $user->id,
        ]);
    }

    private function randomBinggan(int $length): string
    {
        $output = '';
        $lastIndex = strlen(self::BINGGAN_ALPHABET) - 1;
        for ($index = 0; $index < $length; $index++) {
            $output .= self::BINGGAN_ALPHABET[random_int(0, $lastIndex)];
        }

        return $output;
    }
}
