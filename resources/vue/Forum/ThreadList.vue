<template>
    <n-flex vertical :size="2" v-if="showThis">
        <n-card v-for="threadData in threadsListData" size="small" :bordered="true" :key="threadData.id"
            class="thread-cards" :content-style="{ padding: commonStore.userCustom.threadListCardPadding + 'px' }"
            hoverable>
            <n-flex vertical :size="[0, 0]">
                <!-- 主题的标题本体 -->
                <div :style="{
                    color: threadData.title_color && !commonStore.userCustom.monochromeMode ? threadData.title_color : themeVars.textColor1,
                    fontSize: commonStore.userCustom.fontSizeThreadList + 'px',
                    lineHeight: 1.5,
                }" class="thread-title">
                    <!-- 副标题 -->
                    {{ threadData.sub_title }}
                    <!-- 红包、菠菜、众筹、投票图标 -->
                    {{ threadData.vote_question_id ? '🗳️' : '' }}
                    {{ threadData.gamble_question_id ? '🎲' : '' }}
                    {{ threadData.crowd_id ? '💰' : '' }}
                    {{ threadData.hongbao_id ? '🧧' : '' }}
                    <!-- 标题内容 -->
                    <router-link :to="{ name: 'thread', params: { threadId: threadData.id } }"
                        @click="handleFooldayJump($event, threadData, 'title')"
                        :style="{ color: threadData.title_color && !commonStore.userCustom.monochromeMode ? threadData.title_color : themeVars.textColor1 }"
                        :target="newWindowToPost ? '_blank' : false">
                        {{ threadData.title }}
                    </router-link>
                    <!-- 页码 -->
                    <router-link
                        :to="{ name: 'thread', params: { threadId: threadData.id, page: Math.ceil((threadData.posts_num + 1) / 200) } }"
                        @click="handleFooldayJump($event, threadData, 'page')" v-if="threadData.posts_num > 200"
                        :target="newWindowToPost ? '_blank' : false">
                        [{{ Math.ceil((threadData.posts_num + 1) / 200) }}]
                    </router-link>
                    <!-- 根据浏览记录的按钮 -->
                    <f-button size="tiny" type="primary" v-if="browseLoggerData[threadData.id]"
                        @click="toThreadPage(threadData.id)">
                        [{{ browseLoggerData[threadData.id]?.floor }}楼]
                    </f-button>
                    <!-- 延时主题的撤回按钮 -->
                    <f-button size="tiny" type="warning" v-if="threadData.is_your_thread"
                        :disabled="withdrawDelayThreadLoading"
                        @click="handleWithdrawDelayThread(threadData.id)">撤回</f-button>
                </div>
                <!-- 回复数量等信息 -->
                <n-flex size="small" class="thread-title-secondary" :style="{
                    fontSize: commonStore.userCustom.fontSizeThreadListFooter + 'px',
                    marginTop: commonStore.userCustom.threadListInnerMargin + 'px',
                    lineHeight: 1.5,
                }">
                    <span><n-text depth="3">最新回复:</n-text> {{ threadData.updated_at }}</span>
                    <span><n-text depth="3">发帖人:</n-text> {{ threadData.nickname }} </span>
                    <span style="margin-left: auto;"></span>
                    {{ threadData.posts_num > 1200 ? '🔥' : '' }}
                    <span v-if="threadData.locked_by_coin > 0">🔒{{ threadData.locked_by_coin }}</span>
                    <span><n-text depth="3">Re:</n-text> {{ threadData.posts_num }}</span>
                </n-flex>
            </n-flex>
        </n-card>
    </n-flex>
    <n-flex vertical :size="2" v-else>
        <n-card class="threads-card-skeleton" v-for="n in 50" />
    </n-flex>
</template>


<script setup lang="ts">
import { delayThreadDeleter, type threadData } from '@/api/methods/threads'
import { useBrowseLogger } from '@/js/func/browseLogger'
import showDialog from '@/js/func/showDialog'
import { useCommonStore } from '@/stores/common'
import { FButton } from '@custom'
import { useStorage } from '@vueuse/core'
import { useRequest } from 'alova'
import { NCard, NFlex, NText, useThemeVars } from 'naive-ui'
import { useRouter } from 'vue-router'


//基础数据
const commonStore = useCommonStore()
const themeVars = useThemeVars()
const router = useRouter()

//愚人节彩蛋开关
const noFoolday2026 = useStorage<boolean>('no_foolday_2026', false)

//愚人节拦截函数
function handleFooldayJump(e: Event, currentThread: threadData, type: 'title' | 'page') {
    if (commonStore.isFoolday && !noFoolday2026.value && props.threadsListData && props.threadsListData.length > 1 && props.forumId == 914) {
        if (Math.random() < 0.5) {
            e.preventDefault()
            const otherThreads = props.threadsListData.filter(t => t.id !== currentThread.id)
            const targetThread = otherThreads[Math.floor(Math.random() * otherThreads.length)]

            let targetPage = 1
            if (type === 'page') {
                targetPage = Math.ceil((targetThread.posts_num + 1) / 200)
            }

            const routerParams = {
                name: 'thread',
                params: { threadId: targetThread.id, page: targetPage > 1 ? targetPage : undefined },
                query: { foolday: '1' }
            }

            if (props.newWindowToPost) {
                const href = router.resolve(routerParams)
                window.open(href.href, '_blank')
            } else {
                router.push(routerParams)
            }
        }
    }
}

//组件props
interface Props {
    forumId: number,
    threadsListData: threadData[],
    showThis: boolean
    newWindowToPost?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    newWindowToPost: false
})

//自定义触发事件
const emit = defineEmits(['withdrawDelayThreadSuccess'])

//记录浏览进度和显示
const browseLogger = useBrowseLogger() //用于记录浏览进度的类
const browseLoggerData = browseLogger.data

//父组件刷新ThreadList时候，重新加载浏览进度
function reloadBrowseLogger() {
    browseLogger.reload()
}
defineExpose({ reloadBrowseLogger })

//浏览进度小按钮的跳转
function toThreadPage(threadId: number) {
    const routerParams = {
        name: 'thread',
        params: { threadId: threadId, page: Math.ceil((browseLoggerData.value[threadId]!.floor + 1) / 200) },
        hash: `#f_${browseLoggerData.value[threadId]!.floor}`
    }
    if (props.newWindowToPost) {
        //新窗口打开时，先解析域名再进行打开
        const href = router.resolve(routerParams)
        window.open(href.href, '_blank')
    } else {
        //本窗口打开时，直接push
        router.push(routerParams)
    }
}

//撤回延时主题功能
const { loading: withdrawDelayThreadLoading, send: sendWithdrawDelayThread, onSuccess: withdrawDelayThreadSuccess } = useRequest(
    (threadId: number) => delayThreadDeleter(threadId), { immediate: false }
)
withdrawDelayThreadSuccess(() => {
    //触发事件，让父组件更新主题列表
    emit('withdrawDelayThreadSuccess')
})
function handleWithdrawDelayThread(threadId: number) {
    showDialog({ title: '要撤回延时主题吗？', onPositiveClick: () => { sendWithdrawDelayThread(threadId) } })
}

</script>


<style lang="scss" scoped>
.thread-cards {
    &:hover {
        background-color: v-bind('themeVars.hoverColor');
    }
}

.threads-card-skeleton {
    border-radius: 10px;
    height: 79px;
    width: 100%;
}

a {
    color: v-bind('themeVars.textColor1');
}
</style>