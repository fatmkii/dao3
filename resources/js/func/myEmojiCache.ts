interface MyEmojiCache {
    // version为null表示服务端当前没有创建过自定义表情包记录。
    version: string | null,
    emojis: string[],
}

// 按饼干隔离缓存，避免同一浏览器切换账号后读到其他用户的表情包。
const MY_EMOJI_CACHE_PREFIX = 'userMyEmoji:'

function cacheKey(binggan: string) {
    return `${MY_EMOJI_CACHE_PREFIX}${binggan}`
}

function isMyEmojiCache(value: unknown): value is MyEmojiCache {
    if (typeof value !== 'object' || value === null) return false

    // localStorage中的内容可能来自旧版本、人工修改或损坏，使用前必须校验完整结构。
    const cache = value as Partial<MyEmojiCache>
    return (cache.version === null || typeof cache.version === 'string')
        && Array.isArray(cache.emojis)
        && cache.emojis.every(emoji => typeof emoji === 'string')
}

function readMyEmojiCache(binggan: string): MyEmojiCache | null {
    const key = cacheKey(binggan)
    const storage = getScopedLocalStorage()

    try {
        const serialized = storage.getItem(key)
        if (serialized === null) return null

        const cache: unknown = JSON.parse(serialized)
        if (isMyEmojiCache(cache)) return cache

        // 格式不合法时主动删除，后续由store重新从服务端下载。
        storage.removeItem(key)
    } catch {
        try {
            storage.removeItem(key)
        } catch {
            // 隐私模式等环境可能完全禁用localStorage，此时退化为仅使用网络数据。
        }
    }

    return null
}

function writeMyEmojiCache(binggan: string, cache: MyEmojiCache) {
    try {
        getScopedLocalStorage().setItem(cacheKey(binggan), JSON.stringify(cache))
    } catch {
        // localStorage不可用或空间不足时保留内存数据，不让缓存失败影响正常使用。
    }
}

export { readMyEmojiCache, writeMyEmojiCache, type MyEmojiCache }
import { getScopedLocalStorage } from '@/js/androidAuth'
