<template>
    <n-flex class="top-bar" :align="'center'">
        <img src="/favicon.png" alt="" @click="$router.push('/')">
        <router-link to="/" v-show="commonStore.showTopbarNav"> 小火锅 </router-link>
        <div id="topbar-nav"></div>
        <div id="topbar-func"></div>
        <n-dropdown :trigger="commonStore.isMobile ? 'click' : 'hover'" :options="themeOptions"
            @select="themeStore.themeChange">
            <img src="https://www.freeimg.cn/i/2024/05/14/664358a7908fe.png" style="margin-left: auto;" class="img-icon">
        </n-dropdown>
        <n-dropdown v-if="userStore.userLoginStatus" :trigger="commonStore.isMobile ? 'click' : 'hover'"
            :options="userOptions">
            <img src="https://www.freeimg.cn/i/2024/05/14/664358a78bca9.png" @mouseenter="refreshUserData"
                class="img-icon">
        </n-dropdown>
        <f-button type="primary" v-if="!userStore.userDataLoading && !userStore.userLoginStatus"
            @click="LoginModalCom?.show">
            导入饼干
        </f-button>
        <template v-if="!userStore.userDataLoading && !userStore.userLoginStatus">
            <LoginModal ref="LoginModalCom" @submit-register="callRegisterHintModal" />
            <RegisterHintModal ref="registerHintModalCom" />
        </template>
    </n-flex>
</template>


<script setup lang="ts">
import { userLogoutPoster } from '@/api/methods/auth';
import { userLogout } from '@/js/func/logout';
import { renderIcon } from '@/js/func/renderIcon';
import { useCommonStore } from '@/stores/common';
import { useThemeStore } from '@/stores/theme';
import { useUserStore } from '@/stores/user';
import LoginModal from '@/vue/TopBar/LoginModal.vue';
import RegisterHintModal from '@/vue/TopBar/RegisterHintModal.vue';
import { FButton, FCheckbox } from '@custom';
import { Circle, Cog as CogIcon } from '@vicons/fa';
import { Shield24Regular as Admin } from '@vicons/fluent';
import { LogOutOutline as LogoutIcon } from '@vicons/ionicons5';
import { NDropdown, NFlex, NText, useThemeVars } from 'naive-ui';
import { computed, h, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const router = useRouter()
const route = useRoute()
const LoginModalCom = ref<InstanceType<typeof LoginModal> | null>(null)
const registerHintModalCom = ref<InstanceType<typeof RegisterHintModal> | null>(null)

//主题相关
const themeStore = useThemeStore()
const themeVars = useThemeVars()
const themeOptions = [
    { label: '白汤锅', key: 'light', icon: renderIcon(Circle, { color: "#F9F9F9" }) },
    { label: '芝麻锅', key: 'dark', icon: renderIcon(Circle, { color: "#101014" }) },
    { label: '青菜锅', key: 'green', icon: renderIcon(Circle, { color: "#53A551" }) },
    { type: 'render', key: 'monochrome', render: renderOptions },
]
//皮肤选项下拉框的下面部分
function renderOptions() {
    return h(
        NFlex,
        {
            style: 'padding:6px 8px',
            vertical: true,
        },
        () => [
            h(FCheckbox, {
                checked: commonStore.userCustom.monochromeMode,
                'onUpdate:checked': (value: boolean) => commonStore.userCustom.monochromeMode = value,
                label: '单色模式'
            })
        ]
    )
}

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
                        src: 'https://www.freeimg.cn/i/2024/05/14/664358a77ebfb.png'
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
                        src: 'https://www.freeimg.cn/i/2024/05/14/664358a770549.png'
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
const userOptions = computed(() => {
    const arr = [
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

    //如果是管理员，则加入管理中新选项
    if (userStore.admin.isForumAdmin) {
        arr.splice(3, 0, {
            label: '管理中心',
            key: 'admin',
            icon: renderIcon(Admin, { size: '1.25rem' }),
            props: {
                onClick: () => router.push('/admin-center')
            }
        })
    }

    return arr
})

//登出操作
function logoutHandle() {
    const dialogArgs = {
        title: '退出饼干',
        closable: false,
        content: `确定要退出饼干吗？请务必先记下自己的饼干喔。`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            userLogoutPoster(userStore.binggan!).then(() => {
                userLogout()
                window.location.href = "/"; //因为希望重头刷新整个程序状态，所以用js原生的重定向，而不是Vuerouter的push
            })
        },
    }
    window.$dialog.warning(dialogArgs)
}

//鼠标hover（mouseenter事件）时刷新user data（主要是刷新olo）
function refreshUserData() {
    userStore.refreshUserData()
}

//呼出申请饼干成功的提示modal
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

    .img-icon {
        border-radius: 40%;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.3);
        /* 水平偏移 垂直偏移 模糊半径 阴影颜色 */
    }

    .forum-tag {
        cursor: pointer;
    }
}
</style>