<script setup lang="ts">
import { ref, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter } from 'vue-router'
import { NAlert, NFlex, NSpin } from 'naive-ui'
import { editThreadGetter, editThreadPutter, type FirstPostContext, type EditFirstPostPayload } from '@/api/methods/editThread'
import { useUserStore } from '@/stores/user'
import { FButton } from '@/vue/Custom'
import PostInput, { type contentCommit } from '@/vue/Components/PostInput/PostInput.vue'

const props = defineProps<{ threadId: number }>()
const router = useRouter()
const userStore = useUserStore()
const context = ref<FirstPostContext | null>(null)
const loading = ref(true)
const error = ref('')
const handling = ref(false)
const uncertain = ref(false)
let pending: EditFirstPostPayload | null = null
let resolveInput: ((value: string) => void) | null = null

watch(() => props.threadId, async threadId => {
    context.value = null
    loading.value = true
    error.value = ''
    try {
        const result = await editThreadGetter(threadId)
        if (props.threadId !== threadId) return
        context.value = result
        document.title = '修改首楼 - ' + result.thread_data.title
    } catch (cause) {
        if (props.threadId === threadId) error.value = cause instanceof Error ? cause.message : '读取失败，请刷新重试'
    } finally {
        if (props.threadId === threadId) loading.value = false
    }
}, { immediate: true })

function createRequestId() {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    bytes[6] = (bytes[6] & 15) | 64
    bytes[8] = (bytes[8] & 63) | 128
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function commit(content: contentCommit, resolve: (value: string) => void) {
    if (handling.value || pending) return resolve('cancelled')
    handling.value = true
    let confirmed = false
    window.$dialog.success({
        title: '确认修改', content: '修改首楼花费300olo，是否确定？', positiveText: '确定', negativeText: '取消',
        onPositiveClick: () => {
            confirmed = true
            pending = { content: content.contentInput, request_id: createRequestId() }
            resolveInput = resolve
            void submit()
        },
        onAfterLeave: () => {
            if (!confirmed) { handling.value = false; resolve('cancelled') }
        },
    })
}

async function submit() {
    if (!pending) return
    handling.value = true
    try {
        await editThreadPutter(props.threadId, pending)
    } catch (cause) {
        // A rejected retry cannot resolve an earlier request that may already have committed.
        const code = (cause as { cause?: { code?: number } })?.cause?.code
        if (uncertain.value || code === undefined || (code >= 500 && code < 600) || code === 5001) {
            uncertain.value = true
        } else {
            pending = null
            resolveInput?.('failed')
            resolveInput = null
        }
        handling.value = false
        return
    }
    uncertain.value = false
    pending = null
    resolveInput?.('success')
    resolveInput = null
    handling.value = false
    window.$message.success('首楼修改成功')
    // A balance-refresh error must not turn a successful paid edit into a failed edit.
    userStore.refreshUserData()
    await router.replace({ name: 'thread', params: { threadId: props.threadId, page: 1 } })
}

function canLeave() {
    if (!handling.value && !pending) return true
    window.$message.warning('请先确认本次修改结果，再离开页面')
    return false
}
onBeforeRouteLeave(canLeave)
onBeforeRouteUpdate(canLeave)
</script>

<template>
    <n-flex vertical style="margin-top: 8px;">
        <n-spin v-if="loading" />
        <n-alert v-else-if="error" type="error">{{ error }}</n-alert>
        <template v-else-if="context">
            <n-alert v-if="uncertain" type="warning" title="修改结果尚未确认">
                请求可能已经成功。请重试本次修改以确认结果，不会再次扣费。
                <f-button :loading="handling" @click="submit">重试本次修改</f-button>
            </n-alert>
            <PostInput :key="threadId" mode="edit_thread" :forum-id="context.forum_data.id" :thread-id="threadId"
                :random-heads-group="context.thread_data.random_heads_group" :handling="handling"
                :disabled="handling || uncertain"
                :initial-value="{ nickname: context.first_post.nickname, title: context.thread_data.title, content: context.first_post.content ?? '' }"
                @content-commit="commit" />
            <n-flex>
                <f-button type="primary"
                    @click="router.push({ name: 'thread', params: { threadId } })">返回主题</f-button>
            </n-flex>
        </template>
    </n-flex>
</template>
