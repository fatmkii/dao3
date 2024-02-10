<template>
    <n-flex vertical style="margin-top: 8px;">
        <PostInput mode="thread" :forum-id="forumId" :disabled="false" :handling="newThreadHandling"
            @content-commit="newThreadHandle" />

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
import type { contentCommit } from '@/vue/Components/PostInput/PostInput.vue'
import showDialog from '@/js/func/showDialog'
import { useRequest } from 'alova'
import { newThreadPoster, newThreadParams } from '@/api/methods/threads'
import { NEllipsis, NFlex, NTag } from 'naive-ui'
import { useRouter } from 'vue-router'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const themeStore = usethemeStore()
const router = useRouter()

//用teleport组件替代掉topbar的“小火锅”
useTopbarNavControl()

//组件props
interface Props {
    forumId: number //来自路由
}
const props = withDefaults(defineProps<Props>(), {

})


//发送新主题
const { loading: newThreadHandling, data: newThreadData, onSuccess: newThreadOnSuccess, onError, send: newThreadPost } = useRequest
    (
        newThreadPoster, { immediate: false, }
    );
newThreadOnSuccess(() => {
    showDialog(
        {
            title: '已发送主题，是否跳转？',
            mode: 'success',
            onPositiveClick: () => router.push({ name: 'thread', params: { threadId: newThreadData.value.thread_id } })
        })
})
function newThreadHandle(content: contentCommit) {
    let params: newThreadParams
    params = {
        binggan: userStore.binggan!,
        forumId: props.forumId,
        title: content.titleInput,
        content: content.contentInput,
        nickname: content.nicknameInput,
        subtitle: "[公告]",
        threadType: "normal",
        postWithAdmin: content.postWithAdmin,
        antiJingfen: false,
        isDelay: content.isDelay,
        isPrivate: false,
        canBattle: true,
        randomHeadsGroup: 0,
        nissinTime: 1, //这是天数的数字
        titleColor: "",
        lockByCoin: 0,
    }
    newThreadPost(params)
}

</script>