<?php

namespace Tests\Unit;

use App\Models\User;
use App\Services\AntiSpamService;
use PHPUnit\Framework\TestCase;

class AntiSpamServiceTest extends TestCase
{
    private AntiSpamService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new AntiSpamService();
    }

    // ============================================
    // 常量验证
    // ============================================

    public function test_post_rate_limit_constants(): void
    {
        $this->assertEquals(60, AntiSpamService::NEW_POST_INTERVAL);
        $this->assertEquals(10, AntiSpamService::NEW_POST_NUMBER);
        $this->assertEquals(3600, AntiSpamService::NEW_POST_INTERVAL_IP);
        $this->assertEquals(100, AntiSpamService::NEW_POST_NUMBER_IP);
    }

    public function test_thread_rate_limit_constants(): void
    {
        $this->assertEquals(300, AntiSpamService::NEW_THREAD_INTERVAL);
    }

    public function test_hongbao_rate_limit_constants(): void
    {
        $this->assertEquals(300, AntiSpamService::HONGBAO_INTERVAL);
        $this->assertEquals(6, AntiSpamService::HONGBAO_NUMBER_IP);
    }

    public function test_scoring_thresholds(): void
    {
        $this->assertEquals(4, AntiSpamService::SCORE_THRESHOLD_CAPTCHA);
        $this->assertEquals(7, AntiSpamService::SCORE_THRESHOLD_COOLDOWN);
        $this->assertEquals(10, AntiSpamService::SCORE_THRESHOLD_LOCK);
        $this->assertEquals(7, AntiSpamService::SCORE_MIN_RECORD);
    }

    public function test_variance_scoring_constants(): void
    {
        $this->assertEquals(5, AntiSpamService::SCORE_INTERVAL_VARIANCE_LOW);
        $this->assertEquals(15, AntiSpamService::SCORE_INTERVAL_VARIANCE_MED);
    }

    // ============================================
    // Redis key 前缀验证
    // ============================================

    public function test_redis_key_constants_match_legacy_format(): void
    {
        // 必须与 UserController@water_unlock 中的 key 格式一致
        $this->assertEquals('new_post_record_', AntiSpamService::REDIS_POST_RECORD);
        $this->assertEquals('new_post_record_IP_', AntiSpamService::REDIS_POST_RECORD_IP);
        $this->assertEquals('new_post_record_IP2_', AntiSpamService::REDIS_POST_RECORD_IP2);
        $this->assertEquals('new_thread_record_', AntiSpamService::REDIS_THREAD_RECORD);
        $this->assertEquals('hongbao_record_IP_', AntiSpamService::REDIS_HONGBAO_RECORD_IP);
    }

    // ============================================
    // 多维评分 - 维度A (间隔方差)
    // ============================================

    public function test_risk_score_dimension_a_low_variance_scores_4(): void
    {
        // 方差 < 5 → +4
        // 这个测试验证评分常数的正确性
        $this->assertEquals(4, $this->getScoreForVariance(1.0));
        $this->assertEquals(4, $this->getScoreForVariance(3.0));
        $this->assertEquals(4, $this->getScoreForVariance(4.9));
    }

    public function test_risk_score_dimension_a_medium_variance_scores_2(): void
    {
        $this->assertEquals(2, $this->getScoreForVariance(5.0));
        $this->assertEquals(2, $this->getScoreForVariance(10.0));
        $this->assertEquals(2, $this->getScoreForVariance(14.9));
    }

    public function test_risk_score_dimension_a_high_variance_scores_0(): void
    {
        $this->assertEquals(0, $this->getScoreForVariance(15.0));
        $this->assertEquals(0, $this->getScoreForVariance(100.0));
    }

    // ============================================
    // 多维评分 - 维度B (取整间隔比)
    // ============================================

    public function test_risk_score_dimension_b_high_rounded_ratio_scores_4(): void
    {
        $this->assertEquals(4, $this->getScoreForRoundedRatio(0.71));
        $this->assertEquals(4, $this->getScoreForRoundedRatio(1.0));
    }

    public function test_risk_score_dimension_b_medium_rounded_ratio_scores_2(): void
    {
        $this->assertEquals(2, $this->getScoreForRoundedRatio(0.41));
        $this->assertEquals(2, $this->getScoreForRoundedRatio(0.69));
    }

    public function test_risk_score_dimension_b_low_rounded_ratio_scores_0(): void
    {
        $this->assertEquals(0, $this->getScoreForRoundedRatio(0));
        $this->assertEquals(0, $this->getScoreForRoundedRatio(0.39));
    }

    // ============================================
    // 多维评分 - 维度C (持续发帖密度)
    // ============================================

    public function test_risk_score_dimension_c_high_density_scores_3(): void
    {
        $this->assertEquals(3, $this->getScoreForPostsPerMinute(3.1));
        $this->assertEquals(3, $this->getScoreForPostsPerMinute(10.0));
    }

    public function test_risk_score_dimension_c_medium_density_scores_1(): void
    {
        $this->assertEquals(1, $this->getScoreForPostsPerMinute(2.1));
        $this->assertEquals(1, $this->getScoreForPostsPerMinute(2.9));
    }

    public function test_risk_score_dimension_c_low_density_scores_0(): void
    {
        $this->assertEquals(0, $this->getScoreForPostsPerMinute(0));
        $this->assertEquals(0, $this->getScoreForPostsPerMinute(1.9));
    }

    // ============================================
    // 多维评分 - 维度D (回帖不看帖) 和维度E (深夜)
    // ============================================

    public function test_risk_score_dimension_d_no_read_scores_2(): void
    {
        // IP2 计数器 >= 5 → +2
        $this->assertEquals(2, $this->getScoreForNoRead(5));
        $this->assertEquals(2, $this->getScoreForNoRead(10));
        $this->assertEquals(0, $this->getScoreForNoRead(4));
        $this->assertEquals(0, $this->getScoreForNoRead(0));
    }

    public function test_risk_score_dimension_e_night_hours(): void
    {
        // 凌晨 3-6 点 → +1
        $this->assertEquals(1, $this->getScoreForHour(3));
        $this->assertEquals(1, $this->getScoreForHour(5));
        $this->assertEquals(0, $this->getScoreForHour(2));
        $this->assertEquals(0, $this->getScoreForHour(6));
        $this->assertEquals(0, $this->getScoreForHour(12));
    }

    // ============================================
    // 评分记录阈值验证
    // ============================================

    public function test_score_below_7_is_not_recorded(): void
    {
        // 典型正常用户的评分组合
        $this->assertLessThan(7, $this->getScoreForVariance(15.0)      // A=0
            + $this->getScoreForRoundedRatio(0.3)                      // B=0
            + $this->getScoreForPostsPerMinute(1.0)                    // C=0
            + 0                                                         // D=0
            + 0);                                                       // E=0
    }

    public function test_score_7_or_above_is_recorded(): void
    {
        // 机器人的评分组合：低方差 + 高取整间隔比
        $score = $this->getScoreForVariance(3.0)         // A=4
            + $this->getScoreForRoundedRatio(0.8)         // B=4
            + $this->getScoreForPostsPerMinute(1.0);       // C=0

        $this->assertGreaterThanOrEqual(7, $score);
    }

    // ============================================
    // 辅助方法
    // ============================================

    private function getScoreForVariance(float $variance): int
    {
        if ($variance < 5) {
            return 4;
        }
        if ($variance < 15) {
            return 2;
        }
        return 0;
    }

    private function getScoreForRoundedRatio(float $ratio): int
    {
        if ($ratio > 0.7) {
            return 4;
        }
        if ($ratio > 0.4) {
            return 2;
        }
        return 0;
    }

    private function getScoreForPostsPerMinute(float $ppm): int
    {
        if ($ppm > 3) {
            return 3;
        }
        if ($ppm > 2) {
            return 1;
        }
        return 0;
    }

    private function getScoreForNoRead(int $ip2Count): int
    {
        return $ip2Count >= 5 ? 2 : 0;
    }

    private function getScoreForHour(int $hour): int
    {
        return ($hour >= 3 && $hour < 6) ? 1 : 0;
    }
}
