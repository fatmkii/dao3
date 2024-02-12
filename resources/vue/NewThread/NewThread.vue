<template>
    <n-flex vertical style="margin-top: 8px;">
        <PostInput mode="thread" :forum-id="forumId" :disabled="false" :handling="newThreadHandling"
            @content-commit="newThreadHandle" />

        <n-tabs type="line" animated :size="commonStore.isMobile ? 'small' : 'medium'" v-model:value="tabValue">
            <n-tab-pane name="常规" tab="常规">
                <TabCommon :forum-id="props.forumId" ref="TabCommonComponent"></TabCommon>
            </n-tab-pane>
            <n-tab-pane name="红包" tab="红包">
                <TabHongbao :thread-type="threadTypeSeleted" @thread-type-change="threadTypeChange"></TabHongbao>
            </n-tab-pane>
            <n-tab-pane name="投票" tab="投票">
                <TabVote :thread-type="threadTypeSeleted" @thread-type-change="threadTypeChange"></TabVote>
            </n-tab-pane>
            <n-tab-pane name="菠菜" tab="菠菜">
                <TabGamble :thread-type="threadTypeSeleted" @thread-type-change="threadTypeChange"></TabGamble>
            </n-tab-pane>
            <n-tab-pane name="众筹" tab="众筹" v-if="userStore.checkAdminForums(props.forumId)">
                <TabCrowd :thread-type="threadTypeSeleted" @thread-type-change="threadTypeChange"></TabCrowd>
            </n-tab-pane>
        </n-tabs>

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
import { TabCommon, TabCrowd, TabGamble, TabHongbao, TabVote, type threadType } from './'
import { useRequest } from 'alova'
import { newThreadPoster, newThreadParams } from '@/api/methods/threads'
import { NEllipsis, NFlex, NTag, NTabs, NTabPane } from 'naive-ui'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const themeStore = usethemeStore()
const router = useRouter()

const tabValue = ref<string>()//功能选项tabs


//用teleport组件替代掉topbar的“小火锅”
useTopbarNavControl()

//组件props
interface Props {
    forumId: number //来自路由
}
const props = withDefaults(defineProps<Props>(), {

})

//来自各子组件的输入值
const TabCommonComponent = ref<InstanceType<typeof TabCommon> | null>(null)
const tabNormalInput = computed(() => TabCommonComponent.value?.tabNormalInput)

//发送新主题
const { loading: newThreadHandling, data: newThreadData, onSuccess: newThreadOnSuccess, send: newThreadPost } = useRequest
    (
        newThreadPoster, { immediate: false, }
    );

function newThreadHandle(content: contentCommit, resolve: (value: any) => void) {
    let params: newThreadParams
    params = {
        binggan: userStore.binggan!,
        forumId: props.forumId,
        title: content.titleInput,
        content: content.contentInput,
        nickname: content.nicknameInput,
        subtitle: tabNormalInput.value!.subtitle,
        threadType: threadTypeSeleted.value,
        postWithAdmin: content.postWithAdmin,
        antiJingfen: tabNormalInput.value!.antiJingfen,
        isDelay: content.isDelay,
        isPrivate: tabNormalInput.value!.isPrivate,
        canBattle: tabNormalInput.value!.canBattle,
        randomHeadsGroup: tabNormalInput.value!.randomHeadsGroup,
        nissinTime: tabNormalInput.value!.nissinTime, //这是天数的数字
        titleColor: tabNormalInput.value!.titelColor,
        lockedByCoin: tabNormalInput.value!.lockedByCoin,
        subId: tabNormalInput.value!.subId,
    }
    newThreadPost(params)
    newThreadOnSuccess(() => {
        resolve('success')
        showDialog(
            {
                title: '已发送主题，是否跳转？',
                mode: 'success',
                onPositiveClick: () => router.push({ name: 'thread', params: { threadId: newThreadData.value.thread_id } })
            })
    })
}


//threadType切换（来自子组件的事件）
const threadTypeSeleted = ref<threadType>('normal')
function threadTypeChange(type: threadType) {
    threadTypeSeleted.value = threadTypeSeleted.value === type ? 'normal' : type
}

</script>