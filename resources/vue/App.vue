
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
import TopBar from '@/vue/TopBar/TopBar.vue';
import UnauthModal from './modals/UnauthModal.vue';
import MessageApi from '@/vue/components/MessageApi.vue';
import DialogApi from '@/vue/components/DialogApi.vue'
import { NConfigProvider, NMessageProvider, NGlobalStyle, NDialogProvider, zhCN } from 'naive-ui'
import { usethemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user';

//加载主题相关的store
const themeStore = usethemeStore()

//加载用户信息的store
//如果localstorage没有token或者binggan，实际上不会发起请求，store中是一些默认空白数值
const userStore = useUserStore()

</script>
