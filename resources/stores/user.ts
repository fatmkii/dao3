import { computed, ref } from 'vue';
import { defineStore } from 'pinia'
import { useRequest, useFetcher } from 'alova';
import { userDataGetter, type userData } from '@/api/methods/user';

export const useUserStore = defineStore('userStore', () => {

    const userLoginStatus = ref<boolean>(false)

    const binggan = localStorage.getItem('Binggan')
    const token = localStorage.getItem('Token')

    //用户的默认空白数据
    const userDataInit: userData = {
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
        my_emoji: []
    }

    const { loading: userDataLoading, data: userData, onSuccess: userDataOnSuccess, send: getUserData } = useRequest(
        userDataGetter,
        {
            initialData: userDataInit,
            immediate: false,
        }
    );
    // userDataOnSuccess(() => {
    //     userLoginStatus.value = true
    // })

    if (binggan && token) {//Localstorage中有token和饼干才请求用户数据
        userLoginStatus.value = true
        getUserData(binggan)
    }

    //需要强制重新拉取user data时候用
    function refreshUserData() {
        // const { fetch } = useFetcher()
        // fetch(userDataGetter(binggan!))
        getUserData(binggan)
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

    return { userDataLoading, userData, userLoginStatus, binggan, admin, refreshUserData, checkAdminForums }

})

