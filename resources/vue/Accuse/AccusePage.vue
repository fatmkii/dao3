<script setup lang="ts">
import {
    accuseCreatePoster,
    accuseHandlePoster,
    accuseHintPoster,
    accuseListGetter,
    accuseUncertainPutter,
    type AccuseAction,
    type AccuseCreateParams,
    type AccuseItemData,
} from '@/api/methods/accuse'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import Pagination from '@/vue/Components/Pagination.vue'
import { FlagOutline } from '@vicons/ionicons5'
import { useRequest } from 'alova'
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

const showPendingOnly = shallowRef(false)
const pageSelected = shallowRef(1)
const createModalCom = ref<InstanceType<typeof AccuseCreateModal> | null>(null)
const handleModalCom = ref<InstanceType<typeof AccuseHandleModal> | null>(null)

const {
    data: accuseData,
    send: getAccuses,
} = useRequest(
    (params: { page: number, pending_only: boolean }) => accuseListGetter(params),
    {
        immediate: false,
        initialData: {
            data: [] as AccuseItemData[],
            last_page: 1,
            pending_count: 0,
        },
    },
)
const { send: createAccuse } = useRequest((params: AccuseCreateParams) => accuseCreatePoster(params), { immediate: false })
const { send: hintAccuse } = useRequest((id: number) => accuseHintPoster(id), { immediate: false })
const { send: handleAccuse } = useRequest(
    (params: { id: number, action: Exclude<AccuseAction, 'hint'>, reason?: string, reduceOlo?: boolean }) => accuseHandlePoster(params.id, {
        action: params.action,
        reason: params.reason,
        reduce_olo: params.reduceOlo,
    }),
    { immediate: false },
)
const { send: putUncertain } = useRequest(
    (params: { id: number, uncertain: boolean }) => accuseUncertainPutter(params.id, params.uncertain),
    { immediate: false },
)

const isAdminView = computed(() => userStore.admin.isForumAdmin)
const pagedItems = computed(() => accuseData.value.data)
const lastPage = computed(() => accuseData.value.last_page)
const pendingCount = computed(() => accuseData.value.pending_count)

watch([showPendingOnly, pageSelected], () => {
    loadAccuses()
}, { immediate: true })

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

async function loadAccuses() {
    await getAccuses({
        page: pageSelected.value,
        pending_only: showPendingOnly.value,
    })
}

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

async function handleCreateAccuse(params: AccuseCreateParams) {
    await createAccuse(params)
    pageSelected.value = 1
    await loadAccuses()
    cleanQuery()
}

function handleAccuseAction(payload: { id: number, action: AccuseAction, floor: number }) {
    const item = pagedItems.value.find(current => current.id === payload.id)
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
        hintAccuse(payload.id).then((data) => {
            window.$dialog.info({
                title: actionLabels[payload.action],
                content: `此饼干状态：${data.user_status}。已封禁次数：${data.locked_count}。近7天被举报 ${item.target_recent_count ?? 0} 次。`,
                positiveText: '确定',
            })
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
        action: payload.action as Exclude<AccuseAction, 'hint' | 'ignore'>,
        floor: payload.floor,
    })
}

async function commitHandle(payload: { id: number, action: Exclude<AccuseAction, 'hint'>, reason: string, reduceOlo: boolean }) {
    const item = await handleAccuse(payload)
    if (showPendingOnly.value) {
        await loadAccuses()
    } else {
        replaceAccuseItem(item)
    }
}

async function toggleUncertain(id: number) {
    const item = pagedItems.value.find(current => current.id === id)
    if (item) {
        const updated = await putUncertain({ id, uncertain: !item.uncertain })
        replaceAccuseItem(updated)
    }
}

function replaceAccuseItem(item: AccuseItemData) {
    accuseData.value.data = accuseData.value.data.map(current => current.id === item.id ? item : current)
    accuseData.value.pending_count = item.status === 'handled'
        ? Math.max(0, accuseData.value.pending_count - 1)
        : accuseData.value.pending_count
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
