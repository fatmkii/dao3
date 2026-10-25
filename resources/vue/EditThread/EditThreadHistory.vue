<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NAlert, NCard, NFlex, NSpin } from 'naive-ui'
import { editThreadHistoryGetter, type FirstPostHistory } from '@/api/methods/editThread'
import { useCommonStore } from '@/stores/common'
import { FButton } from '@/vue/Custom'
import EditThreadHistoryItem from './EditThreadHistoryItem.vue'
import EditThreadNavigation from './EditThreadNavigation.vue'

const props = defineProps<{ threadId: number }>()
const route = useRoute()
const router = useRouter()
const commonStore = useCommonStore()
const context = ref<FirstPostHistory | null>(null)
const loading = ref(true)
const error = ref('')
const page = computed({
    get: () => Math.max(1, Number.parseInt(String(route.query.page ?? 1), 10) || 1),
    set: value => { void router.push({ query: { page: value } }) },
})
let loadId = 0
watch([() => props.threadId, page], async ([threadId, currentPage]) => {
    const id = ++loadId
    loading.value = true
    context.value = null
    error.value = ''
    try {
        const result = await editThreadHistoryGetter(threadId, currentPage)
        if (id !== loadId) return
        context.value = result
        document.title = '（修改历史）' + result.thread_data.title
    } catch (cause) {
        if (id === loadId) error.value = cause instanceof Error ? cause.message : '读取失败，请刷新重试'
    } finally {
        if (id === loadId) loading.value = false
    }
}, { immediate: true })
const watermarkStyle = computed(() => ({
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><text x="75" y="75" text-anchor="middle" fill="rgb(150,150,150)" opacity="0.01" transform="rotate(-45,75,75)">${context.value?.watermark_string ?? ''}</text></svg>`)}")`,
}))
</script>

<template>
    <n-flex vertical>
        <EditThreadNavigation v-model:page="page" :thread-id="threadId" :last-page="context?.pagination.lastPage" />
        <n-spin v-if="loading" />
        <n-alert v-else-if="error" type="error">{{ error }}</n-alert>
        <template v-else-if="context">
            <n-card class="thread-title-container" size="small">
                <span class="thread-title" :style="{ fontSize: commonStore.userCustom.fontSizeThreadList + 'px' }">（修改历史）{{ context.thread_data.title }}</span>
            </n-card>
            <n-alert v-if="context.first_post.is_deleted !== 0" type="warning">首楼已删除，历史仅作者及有权限管理员可见。</n-alert>
            <EditThreadHistoryItem v-for="revision in context.versions" :key="revision.version" :revision="revision" :context="context" />
            <EditThreadNavigation v-model:page="page" :thread-id="threadId" :last-page="context.pagination.lastPage" />
            <n-flex>
                <f-button type="primary"
                    @click="router.push({ name: 'thread', params: { threadId } })">返回主题</f-button>
            </n-flex>
            <div class="history-watermark" :style="watermarkStyle" aria-hidden="true"></div>
        </template>
    </n-flex>
</template>

<style scoped>
.history-watermark { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-repeat: repeat; }
</style>
