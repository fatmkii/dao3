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
import { useUserStore } from '@/stores/user'
import { NFlex, NTabPane, NTabs } from 'naive-ui'
import { computed, ref } from 'vue'
import { AdminCard, TabActives, TabActivesSuper, TabBanners, TabGlobal, TabSuperAdmin } from './index'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const tabValue = ref<string>()

//设置浏览器标题
document.title = '管理员中心'

//生成tabs
const tabsList = computed(() => {
    const arr = [
        { name: 'banners', tab: '版头设定', component: TabBanners }
    ]
    if (userStore.admin.isNormalAdmin) {
        arr.unshift(
            { name: 'actives', tab: '管理状况', component: TabActives },
        )
    }
    if (userStore.admin.isSuperAdmin) {
        return arr.concat([
            { name: 'global', tab: '全局设置', component: TabGlobal },
            { name: 'super_actives', tab: '超管状况', component: TabActivesSuper },
            { name: 'super_admin', tab: '超管操作', component: TabSuperAdmin },
        ])
    } else {
        return arr
    }
})


</script>