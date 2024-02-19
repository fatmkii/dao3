<template>
    <n-flex vertical style="margin-top: 8px;">
        <UserCard />
        <n-divider style="margin-top: 0px;margin-bottom: 0px;"></n-divider>
        <n-tabs type="line" :bar-width="0" animated :size="commonStore.isMobile ? 'small' : 'medium'"
            v-model:value="tabValue">
            <n-tab-pane v-for="tab in tabsList" :name="tab.name" :tab="tab.tab" :key="tab.name">
                <component :is="tab.component"></component>
            </n-tab-pane>
        </n-tabs>
    </n-flex>
</template>

<script setup lang="ts">

import { useLocalStorageToRef } from '@/js/func/localStorageToRef'
import { useTopbarNavControl } from '@/js/func/topbarNav'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { FButton, FCheckbox, FInput } from '@custom'
import { SearchOutline as SearchIcon } from '@vicons/ionicons5'
import { useFetcher, useRequest, useWatcher } from 'alova'
import { NTabs, NTabPane, NDivider, NCard, NDropdown, NEllipsis, NFlex, NIcon, NSkeleton, NSwitch, NTag, NAlert, NText, useThemeVars } from 'naive-ui'
import { computed, h, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TabBank, TabChara, TabCommon, TabCustom, TabEmojis, TabIncome, TabLevelup, TabMedal, TabPassword, TabPingbici, UserCard } from './index'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const route = useRoute()
const router = useRouter()
const themeVars = useThemeVars()
const tabValue = ref<string>()

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