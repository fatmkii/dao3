<script setup lang="ts">
import { NFlex, NIcon, NPopover, NText } from 'naive-ui'
import { ArrowCircleLeft48Regular as Back } from '@vicons/fluent'
import { useCommonStore } from '@/stores/common'
import Pagination from '@/vue/Components/Pagination.vue'

defineProps<{ threadId: number; lastPage?: number }>()
const page = defineModel<number>('page', { required: true })
const commonStore = useCommonStore()
</script>

<template>
    <n-flex align="center" style="margin-top: 8px;"
        :style="{ paddingRight: commonStore.isMobile ? '24px' : '0px' }">
        <n-popover placement="bottom-start" trigger="hover">
            <template #trigger>
                <router-link :to="{ name: 'thread', params: { threadId } }"
                    class="flex-item-center return-thread-link" aria-label="返回主题">
                    <n-icon :size="34" style="cursor: pointer;">
                        <Back />
                    </n-icon>
                </router-link>
            </template>
            <n-text>返回主题</n-text>
        </n-popover>
        <Pagination v-if="lastPage !== undefined" v-model:page="page" :last-page="lastPage"
            style="margin-left: auto;" />
    </n-flex>
</template>

<style scoped>
.return-thread-link { color: inherit; }
</style>
