<?php

namespace App\Services;

use App\Common\ResponseCode;
use App\Exceptions\SpamDetectedException;
use App\Models\User;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class AntiSpamService
{
    const NEW_THREAD_INTERVAL = 300;

    const NEW_POST_NUMBER = 10;

    const NEW_POST_INTERVAL = 60;

    const POST_CAPTCHA_MIN = 80;

    const POST_CAPTCHA_MAX = 120;

    const POST_CAPTCHA_INTERVAL = 3600;

    const CAPTCHA_INTERVAL = 60;

    const HONGBAO_INTERVAL = 300;

    const HONGBAO_NUMBER_IP = 6;

    const REDIS_POST_RECORD = 'new_post_record_';

    const REDIS_POST_CAPTCHA = 'post_captcha_user:';

    const REDIS_CAPTCHA = 'water_captcha_user:';

    const REDIS_THREAD_RECORD = 'new_thread_record_';

    const REDIS_HONGBAO_RECORD_IP = 'hongbao_record_IP_';

    /**
     * 检查 IP 分钟限流，并原子预占账号的小时额度。
     *
     * @return array{round: string, token: string}|null 管理员不占用小时额度
     */
    public function checkPostSpam(string $ip, User $user): ?array
    {
        if ($user->admin >= 10) {
            return null;
        }

        if ((int) Redis::get(self::REDIS_POST_RECORD.$ip) >= self::NEW_POST_NUMBER) {
            throw new SpamDetectedException(
                ResponseCode::POST_TOO_MANY,
                ResponseCode::$codeMap[ResponseCode::POST_TOO_MANY].'为防止刷屏，每1分钟最多回帖10次（含大乱斗）'
            );
        }

        $token = Str::random(32);
        $round = Redis::eval(
            <<<'LUA'
if redis.call('exists', KEYS[1]) == 0 then
    redis.call('hset', KEYS[1], 'round', ARGV[1], 'limit', ARGV[2], 'count', 0, 'pending', 0, 'started', 0)
    -- 尚无成功回复时也设置 TTL，避免中断请求留下永久状态。
    redis.call('expire', KEYS[1], ARGV[3])
end
local count = tonumber(redis.call('hget', KEYS[1], 'count'))
local pending = tonumber(redis.call('hget', KEYS[1], 'pending'))
if count + pending >= tonumber(redis.call('hget', KEYS[1], 'limit')) then
    return ''
end
redis.call('hset', KEYS[1], 'pending:' .. ARGV[1], 1)
redis.call('hincrby', KEYS[1], 'pending', 1)
return redis.call('hget', KEYS[1], 'round')
LUA,
            1,
            self::REDIS_POST_CAPTCHA.$user->id,
            $token,
            $this->newPostCaptchaLimit(),
            self::POST_CAPTCHA_INTERVAL,
        );

        if (! $round) {
            throw new SpamDetectedException(
                ResponseCode::POST_TOO_MANY_MAYBE_ROBOT,
                ResponseCode::$codeMap[ResponseCode::POST_TOO_MANY_MAYBE_ROBOT]
            );
        }

        return ['round' => $round, 'token' => $token];
    }

    protected function newPostCaptchaLimit(): int
    {
        // 每次请求提供候选值，只有创建新一轮状态时才采用。
        return random_int(self::POST_CAPTCHA_MIN, self::POST_CAPTCHA_MAX);
    }

    /** @param array{round: string, token: string} $reservation */
    public function finishPostReservation(User $user, array $reservation, bool $succeeded): void
    {
        Redis::eval(
            <<<'LUA'
if redis.call('hget', KEYS[1], 'round') ~= ARGV[1] then
    return 0
end
if redis.call('hdel', KEYS[1], 'pending:' .. ARGV[2]) == 0 then
    return 0
end
local pending = redis.call('hincrby', KEYS[1], 'pending', -1)
if ARGV[3] == '1' then
    redis.call('hincrby', KEYS[1], 'count', 1)
    if redis.call('hget', KEYS[1], 'started') == '0' then
        redis.call('hset', KEYS[1], 'started', 1)
        redis.call('expire', KEYS[1], ARGV[4])
    end
elseif pending == 0 and redis.call('hget', KEYS[1], 'count') == '0' then
    redis.call('del', KEYS[1])
end
return 1
LUA,
            1,
            self::REDIS_POST_CAPTCHA.$user->id,
            $reservation['round'],
            $reservation['token'],
            $succeeded ? 1 : 0,
            self::POST_CAPTCHA_INTERVAL,
        );
    }

    public function checkThreadSpam(string $binggan, User $user): void
    {
        if (Redis::exists(self::REDIS_THREAD_RECORD.$binggan) && $user->admin == 0) {
            $limitedMinutes = ceil(Redis::ttl(self::REDIS_THREAD_RECORD.$binggan) / 60);

            throw new SpamDetectedException(
                ResponseCode::THREAD_TOO_MANY,
                ResponseCode::$codeMap[ResponseCode::THREAD_TOO_MANY].'，你只能在'
                    .$limitedMinutes.'分钟后再发新主题。'
            );
        }
    }

    public function checkHongbaoSpam(string $ip, User $user): void
    {
        if ($user->admin < 100 && (int) Redis::get(self::REDIS_HONGBAO_RECORD_IP.$ip) >= self::HONGBAO_NUMBER_IP) {
            throw new SpamDetectedException(
                ResponseCode::POST_TOO_MANY_MAYBE_ROBOT,
                ResponseCode::$codeMap[ResponseCode::POST_TOO_MANY_MAYBE_ROBOT]
            );
        }
    }

    public function recordPost(string $ip): void
    {
        $this->incrementWithExpiry(self::REDIS_POST_RECORD.$ip, self::NEW_POST_INTERVAL);
    }

    public function recordThread(string $binggan): void
    {
        Redis::setex(self::REDIS_THREAD_RECORD.$binggan, self::NEW_THREAD_INTERVAL, 1);
    }

    public function recordHongbao(string $ip): void
    {
        $this->incrementWithExpiry(self::REDIS_HONGBAO_RECORD_IP.$ip, self::HONGBAO_INTERVAL);
    }

    private function incrementWithExpiry(string $key, int $seconds): void
    {
        Redis::eval(
            <<<'LUA'
local count = redis.call('incr', KEYS[1])
if count == 1 then
    redis.call('expire', KEYS[1], ARGV[1])
end
return count
LUA,
            1,
            $key,
            $seconds,
        );
    }

    public function issueCaptcha(User $user, string $code): string
    {
        $key = Str::random(32);
        Redis::setex(self::REDIS_CAPTCHA.$user->id.':'.$key, self::CAPTCHA_INTERVAL, json_encode([
            'code' => strtolower($code),
            'post_round' => Redis::hget(self::REDIS_POST_CAPTCHA.$user->id, 'round') ?: '',
        ], JSON_THROW_ON_ERROR));

        return $key;
    }

    public function unlock(User $user, string $ip, string $key, string $code, string $type): int
    {
        return (int) Redis::eval(
            <<<'LUA'
local captcha = redis.call('get', KEYS[1])
if not captcha then
    return tonumber(ARGV[4])
end
redis.call('del', KEYS[1])
local data = cjson.decode(captcha)
if data.code ~= ARGV[1] then
    return tonumber(ARGV[5])
end
if ARGV[2] == 'new_post' then
    -- 过期或已解锁的验证码不能重置新一轮计数。
    if data.post_round == redis.call('hget', KEYS[2], 'round') then
        local used = tonumber(redis.call('hget', KEYS[2], 'count')) + tonumber(redis.call('hget', KEYS[2], 'pending'))
        if used >= tonumber(redis.call('hget', KEYS[2], 'limit')) then
            redis.call('del', KEYS[2])
        end
    end
elseif ARGV[2] == 'hongbao_store' then
    redis.call('del', KEYS[3])
end
return tonumber(ARGV[3])
LUA,
            3,
            self::REDIS_CAPTCHA.$user->id.':'.$key,
            self::REDIS_POST_CAPTCHA.$user->id,
            self::REDIS_HONGBAO_RECORD_IP.$ip,
            strtolower($code),
            $type,
            ResponseCode::SUCCESS,
            ResponseCode::CAPTCHA_NOT_FOUND,
            ResponseCode::CAPTCHA_WRONG,
        );
    }
}
