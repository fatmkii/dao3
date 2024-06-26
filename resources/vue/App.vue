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
        <router-view v-slot="{ Component }">
            <KeepAlive include="ThreadPage,NewThread">
                <component :is="Component" />
            </KeepAlive>
        </router-view>
        <UnauthModal />
    </n-config-provider>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { useThemeStore } from '@/stores/theme';
import { useUserStore } from '@/stores/user';
import DialogApi from '@/vue/Components/DialogApi.vue';
import MessageApi from '@/vue/Components/MessageApi.vue';
import TopBar from '@/vue/TopBar/TopBar.vue';
import { NConfigProvider, NDialogProvider, NGlobalStyle, NMessageProvider, useThemeVars, zhCN } from 'naive-ui';
import UnauthModal from './Modals/UnauthModal.vue';
import { computed } from 'vue';

//加载主题相关的store
const themeStore = useThemeStore()
const themeVars = useThemeVars()
//加载用户信息的store
//如果localstorage没有token或者binggan，实际上不会发起请求，store中是一些默认空白数值
const userStore = useUserStore()

//一般设定的store
const commonStore = useCommonStore()

//表情包背景色
const emojiBackGroundColor = computed(() =>
    commonStore.userCustom.emojiWhiteBack ? '#FFFFFF' : undefined,
)

</script>

<style lang="scss">
.quote_content,
.quote-content {
    font-size: v-bind('commonStore.userCustom.fontSizeQuote + "px"');
    color: v-bind('themeVars.textColor3');
}

.quote_content,
.post-span {
    .highlight {
        color: v-bind('themeVars.warningColor');
    }
}

.post-content {
    overflow-x: hidden;
    overflow-y: hidden;
}

.post-footer {

    &.system-post .post-nick-name {
        color: v-bind('themeVars.primaryColor')
    }

    &.admin-post .post-nick-name {
        color: v-bind('themeVars.errorColor')
    }

    .post-footer-text {
        color: v-bind('themeStore.themeColor.postFooterColor')
    }

    .post-created-at {
        color: v-bind('themeStore.themeColor.postFooterColor')
    }
}

.post-item.card {
    &.on-focus {
        border-color: v-bind('themeVars.primaryColor');
    }
}

.unfold-height {
    cursor: pointer;
}

// PostInput组件中使用的
.nickname-input.admin {
    color: v-bind('themeVars.errorColor')
}

.thread-title-container {
    border-radius: 10px;
}

.thread-title-skeleton {
    border-radius: 10px;
    height: 48px;
}

//emoji相关
.emoji-box {
    width: 48px;
    height: 48px;
}

.emoji-in-box {
    background-color: v-bind(emojiBackGroundColor);
    max-width: 48px;
    max-height: 48px;
}

.emoji-img,
.emoji_img,
.custom-emoji-img,
.custom_emoji_img {
    //旧2.0数据是下划线
    background-color: v-bind(emojiBackGroundColor);
    max-width: 60px;
    max-height: 60px;
}

.emoji-container {
    max-height: 250px;
    overflow-y: auto;
}
</style>