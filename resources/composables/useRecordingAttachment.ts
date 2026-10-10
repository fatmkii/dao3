import { computed, onBeforeUnmount, onDeactivated, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { commonAlova } from '@/api'
import { currentAndroidBridge, isAndroidApp, waitForAndroidBridge } from '@/js/androidBridgeTransport'
import { getBinggan, supportsRecordings } from '@/js/androidAuth'

// getRandomValues also works on the fixed HTTP development origin.
function recordingRequestId(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('')
}

export interface RecordingData {
    id: number
    duration_ms: number
    expires_at: string
    server_time: string
    expired: boolean
    url: string | null
}

export function useRecordingAttachment(threadId: Ref<number>, replyMode: Ref<boolean>) {
    const available = ref(false)
    const attachment = ref<RecordingData | null>(null)
    const pending = ref<string | null>(null)
    const editorId = recordingRequestId()
    let bridge: Awaited<ReturnType<typeof waitForAndroidBridge>>
    let disposed = false
    const visible = computed(() => replyMode.value && available.value)

    function clear() {
        currentAndroidBridge()?.postMessage(JSON.stringify({
            type: 'recordingRelease', payload: { editorId },
        }))
        pending.value = null
        attachment.value = null
    }
    async function open() {
        if (!visible.value || pending.value) return
        const requestId = recordingRequestId()
        pending.value = requestId
        window.dispatchEvent(new Event('cpttmm:stop-audio'))
        bridge?.postMessage(JSON.stringify({ type: 'recordingOpen', payload: {
            requestId, editorId, threadId: threadId.value, binggan: getBinggan(),
            recordingId: attachment.value?.id ?? null,
        } }))
    }
    function receive(event: MessageEvent) {
        let message
        try { message = JSON.parse(event.data) } catch { return }
        const data = message.payload
        if (message.type !== 'recordingResult' || data?.editorId !== editorId ||
            data.requestId !== pending.value || data.threadId !== threadId.value ||
            data.binggan !== getBinggan()) return
        pending.value = null
        if (data.action === 'confirmed') attachment.value = data.recording
        if (data.action === 'removed') attachment.value = null
        if (data.error) window.$message.error(data.error)
    }
    onMounted(async () => {
        if (!isAndroidApp()) return
        bridge = await waitForAndroidBridge()
        if (disposed) return
        bridge?.addEventListener?.('message', receive)
        // A capability in the native bootstrap keeps the entry hidden on old APKs.
        if (!supportsRecordings()) return
        try {
            const config = await commonAlova.Get<{ enabled: boolean }>('api/mobile/recordings/config', { localCache: null })
            if (!disposed) available.value = config.enabled
        } catch { available.value = false }
    })
    watch([threadId, replyMode], clear)
    onDeactivated(clear)
    onBeforeUnmount(() => {
        disposed = true
        clear()
        bridge?.removeEventListener?.('message', receive)
    })
    return { visible, attachment, pending, open, clear }
}
