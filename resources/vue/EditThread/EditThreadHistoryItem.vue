<script setup lang="ts">
import { computed } from 'vue'
import { useCommonStore } from '@/stores/common'
import type { FirstPostContext, FirstPostRevision } from '@/api/methods/editThread'
import PostFrame from '@/vue/Components/Post/PostFrame.vue'
import PostContent from '@/vue/Components/Post/PostContent.vue'
import { formatPostContent } from '@/vue/Components/Post/formatPostContent'

const props = defineProps<{ revision: FirstPostRevision; context: FirstPostContext }>()
const commonStore = useCommonStore()
const html = computed(() => formatPostContent(props.revision.content))
const bodyStyle = computed(() => ({
    marginTop: commonStore.userCustom.postInnerMargin + 'px',
    lineHeight: commonStore.userCustom.lineHeightPost + 'px',
}))
</script>

<template>
    <PostFrame :id="'revision-' + revision.version" :random-head="context.first_post.random_head"
        :random-head-group-index="context.thread_data.random_heads_group" :created-by-admin="context.first_post.created_by_admin">
        <template #header>
            <span v-if="revision.is_current">当前版本</span>
        </template>
        <div class="post-content" :style="bodyStyle"><PostContent :html="html" /></div>
        <template #footer>
            <span class="post-footer-text">№{{ revision.version }}</span>
            <span class="post-nick-name">{{ context.first_post.nickname }} {{ commonStore.isOctober ? '🇨🇳' : '' }}</span>
            <span class="post-created-at">{{ revision.version_at }}</span>
            <span v-if="context.first_post.created_binggan_hash" class="post-anti-jingfen">→{{ context.first_post.created_binggan_hash.slice(0, 5) }}</span>
        </template>
    </PostFrame>
</template>
