<template>
    <n-flex vertical style="margin-top: 8px;">
        <PostInput mode="thread" :forum-id="forumId" :disabled="false" :handling="false" />

        <!-- 发送到TopBar的版面标题 -->
        <Teleport to="#topbar-nav">
            <router-link :to="{ name: 'forum', params: { forumId: props.forumId } }" class="flex-item-center">
                <n-ellipsis :style="{ maxWidth: commonStore.isMobile ? '120px' : '900px' }" :tooltip="false">
                    {{ forumsStore.forumData(forumId)?.name }}
                </n-ellipsis>
                <n-tag round class="forum-tag" :size="commonStore.isMobile ? 'small' : 'medium'">{{ forumId }}</n-tag>
            </router-link>
        </Teleport>
    </n-flex>
</template>

<script setup lang="ts">
import { useTopbarNavControl } from '@/js/func/topbarNav'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { usethemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import PostInput from '@/vue/Components/PostInput/PostInput.vue'
import { NEllipsis, NFlex, NTag } from 'naive-ui'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const themeStore = usethemeStore()

//用teleport组件替代掉topbar的“小火锅”
useTopbarNavControl()

//组件props
interface Props {
    forumId: number //来自路由
}
const props = withDefaults(defineProps<Props>(), {

})

</script>