<template>
    <n-flex vertical style="margin-top: 8px;">
        <AdminCard />
        <n-tabs type="line" :bar-width="commonStore.isMobile ? 0 : undefined" animated
            :size="commonStore.isMobile ? 'small' : 'large'" v-model:value="tabValue">
            <n-tab-pane v-for="tab in tabsList" :name="tab.name" :tab="tab.tab" :key="tab.name">
                <component :is="tab.component"></component>
            </n-tab-pane>
        </n-tabs>
        <!-- 页面底部留空白 -->
        <div style="height: 50px;"></div>
    </n-flex>
</template>

<script setup lang="ts">

import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { NDivider, NFlex, NTabPane, NTabs, useThemeVars } from 'naive-ui'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AdminCard, TabBanners, TabGlobal } from './index'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const route = useRoute()
const router = useRouter()
const themeVars = useThemeVars()
const tabValue = ref<string>()

//生成tabs
const tabsList = computed(() => {
    const arr = [
        { name: 'actives', tab: '管理状况', component: null },
        { name: 'banners', tab: '版头设定', component: TabBanners }
    ]
    if (userStore.admin.isSuperAdmin) {
        return arr.concat([
            { name: 'global', tab: '全局设置', component: TabGlobal },
            { name: 'medals', tab: '发放成就', component: null },
            { name: 'olo', tab: '奖罚olo', component: null },
        ])
    } else {
        return arr
    }
})





</script>