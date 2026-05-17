<?php

namespace App\Services;

use App\Common\ResponseCode;
use App\Exceptions\SpamDetectedException;
use App\Jobs\ProcessUserActive;
use App\Models\User;
use Illuminate\Support\Facades\Redis;

class AntiSpamService
{
    // 防灌水相关常量
    const NEW_THREAD_INTERVAL = 300;
    const NEW_POST_NUMBER = 10;
    const NEW_POST_INTERVAL = 60;
    const NEW_POST_NUMBER_IP = 100;
    const NEW_POST_NUMBER_IP2 = 5;
    const NEW_POST_INTERVAL_IP = 3600;

    // 抢红包相关常量
    const HONGBAO_INTERVAL = 300;
    const HONGBAO_NUMBER_IP = 6;

    // 多维度评分阈值（仅定义，暂不执行）
    const SCORE_THRESHOLD_CAPTCHA = 4;
    const SCORE_THRESHOLD_COOLDOWN = 7;
    const SCORE_THRESHOLD_LOCK = 10;

    // 多维度评分内部参数
    const SCORE_INTERVAL_VARIANCE_LOW = 5;
    const SCORE_INTERVAL_VARIANCE_MED = 15;
    const SCORE_POSTS_PER_MINUTE_HIGH = 3;
    const SCORE_POSTS_PER_MINUTE_MED = 2;
    const SCORE_MIN_RECORD = 0; // 分数 >= 7 才记录到数据库

    // Redis key 前缀
    const REDIS_POST_RECORD = 'new_post_record_';
    const REDIS_POST_RECORD_IP = 'new_post_record_IP_';
    const REDIS_POST_RECORD_IP2 = 'new_post_record_IP2_';
    const REDIS_THREAD_RECORD = 'new_thread_record_';
    const REDIS_HONGBAO_RECORD_IP = 'hongbao_record_IP_';
    const REDIS_POST_TIMELINE = 'post_timeline:';

    /**
     * 检查发帖/回帖频率（对应原 waterCheck 'new_post'）
     * 第1、2类检查阻挡，第3-5类静默记录
     */
    public function checkPostSpam(string $ip, User $user, ?int $threadId, ?string $newPostKey, ?int $timestamp): void
    {
        $keys = [
            self::REDIS_POST_RECORD . $ip,
            self::REDIS_POST_RECORD_IP . $ip,
            self::REDIS_POST_RECORD_IP2 . $ip,
        ];

        $results = Redis::pipeline(function ($pipe) use ($keys) {
            foreach ($keys as $key) {
                $pipe->get($key);
            }
        });

        $new_post_record = (int) ($results[0] ?? 0);
        $new_post_record_IP = (int) ($results[1] ?? 0);
        $new_post_record_IP2 = (int) ($results[2] ?? 0);

        // 第1类检查：IP记录，1分钟最多10贴
        if ($new_post_record >= self::NEW_POST_NUMBER && $user->admin < 10) {
            throw new SpamDetectedException(
                ResponseCode::POST_TOO_MANY,
                ResponseCode::$codeMap[ResponseCode::POST_TOO_MANY] . '为防止刷屏，每1分钟最多回帖10次（含大乱斗）'
            );
        }

        // 第2类检查：IP记录，3600秒内100次弹出验证码
        if ($new_post_record_IP >= self::NEW_POST_NUMBER_IP && $user->admin < 10) {
            ProcessUserActive::dispatch([
                'binggan' => $user->binggan,
                'user_id' => $user->id,
                'thread_id' => $threadId,
                'active' => '用户触发了机器人刷帖警报',
                'content' => 'ip:' . $ip . ' record:' . $new_post_record_IP,
            ]);

            throw new SpamDetectedException(
                ResponseCode::POST_TOO_MANY_MAYBE_ROBOT,
                ResponseCode::$codeMap[ResponseCode::POST_TOO_MANY_MAYBE_ROBOT]
            );
        }

        // 第3-4类检查已由 calculateRiskScore 多维度评分取代
        // 第3类：只回帖不看帖 → 维度D
        // 第4类：发帖间隔方差 → 维度A (Redis Sorted Set)

        // 第5类检查：JS new_post_key 验证（静默记录）
        if ($user->admin < 10) {
            $this->newPostKeyCheck($user->binggan, $user->id, $threadId, $ip, $newPostKey, $timestamp);
        }
    }

    /**
     * 检查发新主题频率（对应原 waterCheck 'new_thread'）
     */
    public function checkThreadSpam(string $binggan, User $user): void
    {
        if (Redis::exists(self::REDIS_THREAD_RECORD . $binggan) && $user->admin == 0) {
            $limted_minutes = ceil(Redis::TTL(self::REDIS_THREAD_RECORD . $binggan) / 60);

            throw new SpamDetectedException(
                ResponseCode::THREAD_TOO_MANY,
                ResponseCode::$codeMap[ResponseCode::THREAD_TOO_MANY] . '，你只能在'
                    . $limted_minutes . '分钟后再发新主题。'
            );
        }
    }

    /**
     * 检查抢红包频率（对应原 hongbaoRobotCheck）
     */
    public function checkHongbaoSpam(string $ip, User $user, ?int $threadId, ?string $newPostKey, ?int $timestamp): void
    {
        $hongbao_record_IP = (int) (Redis::GET(self::REDIS_HONGBAO_RECORD_IP . $ip) ?: 0);

        // 抢红包IP检查
        if ($hongbao_record_IP >= self::HONGBAO_NUMBER_IP && $user->admin < 100) {
            ProcessUserActive::dispatch([
                'binggan' => $user->binggan,
                'user_id' => $user->id,
                'thread_id' => $threadId,
                'active' => '用户触发了抢红包警报',
                'content' => 'ip:' . $ip . ' record:' . $hongbao_record_IP,
            ]);

            throw new SpamDetectedException(
                ResponseCode::POST_TOO_MANY_MAYBE_ROBOT,
                ResponseCode::$codeMap[ResponseCode::POST_TOO_MANY_MAYBE_ROBOT]
            );
        }

        // JS new_post_key 验证
        if ($user->admin < 10) {
            $this->newPostKeyCheck($user->binggan, $user->id, $threadId, $ip, $newPostKey, $timestamp);
        }
    }

    /**
     * 记录发帖/回帖频率，返回 IP2 计数器的新值（供 calculateRiskScore 复用）
     */
    public function recordPost(string $ip): int
    {
        // 逐个 INCR（非 pipeline），保证返回值可靠，EXPIRE 才能正确触发
        $r0 = Redis::incr(self::REDIS_POST_RECORD . $ip);
        if ($r0 == 1) {
            Redis::expire(self::REDIS_POST_RECORD . $ip, self::NEW_POST_INTERVAL);
        }

        $r1 = Redis::incr(self::REDIS_POST_RECORD_IP . $ip);
        if ($r1 == 1) {
            Redis::expire(self::REDIS_POST_RECORD_IP . $ip, self::NEW_POST_INTERVAL_IP);
        }

        $r2 = Redis::incr(self::REDIS_POST_RECORD_IP2 . $ip);
        if ($r2 == 1) {
            Redis::expire(self::REDIS_POST_RECORD_IP2 . $ip, self::NEW_POST_INTERVAL_IP);
        }

        return $r2;
    }

    /**
     * 记录发新主题频率（对应原 waterRecord 'new_thread'）
     */
    public function recordThread(string $binggan): void
    {
        Redis::setex(self::REDIS_THREAD_RECORD . $binggan, self::NEW_THREAD_INTERVAL, 1);
    }

    /**
     * 记录抢红包频率（对应原 hongbaoRobotRecord）
     */
    public function recordHongbao(string $ip): void
    {
        if (Redis::exists(self::REDIS_HONGBAO_RECORD_IP . $ip)) {
            Redis::incr(self::REDIS_HONGBAO_RECORD_IP . $ip);
        } else {
            Redis::setex(self::REDIS_HONGBAO_RECORD_IP . $ip, self::HONGBAO_INTERVAL, 1);
        }
    }

    /**
     * 清除灌水检查记录（对应原 waterClear）
     */
    public function clearPostView(string $ip): void
    {
        Redis::del(self::REDIS_POST_RECORD_IP2 . $ip);
    }

    /**
     * 记录发帖时间到 Redis Sorted Set（按饼干分组）
     */
    public function recordPostTimeline(string $binggan, int $postId): void
    {
        $key = self::REDIS_POST_TIMELINE . $binggan;
        Redis::zadd($key, now()->timestamp, $postId);

        // 概率性裁剪：1/5 概率执行，减少 Redis 调用
        if (mt_rand(1, 5) === 1) {
            Redis::zremrangeByRank($key, 0, -31);
        }
    }

    /**
     * 多维度机器人风险评分（只计算，不拦截）
     * 只有总分 >= SCORE_MIN_RECORD (7) 才写数据库
     */
    public function calculateRiskScore(string $binggan, int $userId, string $ip, ?int $threadId, int $ip2Count): void
    {
        $timelineKey = self::REDIS_POST_TIMELINE . $binggan;
        $timeline = Redis::zrange($timelineKey, 0, -1, true);

        if (!$timeline || count($timeline) < 3) {
            return; // 数据不足
        }

        $scores = array_values($timeline);
        sort($scores);
        $count = count($scores);

        // 计算间隔
        $deltas = [];
        for ($i = 0; $i < $count - 1; $i++) {
            $deltas[] = $scores[$i + 1] - $scores[$i];
        }
        $deltaCount = count($deltas);
        if ($deltaCount === 0) {
            return;
        }

        // 维度A：间隔方差
        $avg = array_sum($deltas) / $deltaCount;
        $variance = 0;
        foreach ($deltas as $d) {
            $variance += pow($d - $avg, 2);
        }
        $variance /= $deltaCount;

        $scoreA = 0;
        if ($variance < self::SCORE_INTERVAL_VARIANCE_LOW) {
            $scoreA = 4;
        } elseif ($variance < self::SCORE_INTERVAL_VARIANCE_MED) {
            $scoreA = 2;
        }

        // 维度B：平均间隔是否接近 6 秒（60s/10次 = 6s，机器人卡此间隔）
        $scoreB = 0;
        if ($avg >= 5 && $avg <= 7) {
            $scoreB = 4;
        } elseif ($avg >= 2 && $avg <= 10) {
            $scoreB = 2;
        }

        // 维度C：持续发帖密度
        $duration = $scores[$count - 1] - $scores[0];
        $scoreC = 0;
        if ($duration > 0 && $count >= 5) {
            $postsPerMinute = $count / ($duration / 60);
            if ($postsPerMinute > self::SCORE_POSTS_PER_MINUTE_HIGH) {
                $scoreC = 3;
            } elseif ($postsPerMinute > self::SCORE_POSTS_PER_MINUTE_MED) {
                $scoreC = 1;
            }
        }

        // 维度D：回帖不看帖（ip2Count 由调用方传入）
        $scoreD = $ip2Count >= self::NEW_POST_NUMBER_IP2 ? 2 : 0;

        // 维度E：深夜时段
        $hour = (int) now()->format('H');
        $scoreE = ($hour >= 3 && $hour < 6) ? 1 : 0;

        $totalScore = $scoreA + $scoreB + $scoreC + $scoreD + $scoreE;
        $normalizedScore = min($totalScore, 10);

        // 只有 >= 7 分才记录到数据库
        if ($normalizedScore < self::SCORE_MIN_RECORD) {
            return;
        }

        $details = [
            'sc' => $normalizedScore,
            'raw' => $totalScore,
            'dm' => [
                'A' => ['s' => $scoreA, 'v' => round($variance, 2), 'avg' => round($avg, 2)],
                'B' => ['s' => $scoreB, 'avg' => round($avg, 2), 'n' => $deltaCount],
                'C' => ['s' => $scoreC, 'ppm' => $duration > 0 ? round($count / ($duration / 60), 2) : 0, 'dur' => $duration, 'n' => $count],
                'D' => ['s' => $scoreD, 'n' => $ip2Count],
                'E' => ['s' => $scoreE, 'h' => $hour],
            ],
            'bg' => $binggan,
            'ip' => $ip,
        ];

        ProcessUserActive::dispatch([
            'binggan' => $binggan,
            'user_id' => $userId,
            'thread_id' => $threadId,
            'active' => '反机器人多维评分',
            'content' => json_encode($details, JSON_UNESCAPED_UNICODE),
        ]);
    }

    // ===== Private helpers =====

    /**
     * newPostKey 检查（验证前端 JS 生成的签名，静默记录）
     */
    private function newPostKeyCheck(string $binggan, int $userId, ?int $threadId, string $ip, ?string $newPostKey, ?int $timestamp): void
    {
        if (!$newPostKey || !$timestamp) {
            return;
        }

        $key_1 = md5($threadId . $binggan . $timestamp . "true");
        if ($newPostKey != $key_1) {
            $key_2 = md5($threadId . $binggan . $timestamp . "false");
            if ($newPostKey == $key_2) {
                ProcessUserActive::dispatch([
                    'binggan' => $binggan,
                    'user_id' => $userId,
                    'active' => '怀疑用户用脚本刷帖(JS脚本类型)',
                    'thread_id' => $threadId,
                    'content' => 'ip:' . $ip,
                ]);
            } else {
                ProcessUserActive::dispatch([
                    'binggan' => $binggan,
                    'user_id' => $userId,
                    'active' => '怀疑用户用脚本刷帖(key不正确)',
                    'thread_id' => $threadId,
                    'content' => 'ip:' . $ip,
                ]);
            }
        }
    }
}
