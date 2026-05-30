<script setup lang="ts">
import {
    getAccuseDemoList,
    type AccuseAction,
    type AccuseCreateParams,
    type AccuseItemData,
} from '@/api/methods/accuse'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import Pagination from '@/vue/Components/Pagination.vue'
import { FlagOutline } from '@vicons/ionicons5'
import { NEmpty, NFlex, NIcon, NSwitch, NText } from 'naive-ui'
import { computed, nextTick, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AccuseCreateModal from './AccuseCreateModal.vue'
import AccuseHandleModal from './AccuseHandleModal.vue'
import AccuseItem from './AccuseItem.vue'

const commonStore = useCommonStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const items = ref<AccuseItemData[]>(getAccuseDemoList())
const showPendingOnly = shallowRef(false)
const pageSelected = shallowRef(1)
const pageSize = 10
const createModalCom = ref<InstanceType<typeof AccuseCreateModal> | null>(null)
const handleModalCom = ref<InstanceType<typeof AccuseHandleModal> | null>(null)
const currentUserReportedPostIds = ref<Set<number>>(new Set())

const isAdminView = computed(() => userStore.admin.isForumAdmin || import.meta.env.DEV)
const filteredItems = computed(() => {
    const list = showPendingOnly.value
        ? items.value.filter(item => item.status === 'pending')
        : items.value

    return [...list].sort((a, b) => b.id - a.id)
})
const lastPage = computed(() => Math.max(1, Math.ceil(filteredItems.value.length / pageSize)))
const pagedItems = computed(() => {
    const start = (pageSelected.value - 1) * pageSize
    return filteredItems.value.slice(start, start + pageSize)
})
const pendingCount = computed(() => items.value.filter(item => item.status === 'pending').length)

watch(showPendingOnly, () => {
    pageSelected.value = 1
})

watch(
    () => route.fullPath,
    async () => {
        const payload = parseRoutePayload()
        if (payload) {
            await nextTick()
            createModalCom.value?.show(payload)
        }
    },
    { immediate: true },
)

function parseRoutePayload(): Omit<AccuseCreateParams, 'reason'> | null {
    const threadId = Number(route.query.thread_id)
    const postId = Number(route.query.post_id)
    const floor = Number(route.query.floor)

    if (!Number.isInteger(threadId) || threadId <= 0) {
        return null
    }
    if (!Number.isInteger(postId) || postId <= 0) {
        return null
    }
    if (!Number.isInteger(floor) || floor < 0) {
        return null
    }

    return {
        thread_id: threadId,
        post_id: postId,
        floor,
    }
}

function cleanQuery() {
    if (route.query.thread_id || route.query.post_id || route.query.floor) {
        router.replace({ name: 'accuse' })
    }
}

function handleCreateAccuse(params: AccuseCreateParams) {
    if (currentUserReportedPostIds.value.has(params.post_id)) {
        window.$message.error('你已经举报过这个回复了')
        cleanQuery()
        return
    }

    const existing = items.value.find(item => item.post_id === params.post_id)
    if (existing) {
        existing.reasons.push({
            id: Date.now(),
            content: params.reason,
            created_at: new Date().toLocaleString('zh-CN', { hour12: false }),
            reporter_recent_count: 1,
        })
        existing.status = 'pending'
        existing.handle_action = undefined
        existing.handle_note = undefined
        existing.handle_reduce_olo = false
        existing.handled_at = undefined
        existing.handled_by = undefined
    } else {
        items.value.unshift({
            id: Math.max(...items.value.map(item => item.id), 100) + 1,
            thread_id: params.thread_id,
            post_id: params.post_id,
            floor: params.floor,
            thread_title: `主题 ${params.thread_id}`,
            status: 'pending',
            created_at: new Date().toLocaleString('zh-CN', { hour12: false }),
            reasons: [{
                id: Date.now(),
                content: params.reason,
                created_at: new Date().toLocaleString('zh-CN', { hour12: false }),
                reporter_recent_count: 1,
            }],
            target_recent_count: 1,
            uncertain: false,
            handle_reduce_olo: false,
        })
    }

    currentUserReportedPostIds.value = new Set([...currentUserReportedPostIds.value, params.post_id])
    pageSelected.value = 1
    window.$message.success('举报已提交')
    cleanQuery()
}

function handleAccuseAction(payload: { id: number, action: AccuseAction, floor: number }) {
    const item = items.value.find(current => current.id === payload.id)
    if (!item) {
        return
    }

    const actionLabels: Record<AccuseAction, string> = {
        hint: '提示',
        ignore: '忽略',
        delete: '删帖',
        deleteAll: '删全',
        lock: '锁定饼干',
        ban: '封禁饼干',
    }

    if (payload.action === 'hint') {
        window.$dialog.info({
            title: actionLabels[payload.action],
            content: `此饼干状态：正常。近7天被举报 ${item.target_recent_count} 次。（前端 demo）`,
            positiveText: '确定',
        })
        return
    }

    if (payload.action === 'ignore') {
        window.$dialog.warning({
            title: actionLabels[payload.action],
            content: `确认要忽略 №${item.floor} 这条举报吗？`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => {
                commitHandle({
                    id: payload.id,
                    action: payload.action,
                    reason: '忽略',
                    reduceOlo: false,
                })
            },
        })
        return
    }

    handleModalCom.value?.show({
        id: payload.id,
        action: payload.action,
        floor: payload.floor,
    })
}

function commitHandle(payload: { id: number, action: AccuseAction, reason: string, reduceOlo: boolean }) {
    const item = items.value.find(current => current.id === payload.id)
    if (!item) {
        return
    }

    item.status = 'handled'
    item.handle_action = payload.action
    item.handled_by = userStore.binggan ?? '蒜苗'
    item.handled_at = new Date().toLocaleString('zh-CN', { hour12: false })
    item.handle_note = payload.reason
    item.handle_reduce_olo = payload.reduceOlo
    window.$message.success('已更新处理状态')
}

function toggleUncertain(id: number) {
    const item = items.value.find(current => current.id === id)
    if (item) {
        item.uncertain = !item.uncertain
    }
}
</script>

<template>
    <n-flex vertical class="accuse-page">
        <n-flex align="center" :wrap="true" class="accuse-toolbar">
            <n-flex align="center" :size="8">
                <n-icon :size="commonStore.isMobile ? 22 : 26">
                    <FlagOutline />
                </n-icon>
                <n-text strong>举报中心</n-text>
                <n-text :depth="3">未处理 {{ pendingCount }}</n-text>
            </n-flex>
            <div class="accuse-spacer"></div>
            <n-switch v-model:value="showPendingOnly">
                <template #checked>仅未处理</template>
                <template #unchecked>全部举报</template>
            </n-switch>
        </n-flex>

        <n-empty v-if="pagedItems.length === 0" description="暂无举报" />
        <n-flex v-else vertical :size="8">
            <AccuseItem v-for="item in pagedItems" :key="item.id" :item="item" :is-admin="isAdminView"
                @handle="handleAccuseAction" @toggle-uncertain="toggleUncertain" />
        </n-flex>

        <n-flex justify="end" class="accuse-pagination">
            <Pagination v-model:page="pageSelected" :last-page="lastPage" />
        </n-flex>

        <AccuseCreateModal ref="createModalCom" @submit="handleCreateAccuse" @close="cleanQuery" />
        <AccuseHandleModal ref="handleModalCom" @submit="commitHandle" />
    </n-flex>
</template>

<style scoped>
.accuse-page {
    margin: 8px auto 50px;
    max-width: 980px;
}

.accuse-toolbar {
    border-bottom: 1px solid rgba(120, 120, 120, 0.22);
    padding: 8px 0 10px;
}

.accuse-spacer {
    flex: 1;
    min-width: 12px;
}

.accuse-pagination {
    padding: 8px 0;
}
</style>
