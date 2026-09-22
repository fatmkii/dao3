<?php

namespace Tests\Concerns;

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

trait InteractsWithAntiSpamRedis
{
    protected function isolateAntiSpamRedis(): void
    {
        $client = Redis::connection()->client();
        $previousPrefix = $client->getOption(\Redis::OPT_PREFIX);
        $prefix = $previousPrefix.'test_antispam_'.Str::random(12).':';
        $client->setOption(\Redis::OPT_PREFIX, $prefix);
        config(['database.redis.options.prefix' => $prefix]);

        $this->beforeApplicationDestroyed(function () use ($previousPrefix, $prefix) {
            $client = Redis::connection()->client();
            $cursor = null;
            do {
                $keys = $client->scan($cursor, $prefix.'*', 100);
                foreach ($keys ?: [] as $key) {
                    $client->unlink(substr($key, strlen($prefix)));
                }
            } while ($cursor !== 0);
            $client->setOption(\Redis::OPT_PREFIX, $previousPrefix);
        });
    }
}
