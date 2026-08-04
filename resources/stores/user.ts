import { computed, shallowRef } from 'vue';
import { defineStore } from 'pinia'
import { useRequest } from 'alova';
import { myEmojiDataGetter, userDataGetter, type myEmojiData, type userData, type userDataResponse } from '@/api/methods/user';
import { readMyEmojiCache, writeMyEmojiCache } from '@/js/func/myEmojiCache';
import { getAccessToken, getBinggan } from '@/js/androidAuth';

export const useUserStore = defineStore('userStore', () => {

    const userLoginStatus = shallowRef<boolean>(false)

    const binggan = getBinggan()
    const token = getAccessToken()

    // 表情包是可能达到30k字符的大字段，独立于普通用户数据保存和更新。
    // shallowRef只在替换整个数组时触发更新，避免为大量URL创建深层响应式代理。
    const cachedMyEmoji = binggan ? readMyEmojiCache(binggan) : null
    const myEmoji = shallowRef<string[]>(cachedMyEmoji?.emojis ?? [])
    const myEmojiVersion = shallowRef<string | null>(cachedMyEmoji?.version ?? null)
    // 缓存中的空数组也是有效数据，因此不能用数组长度判断是否已经准备完成。
    const myEmojiReady = shallowRef(cachedMyEmoji !== null)
    const myEmojiLoading = shallowRef(false)

    // /user/show在版本模式下不包含my_emoji，这里只保存接口直接返回的普通用户数据。
    const userDataInit: userDataResponse = {
        binggan: {
            nickname: "= =",
            coin: 0,
            coin_in_bank: 0,
            use_pingbici: false,
            new_msg: false,
            user_lv: 0,
            locked_ttl: 0,
        },
        my_battle_chara: [],
        emoji_excluded: [],
        pingbici: {
            content_pingbici: [],
            fjf_pingbici: [],
            title_pingbici: [],
        },
        my_emoji_version: null,
    }

    const {
        loading: userDataRequestLoading,
        data: rawUserData,
        onSuccess: userDataOnSuccess,
        send: getUserData,
    } = useRequest(
        userDataGetter,
        {
            initialData: userDataInit,
            immediate: false,
        }
    );

    // 对组件维持原有userData.my_emoji接口，组件不需要了解数据来自接口还是localStorage。
    const userData = computed<userData>(() => ({
        ...rawUserData.value,
        my_emoji: myEmoji.value,
    }))
    // 首次没有缓存时，完整表情包下载完成前仍视为用户数据加载中。
    const userDataLoading = computed(() => userDataRequestLoading.value || myEmojiLoading.value)

    // 页面初始化和手动刷新可能同时触发版本检查，共用同一个完整数据请求。
    let pendingMyEmojiRequest: Promise<void> | null = null

    function storeMyEmoji(data: myEmojiData) {
        // 先同步内存中的数据和版本，再持久化；localStorage失败也不影响当前页面。
        myEmoji.value = data.my_emoji
        myEmojiVersion.value = data.my_emoji_version
        myEmojiReady.value = true

        if (binggan) {
            writeMyEmojiCache(binggan, {
                version: data.my_emoji_version,
                emojis: data.my_emoji,
            })
        }
    }

    async function fetchLatestMyEmoji() {
        // 已有请求进行中时直接复用，避免重复下载最多30k字符的数据。
        if (pendingMyEmojiRequest) return pendingMyEmojiRequest

        myEmojiLoading.value = true
        pendingMyEmojiRequest = myEmojiDataGetter()
            .send()
            .then(storeMyEmoji)
            .finally(() => {
                myEmojiLoading.value = false
                pendingMyEmojiRequest = null
            })

        return pendingMyEmojiRequest
    }

    userDataOnSuccess((event) => {
        // 兼容尚未支持版本模式的旧后端：如果响应仍带完整数据，就直接使用并缓存。
        if (Array.isArray(event.data.my_emoji)) {
            storeMyEmoji({
                my_emoji_version: event.data.my_emoji_version ?? null,
                my_emoji: event.data.my_emoji,
            })
            return
        }

        // 本地存在同版本缓存时无需请求完整表情包；null版本同样可以表示有效的空表情包。
        const serverVersion = event.data.my_emoji_version ?? null
        if (myEmojiReady.value && myEmojiVersion.value === serverVersion) return

        // 请求错误由Alova统一提示；这里保留旧缓存，并等待下次刷新再次比较版本。
        void fetchLatestMyEmoji().catch(() => undefined)
    })

    if (binggan && token) {//Localstorage中有token和饼干才请求用户数据
        userLoginStatus.value = true
        // 常规刷新只获取表情包版本，完整数据由上面的版本比较逻辑按需下载。
        getUserData(binggan, true)
    }

    //需要强制重新拉取user data时候用
    function refreshUserData() {
        // 手动刷新同样只获取版本号，避免反复传输完整表情包。
        getUserData(binggan, true)
    }

    //检查是否具有某个版面的管理员权限
    function checkAdminForums(forumId: number | undefined) {
        if (forumId === undefined ||
            userDataLoading.value ||
            userData.value.binggan.admin_forums === undefined
        ) {
            return false
        } else {
            return userData.value.binggan.admin_forums.includes(forumId)
        }
    }

    //快速获取管理员状态
    const admin = computed(() => {
        const adminLevel = userData.value.binggan.admin ?? 0
        return {
            isForumAdmin: adminLevel >= 1,
            isNormalAdmin: adminLevel >= 10,
            isSeniorAdmin: adminLevel >= 20,
            isSuperAdmin: adminLevel >= 99,
        }
    })

    return { userDataLoading, userData, userLoginStatus, myEmojiReady, binggan, admin, refreshUserData, checkAdminForums }

})
