<template>
    <n-card hoverable size="small">
        <n-flex :vertical="commonStore.isMobile">
            <n-flex size="small" :align="'center'">
                <img src="https://ll4484.bvimg.com/21501/f332ae15bee8da0e.png"
                    style="max-width: 50px;max-height: 50px;">
                <span>管理员中心</span>
            </n-flex>
            <div>
                <n-text :depth="3">我管理的板块</n-text>
                <n-flex>
                    <n-tag v-for="forum in adminForumsOptions">{{ forum.forumId }}. {{ forum.label }}</n-tag>
                </n-flex>
            </div>
        </n-flex>
    </n-card>
</template>

<script setup lang="ts">

import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { NCard, NFlex, NTag, NText } from 'naive-ui'
import { computed } from 'vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()

//管理的板块options
const adminForumsOptions = computed(() => {
    if (userStore.binggan === null || userStore.userData.binggan.admin_forums === undefined) {
        return []
    }
    return forumsStore.forumsData.reduce((accumulator, currentItem) => {
        if (userStore.checkAdminForums(currentItem.id)) {
            accumulator.push({ value: currentItem.id, label: currentItem.name, forumId: currentItem.id })
        }
        return accumulator
    }, [] as { value: number, label: string, forumId: number }[])

})


</script>