
<template>
    <n-flex align="center" style="padding: 8px;" class="top-bar">
        <img src="/favicon2.png" alt="" style="max-height: 32px;height: 100%; cursor: pointer;" @click="$router.push('/')">
        <router-link to="/"> 小火锅 </router-link>
        <n-button @click="handleTest">测试</n-button>
        <n-dropdown trigger="hover" :options="themeOptions" @select="themeStore.themeChange">
            <n-button style="margin-left: auto;">皮肤</n-button>
        </n-dropdown>
        <n-dropdown v-if="userStore.userLoginStatus" trigger="hover" :options="userOptions">
            <img src="https://oss.cpttmm.com/xhg_other/icon_binggan.png" alt="我的饼干"
                style="max-height: 34px;cursor: pointer;" @mouseenter="refreshUserData">
        </n-dropdown>

        <n-button v-bind="themeStore.buttonThemeAttr" type="primary" v-if="!userStore.userLoginStatus"
            @click="loginModal?.show"> 导入饼干
        </n-button>

        <LoginModal ref="loginModal" />
    </n-flex>
</template>
 

<script setup lang="ts">
import { userLogoutPoster } from '@/api/methods/auth';
import { userLogout } from '@/js/func/logout';
import { usethemeStore } from '@/stores/theme';
import { useUserStore } from '@/stores/user';
import LoginModal from '@/vue/modals/LoginModal.vue';
import { Cog as CogIcon } from '@vicons/fa';
import { LogOutOutline as LogoutIcon } from '@vicons/ionicons5';
import { useRequest } from 'alova';
import { NButton, NDropdown, NFlex, NIcon, NText, useThemeVars } from 'naive-ui';
import type { Component } from 'vue';
import { h, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';


//基础数据
const userStore = useUserStore()

//主题相关
const themeStore = usethemeStore()
const themeVars = useThemeVars()
const themeOptions = [
    { label: '浅色', key: 'light' },
    { label: '深色', key: 'dark' },
    { label: 'Hdao', key: 'green' },
]


//个人中心按钮相关
const renderIcon = (icon: Component) => {
    return () => {
        return h(NIcon, { size: '1.25rem' }, {
            default: () => h(icon)
        })
    }
}
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
        icon: renderIcon(CogIcon)
    },
    {
        label: '退出饼干',
        key: 'logout',
        icon: renderIcon(LogoutIcon),
        props: {
            onClick: logoutHandle
        }
    }
]



//登录modal
const loginModal = ref<InstanceType<typeof LoginModal> | null>(null)

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


onMounted(() => {
    const route = useRoute();
    if (!(localStorage.getItem('Binggan') && localStorage.getItem('Token')) && route.path == '/') {
        //当没有localstorage没有登录信息，且路由在首页时，自动弹出登录modal
        loginModal.value?.show()
    }
})



function handleTest() {
    userStore.refreshUserData()
}

</script>

<style scoped>
.top-bar {
    color: v-bind('themeVars.textColor1');
    background-color: v-bind('themeVars.cardColor');
    border-bottom-color: v-bind('themeVars.dividerColor');
    border-bottom-style: solid;
    border-bottom-width: 1px;
}

a {
    color: v-bind('themeVars.textColor1');
    font-size: 1.25rem;
}

</style>