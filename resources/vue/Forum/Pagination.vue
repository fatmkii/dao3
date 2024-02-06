<template>
    <n-pagination v-model:page="page" :page-count="lastPage" :size="commonStore.isMobile ? 'small' : 'medium'" show-quick-jumper
        :page-slot="6" :simple="commonStore.isMobile ? true : false"
        :display-order="['quick-jumper', 'pages', 'size-picker']">
        <template #goto>跳
        </template>
        <template #prefix v-if="commonStore.isMobile">
            <div class="n-pagination-item n-pagination-item--button" :class="{ 'n-pagination-item--disabled': page == 1 }">
                <n-icon :size="14">
                    <PlaySkipBackOutline @click="page = 1" />
                </n-icon>
            </div>
        </template>
        <template #suffix v-if="commonStore.isMobile">
            <div class="n-pagination-item n-pagination-item--button"
                :class="{ 'n-pagination-item--disabled': page == lastPage }">
                <n-icon :size="14">
                    <PlaySkipForwardOutline @click="page = lastPage" />
                </n-icon>
            </div>
        </template>
    </n-pagination>
</template>

<script lang="ts" setup>
import { NPagination, NIcon } from 'naive-ui'
import { PlaySkipForwardOutline, PlaySkipBackOutline } from '@vicons/ionicons5'
import { useCommonStore } from '@/stores/common'

//基础数据
const commonStore = useCommonStore()

//组件props
interface Props {
    pageSizes?: number
    lastPage: number
}
const props = withDefaults(defineProps<Props>(), {
    pageSizes: 50
})
const page = defineModel<number>('page')


</script>