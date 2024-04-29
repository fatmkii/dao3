<template>
    <n-config-provider :theme="themeStore.themeClass" :theme-overrides="themeStore.themeOverrideClass" :locale="zhCN">
        <n-global-style />
        <n-message-provider>
            <MessageApi />
        </n-message-provider>
        <n-dialog-provider>
            <DialogApi />
        </n-dialog-provider>

        <TopBar />
        <router-view></router-view>
        <UnauthModal />
    </n-config-provider>
</template>

<script setup lang="ts">
import { usethemeStore } from '@/stores/theme';
import { useUserStore } from '@/stores/user';
import DialogApi from '@/vue/Components/DialogApi.vue';
import MessageApi from '@/vue/Components/MessageApi.vue';
import TopBar from '@/vue/TopBar/TopBar.vue';
import { NConfigProvider, NDialogProvider, NGlobalStyle, NMessageProvider, useThemeVars, zhCN } from 'naive-ui';
import UnauthModal from './Modals/UnauthModal.vue';
import { useCommonStore } from '@/stores/common';

//加载主题相关的store
const themeStore = usethemeStore()
const themeVars = useThemeVars()
//加载用户信息的store
//如果localstorage没有token或者binggan，实际上不会发起请求，store中是一些默认空白数值
const userStore = useUserStore()

//一般设定的store
const commonStore = useCommonStore()

</script>

<style lang="scss">
.quote_content,
.quote-content {
    color: v-bind('themeVars.textColor3');


}

.quote_content,
.post-span {
    .highlight {
        color: v-bind('themeVars.warningColor');
    }
}

.post-item {
    &.on-focus {
        border-color: v-bind('themeVars.primaryColor');
    }
}

.post-span {
    font-size: v-bind('commonStore.isMobile ? "1.0rem" : "1.0rem"');

    span {
        font-size: v-bind('commonStore.isMobile ? "1.0rem" : "1.0rem"')
    }
}

.post-content {
    overflow-x: hidden;
    overflow-y: hidden;
}

.post-footer {
    margin-top: 0.2rem;
    font-size: v-bind('commonStore.isMobile ? "0.75rem" : "0.875rem"');

    span {
        font-size: v-bind('commonStore.isMobile ? "0.75rem" : "0.875rem"')
    }
}

.post-footer {
    &.system-post .post-nick-name {
        color: v-bind('themeVars.primaryColor')
    }

    &.admin-post .post-nick-name {
        color: v-bind('themeVars.errorColor')
    }

    .post-footer-text {
        color: v-bind('themeVars.textColor3')
    }
}

.unfold-height {
    cursor: pointer;
}

// PostInput组件中使用的
.nickname-input.admin {
    color: v-bind('themeVars.errorColor')
}
</style>