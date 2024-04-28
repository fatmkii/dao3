<template>
    <n-flex vertical :size="2" v-if="showThis">
        <n-card v-for=" threadData  in    threadsListData  " size="small" :bordered="true" :key="threadData.id"
            class="thread-cards" :content-style="threadCardsContentStyle" hoverable>
            <n-flex vertical>
                <!-- 主题的标题本体 -->
                <div :style="{ color: threadData.title_color && !commonStore.userCustom.monochromeMode ? threadData.title_color : themeVars.textColor1 }"
                    class="thread-title">
                    <!-- 副标题 -->
                    {{ threadData.sub_title }}
                    <!-- 红包、菠菜、众筹、投票图标 -->
                    {{ threadData.vote_question_id ? '🗳️' : '' }}
                    {{ threadData.gamble_question_id ? '🎲' : '' }}
                    {{ threadData.crowd_id ? '💰' : '' }}
                    {{ threadData.hongbao_id ? '🧧' : '' }}
                    <!-- 标题内容 -->
                    <router-link :to="{ name: 'thread', params: { threadId: threadData.id } }"
                        style="font-size:1.0rem;"
                        :style="{ color: threadData.title_color && !commonStore.userCustom.monochromeMode ? threadData.title_color : themeVars.textColor1, pointerEvents: threadData.is_delay ? 'none' : undefined }"
                        :target="newWindowToPost ? '_blank' : false">
                        {{ threadData.title }}
                    </router-link>
                    <!-- 页码 -->
                    <router-link style="font-size:1.0rem;"
                        :to="{ name: 'thread', params: { threadId: threadData.id, page: Math.ceil((threadData.posts_num + 1) / 200) } }"
                        v-if="threadData.posts_num > 200" :target="newWindowToPost ? '_blank' : false">
                        [{{ Math.ceil((threadData.posts_num + 1) / 200) }}]
                    </router-link>
                    <!-- 根据浏览记录的按钮 -->
                    <f-button size="tiny" type="primary" v-if="browseLoggerData[threadData.id]"
                        @click="$router.push({ name: 'thread', params: { threadId: threadData.id, page: Math.ceil((browseLoggerData[threadData.id]!.floor + 1) / 200) }, hash: `#f_${browseLoggerData[threadData.id]!.floor}` })">
                        [{{ browseLoggerData[threadData.id]?.floor }}楼]
                    </f-button>
                    <!-- 根据浏览记录的按钮 -->
                    <f-button size="tiny" type="warning" v-if="threadData.is_your_thread"
                        :disabled="withdrawDelayThreadLoading"
                        @click="handleWithdrawDelayThread(threadData.id)">撤回</f-button>
                </div>
                <!-- 回复数量等信息 -->
                <n-flex size="small" class="thread-title-secondary">
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
        <n-card class="threads-card-skeleton" v-for="  n   in   50  " />
    </n-flex>
</template>


<script setup lang="ts">
import { delayThreadDeleter, type threadData } from '@/api/methods/threads'
import { useBrowseLogger } from '@/js/func/browseLogger'
import showDialog from '@/js/func/showDialog'
import { useCommonStore } from '@/stores/common'
import { FButton } from '@custom'
import { useRequest } from 'alova'
import { NCard, NFlex, NText, useThemeVars } from 'naive-ui'
import { computed } from 'vue'


//基础数据
const commonStore = useCommonStore()
const themeVars = useThemeVars()

//组件props
interface Props {
    threadsListData: threadData[] | [],
    showThis: boolean
    newWindowToPost?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    newWindowToPost: false
})

//自定义触发事件
const emit = defineEmits(['withdrawDelayThreadSuccess'])

//外观调整
const threadCardsContentStyle = computed(() => {
    return {
        paddingBottom: commonStore.isMobile ? '6px' : '',
    }
})

//记录浏览进度和显示
const browseLogger = useBrowseLogger({}) //用于记录浏览进度的类
const browseLoggerData = browseLogger.data


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

.thread-title-secondary {
    font-size: v-bind('commonStore.isMobile ? "0.875rem" : "0.875rem"');

    span {
        font-size: v-bind('commonStore.isMobile ? "0.875rem" : "0.875rem"')
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