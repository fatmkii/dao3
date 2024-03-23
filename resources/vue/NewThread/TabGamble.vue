<template>
    <n-checkbox :checked="threadType" checked-value="gamble" unchecked-value="normal"
        @click="emit('threadTypeChange', 'gamble')">
        开启菠菜（500奥利奥） 目前只能在海滨乐园岛开菠菜（避免被日清）
    </n-checkbox>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { usethemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { NCheckbox } from 'naive-ui'
import type { threadType } from './'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const themeStore = usethemeStore()
const router = useRouter()


//组件props
interface Props {
    threadType: string
}
const props = withDefaults(defineProps<Props>(), {
    threadType: 'normal'
})

//手动触发checkbox的更新事件
const emit = defineEmits<{
    threadTypeChange: [type: threadType]
}>()

</script>