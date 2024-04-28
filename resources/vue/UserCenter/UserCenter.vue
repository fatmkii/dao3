<template>
    <n-flex vertical style="margin-top: 8px;">
        <DndProvider :backend="commonStore.isMobile ? TouchBackend : HTML5Backend">
            <UserCard />
            <n-tabs type="line" :bar-width="commonStore.isMobile ? 0 : undefined" animated
                :size="commonStore.isMobile ? 'small' : 'large'" v-model:value="tabValue">
                <n-tab-pane v-for="tab in tabsList" :name="tab.name" :tab="tab.tab" :key="tab.name">
                    <component :is="tab.component"></component>
                </n-tab-pane>
            </n-tabs>
        </DndProvider>
        <!-- 页面底部留空白 -->
        <div style="height: 50px;"></div>
    </n-flex>
</template>

<script setup lang="ts">

import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { NDivider, NFlex, NTabPane, NTabs, useThemeVars } from 'naive-ui'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DndProvider } from 'vue3-dnd'
import { TabBank, TabChara, TabCommon, TabCustom, TabEmojis, TabIncome, TabLevelup, TabMedal, TabPassword, TabPingbici, UserCard } from './index'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const route = useRoute()
const router = useRouter()
const themeVars = useThemeVars()
const tabValue = ref<string>()

//设置浏览器标题
document.title = '个人中心'

//生成tabs
const tabsList = [
    { name: 'medals', tab: '我的成就', component: TabMedal },
    { name: 'common', tab: '一般设定', component: TabCommon },
    { name: 'pingbici', tab: '屏蔽词', component: TabPingbici },
    { name: 'emojis', tab: '表情包', component: TabEmojis },
    { name: 'chara', tab: '我的角色', component: TabChara },
    { name: 'bank', tab: '我的粮仓', component: TabBank },
    { name: 'income', tab: '收支记录', component: TabIncome },
    { name: 'levelup', tab: '升级饼干', component: TabLevelup },
    { name: 'customBinggan', tab: '定制饼干', component: TabCustom },
    { name: 'password', tab: '密码设定', component: TabPassword },
]







</script>