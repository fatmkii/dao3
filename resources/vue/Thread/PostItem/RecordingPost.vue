<script setup lang="ts">
import { computed, onBeforeUnmount, onDeactivated, ref, watch } from 'vue'
import type { RecordingData } from '@/composables/useRecordingAttachment'
import { PauseOutline, PlayOutline, ReloadOutline, StopOutline } from '@vicons/ionicons5'
import '@/css/recordingControls.css'

const props = defineProps<{ recording: RecordingData }>()
const audio = ref<HTMLAudioElement | null>(null)
const playing = ref(false)
const position = ref(0)
const failed = ref(false)
const missing = ref(false)
const loading = ref(false)
const remaining = ref(0)
let expiresAt = 0
let expiryTimer: ReturnType<typeof setInterval> | undefined
let operation = 0
let statusCheck: AbortController | undefined
const expired = computed(() => props.recording.expired || missing.value || remaining.value <= 0)
const total = computed(() => props.recording.duration_ms / 1000)
const toggleLabel = computed(() => loading.value ? '加载中' : playing.value ? '暂停' : failed.value ? '重试' : '播放录音')
function time(value: number) {
    return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`
}
function stop() {
    operation++
    statusCheck?.abort()
    loading.value = false
    audio.value?.pause()
    if (audio.value) audio.value.currentTime = 0
    playing.value = false
    position.value = 0
}
function checkExpiry() {
    remaining.value = expiresAt - performance.now()
    if (expired.value) stop()
}
watch(() => props.recording, (recording) => {
    stop()
    missing.value = false
    failed.value = false
    // Measure elapsed time from the response with a monotonic clock, never the device wall clock.
    expiresAt = performance.now() + Date.parse(recording.expires_at) - Date.parse(recording.server_time)
    checkExpiry()
    if (expiryTimer) clearInterval(expiryTimer)
    expiryTimer = setInterval(checkExpiry, 500)
}, { immediate: true })
async function toggle() {
    if (expired.value || loading.value || !props.recording.url || !audio.value) return
    if (playing.value) { audio.value.pause(); playing.value = false; return }
    window.dispatchEvent(new Event('cpttmm:stop-audio'))
    const current = ++operation
    failed.value = false
    loading.value = true
    try {
        if (!audio.value.getAttribute('src')) {
            statusCheck = new AbortController()
            const response = await fetch(props.recording.url, { method: 'HEAD', signal: statusCheck.signal })
            if (current !== operation) return
            if (response.status === 404) { missing.value = true; stop(); return }
            if (!response.ok) throw new Error('load')
            audio.value.src = props.recording.url
        }
        if (current !== operation || expired.value) return
        await audio.value.play()
        if (current === operation && !expired.value) playing.value = true
        else audio.value.pause()
    } catch {
        if (current === operation) failed.value = true
    } finally {
        if (current === operation) loading.value = false
    }
}
async function playbackError() {
    failed.value = true
    playing.value = false
    if (!props.recording.url) return
    try {
        const response = await fetch(props.recording.url, { method: 'HEAD' })
        if (response.status === 404) { missing.value = true; stop() }
    } catch { /* Keep the retry button on network errors. */ }
    audio.value?.removeAttribute('src')
}
function seek(event: Event) {
    if (audio.value?.getAttribute('src') && !expired.value) {
        audio.value.currentTime = Number((event.target as HTMLInputElement).value)
        position.value = audio.value.currentTime
    }
}
function background() { if (document.hidden) stop() }
window.addEventListener('cpttmm:stop-audio', stop)
window.addEventListener('cpttmm:background', stop)
window.addEventListener('pagehide', stop)
document.addEventListener('visibilitychange', background)
onDeactivated(stop)
onBeforeUnmount(() => {
    stop()
    clearInterval(expiryTimer)
    window.removeEventListener('cpttmm:stop-audio', stop)
    window.removeEventListener('cpttmm:background', stop)
    window.removeEventListener('pagehide', stop)
    document.removeEventListener('visibilitychange', background)
})
</script>

<template>
    <div class="recording-post">
        <span v-if="expired" role="status">录音已失效</span>
        <template v-else>
            <button class="recording-control" type="button" :disabled="loading" :aria-label="toggleLabel" :title="toggleLabel" :aria-busy="loading" @click="toggle">
                <ReloadOutline v-if="loading || failed" :class="{ 'recording-control__loading': loading }" aria-hidden="true" />
                <PauseOutline v-else-if="playing" aria-hidden="true" />
                <PlayOutline v-else aria-hidden="true" />
            </button>
            <button class="recording-control" type="button" aria-label="停止" title="停止" @click="stop"><StopOutline aria-hidden="true" /></button>
            <input type="range" aria-label="录音进度" min="0" :max="total" step="0.1" :value="position" @input="seek" />
            <span class="recording-time">{{ time(position) }} / {{ time(total) }}</span>
            <span v-if="failed" role="status">加载失败，请重试</span>
        </template>
        <audio ref="audio" preload="none" @timeupdate="position = audio?.currentTime ?? 0" @ended="stop" @error="playbackError" />
    </div>
</template>

<style scoped>
.recording-post { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 10px 12px; margin: 8px 0; border: 1px solid currentColor; border-radius: 10px; max-width: 440px; }
.recording-post input { flex: 1; min-width: 80px; width: 100px; }
.recording-time { font-variant-numeric: tabular-nums; font-size: 12px; }
</style>
