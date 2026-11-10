<script setup lang="ts">
import { computed, watch, shallowRef } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import { NAlert, NNumberAnimation, NSpin } from 'naive-ui'
import { FButton } from '@custom'
import type { moeRankingData } from '@/api/methods/emojiContest'

const props = defineProps<{
    items: (moeRankingData & { name: string, emojiUrl: string })[]
    loading: boolean
    refreshing: boolean
    loggedIn: boolean
    error: string
    imageBackground?: string
}>()
const emit = defineEmits<{ select: [emojiGroupId: number], refresh: [] }>()
const reducedMotion = usePreferredReducedMotion()
const previousVotes = shallowRef<Record<number, number>>({})
watch(() => props.items, (_, previous) => {
    previousVotes.value = Object.fromEntries((previous ?? []).map(item => [item.emoji_group_id, item.votes_num_total]))
})
const entries = computed(() => props.items.map(item => ({
    ...item,
    from: previousVotes.value[item.emoji_group_id] ?? item.votes_num_total,
})))
</script>

<template>
    <n-alert :show-icon="false" type="default" class="ranking-panel" aria-label="实时排名">
        <div class="ranking-header">
            <div class="ranking-heading">实时排名</div>
            <f-button type="primary" aria-label="刷新排名和当前标签页" :loading="refreshing"
                :disabled="!loggedIn || refreshing" @click="emit('refresh')">刷新</f-button>
        </div>
        <div v-if="!loggedIn">请先导入饼干查看排名和投票数据。</div>
        <n-spin v-else :show="loading && items.length === 0">
            <div v-if="items.length === 0 && !error" class="ranking-placeholder">正在加载排名…</div>
            <div class="ranking-scroll" tabindex="0" aria-label="横向滚动查看全部排名">
                <TransitionGroup name="ranking" tag="div" class="ranking-list">
                    <button v-for="item in entries" :key="item.emoji_group_id" type="button" class="ranking-item"
                        :aria-label="`查看${item.name}的投票`" @click="emit('select', item.emoji_group_id)">
                        <img :src="item.emojiUrl" :alt="item.name" class="ranking-image"
                            :style="{ backgroundColor: imageBackground }">
                        <span>{{ item.name }}</span>
                        <span class="ranking-votes">
                            <span v-if="reducedMotion === 'reduce'">{{ item.votes_num_total }}</span>
                            <n-number-animation v-else :key="`${item.from}-${item.votes_num_total}`"
                                :from="item.from" :to="item.votes_num_total" :duration="500" /> 票
                        </span>
                    </button>
                </TransitionGroup>
            </div>
        </n-spin>
        <div v-if="error" role="status" class="ranking-error">{{ error }}</div>
    </n-alert>
</template>

<style scoped lang="scss">
.ranking-panel {
    min-width: 0;
}
.ranking-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
}
.ranking-heading {
    font-weight: 600;
}
.ranking-scroll {
    max-width: 100%;
    overflow-x: auto;
    padding-bottom: 4px;
}
.ranking-list {
    display: flex;
    flex-wrap: nowrap;
    gap: 12px;
    width: max-content;
}
.ranking-item {
    display: flex;
    flex: 0 0 72px;
    width: 72px;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 4px 0;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
}
.ranking-item:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -2px;
}
.ranking-image {
    width: 60px;
    height: 60px;
    object-fit: contain;
}
.ranking-votes {
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
}
.ranking-move {
    transition: transform 0.5s ease;
}
.ranking-placeholder {
    min-height: 100px;
}
.ranking-error {
    margin-top: 8px;
}
@media (prefers-reduced-motion: reduce) {
    .ranking-move {
        transition: none;
    }
}
</style>
