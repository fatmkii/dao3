<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class CleanupLegacyAntiSpam extends Command
{
    protected $signature = 'antispam:cleanup-legacy {--dry-run : 仅统计匹配的旧键，不删除}';

    protected $description = '清理已停用的反灌水时间线、IP2 和小时级 IP 计数';

    public function handle(): int
    {
        $redis = Redis::connection();
        $prefix = config('database.redis.options.prefix', '');
        $count = 0;
        foreach (['post_timeline:', 'new_post_record_IP2_', 'new_post_record_IP_'] as $legacyPrefix) {
            $cursor = null;
            do {
                $result = $redis->scan($cursor, ['match' => $prefix.$legacyPrefix.'*', 'count' => 100]);
                if ($result === false) {
                    break;
                }
                [$cursor, $keys] = $result;
                foreach ($keys as $key) {
                    // SCAN 返回完整键名，其他命令由连接自动加上应用前缀。
                    $count += $this->option('dry-run') ? 1 : $redis->unlink(substr($key, strlen($prefix)));
                }
            } while ((string) $cursor !== '0');
        }

        $this->info(($this->option('dry-run') ? '匹配旧键：' : '已删除旧键：').$count);

        return self::SUCCESS;
    }
}
