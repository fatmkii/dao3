<template>
    <n-flex size="small" vertical v-if="!battleDataLoading">
        <n-card size="small" :bordered="true" embedded class="battle-card">
            <n-flex vertical>
                {{ battleData }}
            </n-flex>
        </n-card>
        <!-- 下方挑战按钮 -->
        <n-flex size="small" :wrap="false">

        </n-flex>
    </n-flex>
    <!-- 做个骨架屏? -->
</template>

<script setup lang="ts">
import getNewPostKey from '@/js/func/getNewPostKey'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { FButton, FInput } from '@/vue/Custom'
import { NCard, NFlex, NText, useThemeVars } from 'naive-ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { battleDataGetter } from '@/api/methods/battle'
import { invalidateCache, useRequest } from 'alova'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const router = useRouter()
const themeVars = useThemeVars()

//组件props
interface Props {
    battleId: number,
}
const props = withDefaults(defineProps<Props>(), {
})


//用户输入 


//注册事件
const emit = defineEmits<{
    refreshPostsList: [],
}>()

//获取大乱斗数据
const { data: battleData,
    loading: battleDataLoading,
    onSuccess: battleDataOnSuccess } = useRequest(battleDataGetter(props.battleId))
battleDataOnSuccess((event) => {
    if (event.data.battle.result === 0) {
        //如果大乱斗处于未结束状态，则马上失效其缓存。
        invalidateCache({ name: 'battleDataGetter-' + event.data.battle.id, })
    }
})


</script>

<style scoped>
.battle-card {
    max-width: 600px;
}
</style>