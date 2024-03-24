<template>
    <n-flex class="top-bar" :align="'center'">
        <img src="/favicon.png" alt="" @click="$router.push('/')">
        <router-link to="/" v-show="commonStore.showTopbarNav"> 小火锅 </router-link>
        <div id="topbar-nav"></div>
        <div id="topbar-func"></div>
        <template v-if="!userStore.userDataLoading">
            <n-dropdown trigger="hover" :options="themeOptions" @select="themeStore.themeChange">
                <img src="https://oss.cpttmm.com/xhg_other/icon_binggan_lv.png" style="margin-left: auto;">
            </n-dropdown>
            <n-dropdown v-if="userStore.userLoginStatus" trigger="hover" :options="userOptions">
                <img src="https://oss.cpttmm.com/xhg_other/icon_binggan.png" @mouseenter="refreshUserData">
            </n-dropdown>
            <f-button type="primary" v-if="!userStore.userLoginStatus" @click="LoginModalCom?.show">
                导入饼干
            </f-button>
        </template>
        <template v-if="!userStore.userDataLoading && !userStore.userLoginStatus">
            <LoginModal ref="LoginModalCom" @submit-register="callRegisterHintModal" />
            <RegisterHintModal ref="registerHintModalCom" />
        </template>
    </n-flex>
</template>


<script setup lang="ts">
import { userLogoutPoster } from '@/api/methods/auth';
import { userLogout } from '@/js/func/logout';
import { useCommonStore } from '@/stores/common';
import { usethemeStore } from '@/stores/theme';
import { useUserStore } from '@/stores/user';
import { renderIcon } from '@/js/func/renderIcon'
import { Cog as CogIcon, Circle } from '@vicons/fa';
import { LogOutOutline as LogoutIcon } from '@vicons/ionicons5';
import { useRequest } from 'alova';
import { NDropdown, NFlex, NText, useThemeVars } from 'naive-ui';
import { h, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FButton } from '@custom';
import { defineAsyncComponent } from 'vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const router = useRouter()
const route = useRoute()

//主题相关
const themeStore = usethemeStore()
const themeVars = useThemeVars()
const themeOptions = [
    { label: '白汤锅', key: 'light', icon: renderIcon(Circle, { color: "#F9F9F9" }) },
    { label: '芝麻锅', key: 'dark', icon: renderIcon(Circle, { color: "#101014" }) },
    { label: '青菜锅', key: 'green', icon: renderIcon(Circle, { color: "#53A551" }) },
]

//登录modal
const LoginModal = defineAsyncComponent(() =>
    import('@/vue/TopBar/LoginModal.vue')
)
const LoginModalCom = ref<InstanceType<typeof LoginModal> | null>(null)


//个人中心按钮相关
function renderCustomHeader() {
    return h(
        NFlex,
        {
            vertical: true,
        },
        () => [
            h('div', { style: 'display: flex; align-items: center; padding: 4px 8px;' },
                [
                    h('img', {
                        style: 'max-height: 40px;',
                        src: 'https://oss.cpttmm.com/xhg_other/icon_binggan.png'
                    }),
                    h('div', null, [
                        h('div', null, [h(NText, { depth: 3 }, { default: () => '我的饼干' })]),
                        h('div', { style: 'font-size: 1rem;' }, [
                            h(
                                NText,
                                { depth: 2 },
                                { default: () => userStore.binggan }
                            )
                        ])
                    ])
                ]
            ),
            h('div', { style: 'display: flex; align-items: center; padding: 4px 8px;' },
                [
                    h('img', {
                        style: 'max-height: 40px;',
                        src: 'https://oss.cpttmm.com/xhg_other/icon_olo.png'
                    }),
                    h('div', null, [
                        h('div', null, [h(NText, { depth: 3 }, { default: () => '奥利奥' })]),
                        h('div', { style: 'font-size: 1rem;' }, [
                            h(
                                NText,
                                { depth: 2 },
                                { default: () => userStore.userData.binggan.coin }
                            )
                        ])
                    ])
                ]
            )]
    )
}
const userOptions = [
    {
        key: 'header',
        type: 'render',
        render: renderCustomHeader
    },
    {
        key: 'header-divider',
        type: 'divider'
    },
    {
        label: '个人中心',
        key: 'profile',
        icon: renderIcon(CogIcon, { size: '1.25rem' }),
        props: {
            onClick: () => router.push('/user-center')
        }
    },
    {
        label: '退出饼干',
        key: 'logout',
        icon: renderIcon(LogoutIcon, { size: '1.25rem' }),
        props: {
            onClick: logoutHandle
        }
    }
]

//登出操作
function logoutHandle() {
    const { onSuccess, data } = useRequest(userLogoutPoster(userStore.binggan!))
    onSuccess(() => {
        userLogout()
        window.location.href = "/"; //因为希望重头刷新整个程序状态，所以用js原生的重定向，而不是Vuerouter的push
    })
}

//鼠标hover（mouseenter事件）时刷新user data（主要是刷新olo）
function refreshUserData() {
    userStore.refreshUserData()
}

//呼出申请饼干成功的提示modal
const RegisterHintModal = defineAsyncComponent(() =>
    import('@/vue/TopBar/RegisterHintModal.vue')
)
const registerHintModalCom = ref<InstanceType<typeof RegisterHintModal> | null>(null)
function callRegisterHintModal() {
    registerHintModalCom.value?.show()
}


onMounted(() => {
    if (!(localStorage.getItem('Binggan') && localStorage.getItem('Token')) && route.path == '/') {
        //当没有localstorage没有登录信息，且路由在首页时，自动弹出登录modal
        LoginModalCom.value?.show()
    }
})

</script>

<style lang="scss">
.top-bar {
    color: v-bind('themeVars.textColor1');
    background-color: v-bind('themeStore.themeColor.topBarBackgroudColor');
    border-bottom-color: v-bind('themeVars.dividerColor');
    border-bottom-style: solid;
    border-bottom-width: 1px;
    z-index: 10;
    border-radius: 10px;

    @media all and (min-width: 1200px) {
        height: 34px;
        padding: 8px;
        font-size: 1.25rem;
    }

    @media not all and (min-width: 1200px) {
        height: 28px;
        padding: 6px;
        font-size: 1rem;
    }

    a {
        color: v-bind('themeVars.textColor1');
    }

    img {
        height: 100%;
        cursor: pointer;
    }

    .forum-tag {
        cursor: pointer;
    }
}
</style>