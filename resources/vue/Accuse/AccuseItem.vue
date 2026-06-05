<script setup lang="ts">
import type { AccuseAction, AccuseItemData } from '@/api/methods/accuse'
import { renderIcon } from '@/js/func/renderIcon'
import { useCommonStore } from '@/stores/common'
import { Delete } from '@vicons/carbon'
import { Question as Hint } from '@vicons/fa'
import { LockClosed12Regular as Lock } from '@vicons/fluent'
import { Ban, CheckmarkCircleOutline, CloseCircleOutline, EllipsisHorizontal as Dropdown, HelpCircleOutline } from '@vicons/ionicons5'
import { NCard, NCheckbox, NDropdown, NFlex, NIcon, NTag, NText, type DropdownOption } from 'naive-ui'
import { computed } from 'vue'

const commonStore = useCommonStore()

interface Props {
    item: AccuseItemData,
    isAdmin: boolean,
}

const props = defineProps<Props>()

const emit = defineEmits<{
    handle: [payload: { id: number, action: AccuseAction, floor: number }],
    toggleUncertain: [id: number],
}>()

const statusType = computed<'default' | 'success'>(() => props.item.status === 'handled' ? 'success' : 'default')
const statusText = computed(() => props.item.status === 'handled' ? '已处理' : '未处理')
const handleActionLabels: Record<Exclude<AccuseAction, 'hint'>, string> = {
    ignore: '忽略',
    delete: '删帖',
    deleteAll: '删全',
    lock: '封禁',
    ban: '碎饼',
}
const handleActionText = computed(() => {
    const action = props.item.handle_action
    if (!action || action === 'hint') {
        return null
    }

    return handleActionLabels[action]
})
const page = computed(() => Math.floor(props.item.floor / 200) + 1)
const floorLink = computed(() => ({
    name: 'thread',
    params: {
        threadId: props.item.thread_id,
        page: page.value,
    },
    hash: `#f_${props.item.floor}`,
}))

const adminOptions = computed<DropdownOption[]>(() => [
    { label: '提示', key: 'hint', icon: renderIcon(Hint, { size: '1.25rem' }) },
    { label: '忽略', key: 'ignore', icon: renderIcon(CloseCircleOutline, { size: '1.25rem' }) },
    { label: '删帖', key: 'delete', icon: renderIcon(Delete, { size: '1.25rem' }) },
    { label: '删全', key: 'deleteAll', icon: renderIcon(Delete, { size: '1.25rem' }) },
    { label: '碎饼', key: 'ban', icon: renderIcon(Ban, { size: '1.25rem' }) },
    { label: '封禁', key: 'lock', icon: renderIcon(Lock, { size: '1.25rem' }) },
])

function dropdownSelect(key: string | number) {
    emit('handle', { id: props.item.id, action: key as AccuseAction, floor: props.item.floor })
}
</script>

<template>
    <n-card size="small" class="accuse-item" :content-style="{ padding: commonStore.isMobile ? '10px' : '14px' }">
        <n-flex vertical :size="10">
            <n-flex align="center" :wrap="true" class="accuse-item-header">
                <n-tag :type="statusType" size="small">
                    <template #icon>
                        <n-icon>
                            <CheckmarkCircleOutline v-if="item.status === 'handled'" />
                            <CloseCircleOutline v-else />
                        </n-icon>
                    </template>
                    {{ statusText }}
                </n-tag>
                <n-text :depth="3" class="accuse-created-at">{{ item.created_at }}</n-text>
                <template v-if="isAdmin">
                    <div class="accuse-spacer"></div>
                    <div class="accuse-admin-actions">
                        <n-checkbox class="accuse-uncertain-checkbox" :checked="item.uncertain"
                            @update:checked="emit('toggleUncertain', item.id)">
                            <n-icon :size="22">
                                <HelpCircleOutline />
                            </n-icon>
                        </n-checkbox>
                        <n-dropdown v-if="item.status === 'pending'" trigger="click" :options="adminOptions"
                            :size="commonStore.isMobile ? 'medium' : 'large'" @select="dropdownSelect">
                            <n-flex align="center" :size="2" class="accuse-admin-menu">
                                <n-icon :size="20">
                                    <Dropdown />
                                </n-icon>
                                <n-text class="accuse-admin-menu-text">操作</n-text>
                            </n-flex>
                        </n-dropdown>
                    </div>
                </template>
            </n-flex>

            <n-flex vertical :size="6">
                <n-text strong>主题：{{ item.thread_title }}</n-text>
                <n-flex align="center" :size="8" :wrap="true">
                    <n-text>楼层：</n-text>
                    <router-link :to="floorLink" target="_blank" class="accuse-floor-link">
                        №{{ item.floor }}
                    </router-link>
                    <n-text v-if="isAdmin" :depth="3">近期被举报 {{ item.target_recent_count }} 次</n-text>
                </n-flex>
            </n-flex>

            <div class="accuse-reasons">
                <div v-for="reason in item.reasons" :key="reason.id" class="accuse-reason">
                    <n-text>{{ reason.content }}</n-text>
                    <n-text :depth="3" class="accuse-reason-time">
                        {{ reason.created_at }}
                        <template v-if="isAdmin"> 近期举报 {{ reason.reporter_recent_count }} 次</template>
                    </n-text>
                </div>
            </div>

            <div v-if="isAdmin && (item.handled_by || handleActionText || item.handle_note)" class="accuse-admin-meta">
                <n-text v-if="item.handled_by" :depth="3">处理人：{{ item.handled_by }}</n-text>
                <n-text v-if="handleActionText" :depth="3">处理操作：{{ handleActionText }}</n-text>
                <n-text v-if="item.handle_note" :depth="3">
                    处理原因：{{ item.handle_note }}
                    <template v-if="item.handle_reduce_olo">（罚款olo）</template>
                </n-text>
            </div>
        </n-flex>
    </n-card>
</template>

<style scoped>
.accuse-item {
    border-radius: 8px;
}

.accuse-item-header {
    min-width: 0;
}

.accuse-created-at {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.accuse-spacer {
    flex: 1;
    min-width: 8px;
}

.accuse-admin-actions {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    gap: 6px;
    white-space: nowrap;
}

.accuse-uncertain-checkbox :deep(.n-checkbox__label) {
    display: flex;
    padding-left: 4px;
}

.accuse-floor-link {
    color: inherit;
    font-weight: 700;
    text-decoration: none;
    width: fit-content;
}

.accuse-floor-link:hover {
    text-decoration: underline;
}

.accuse-admin-menu {
    cursor: pointer;
}

@media (max-width: 420px) {
    .accuse-spacer {
        min-width: 0;
    }

    .accuse-admin-actions {
        gap: 4px;
    }

    .accuse-admin-menu-text {
        display: none;
    }

    .accuse-uncertain-checkbox :deep(.n-checkbox__label) {
        padding-left: 2px;
    }
}

.accuse-reasons {
    display: grid;
    gap: 8px;
}

.accuse-reason {
    border-left: 3px solid rgba(120, 120, 120, 0.34);
    display: grid;
    gap: 2px;
    padding-left: 10px;
}

.accuse-reason-time {
    font-size: 0.85rem;
}

.accuse-admin-meta {
    border-top: 1px solid rgba(120, 120, 120, 0.18);
    display: grid;
    gap: 4px;
    padding-top: 8px;
}
</style>
