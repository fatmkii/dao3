<script setup lang="ts">
import { FButton } from '@/vue/Custom'
defineProps<{ threadId: number; canEdit?: boolean; canViewHistory?: boolean }>()
</script>

<template>
    <span class="thread-edit-actions">
        <router-link v-if="canEdit" :to="{ name: 'edit-thread', params: { threadId } }">
            <f-button size="small" type="primary">修改</f-button>
        </router-link>
        <router-link v-if="canViewHistory" :to="{ name: 'edit-thread-history', params: { threadId } }">
            <f-button size="small" type="primary">历史</f-button>
        </router-link>
    </span>
</template>

<style scoped>
.thread-edit-actions { float: right; display: inline-flex; gap: 0.5rem; margin-left: 0.5rem; }
</style>
