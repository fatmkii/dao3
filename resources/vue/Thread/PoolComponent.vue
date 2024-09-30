<template>
    <n-card size="small" :bordered="true">
        <n-spin :show="poolDataLoading">
            <n-flex vertical :align="'center'">
                <n-flex :align="'center'" size="small">
                    <n-text style="font-size: 1rem;">祝福池</n-text>
                    <img src="/hongbao.svg" :style="{ height: commonStore.isMobile ? '30px' : '36px' }" />
                </n-flex>
                <div>
                    <n-text :depth="3">祝福池总额：</n-text>
                    <n-text>{{ poolData.olo_total?.toLocaleString('en-us') }} olo </n-text>
                </div>
                <n-flex size="small" :wrap="false">
                    <f-input v-model:value="messageInput" :maxlength="255" @keyup.enter="poolStoreHandle(1000)"
                        style="max-width: 328px;" :placeholder="poolData.user_pool === null ? '请留下祝福语' : '已经投过祝福啦'"
                        auto-size :disabled="poolData.user_pool !== null" />
                    <f-button type="primary" @click="poolStoreHandle(1000)"
                        :disabled="poolData.user_pool !== null || poolStoreLoading || endFlag !== 1">投入祝福</f-button>
                    <f-button type="warning" @click="poolStoreHandle(30000)"
                        v-if="userStore.admin.isSuperAdmin">投入30w</f-button>
                </n-flex>
                <n-flex :align="'center'" size="small">
                    <span>{{ bannerText }}</span>
                </n-flex>
            </n-flex>
        </n-spin>
    </n-card>
</template>

<script setup lang="ts">
import { poolDataGetter, poolStorePoster, type getPoolData, type poolStoreParams } from '@/api/methods/common';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton, FInput } from '@custom';
import { useRequest } from 'alova';
import { NCard, NFlex, NSpin, NText } from 'naive-ui';
import { computed, ref } from 'vue';
import dayjs from 'dayjs'

//组件props
interface Props {
    threadId: number,
    forumId: number,
}
const props = withDefaults(defineProps<Props>(), {
})


//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const startTime = dayjs.tz('2024-10-1 00:00')
const endTime = dayjs.tz('2024-10-4 00:00')

//判断是否在活动期间 （0=未开始，1=进行中，2=已结束）
const endFlag = computed<0 | 1 | 2>(() => {
    const now = dayjs.tz()
    if (now < startTime) {
        return 0
    }
    if (now > endTime) {
        return 2
    }
    return 1
})

//活动开始与结束文字
const bannerText = computed<string>(() => {
    const bannerTextMap = {
        0: `活动将于 ${startTime.format('M月D日H点')} 开始`,
        1: `请投入你的祝福~~，活动将于${endTime.format('M月D日H点')}结束。（${endText.value}）`,
        2: `祝福池已关闭，请等待开奖。`,
    };
    return bannerTextMap[endFlag.value]
})

//显示剩余时间用
const endText = computed<string>(() => {
    const now = dayjs.tz()
    const hoursDiff = endTime.diff(now, 'hour')
    const minutesDiff = endTime.diff(now, 'minute') - 60 * hoursDiff
    return `剩余${hoursDiff}小时${minutesDiff}分钟`
})

//用户输入 
const messageInput = ref<string>()

//获取红包数据
const { data: poolData,
    loading: poolDataLoading,
    send: poolDataGetterSend,
    onSuccess: poolDataOnSuccess } = useRequest(poolDataGetter(), { immediate: false, initialData: {} })
//刷新或获取红包数据
function getPoolData() {
    poolDataGetterSend()
}
if (userStore.binggan!) { getPoolData() }


//提交抢红包
const { loading: poolStoreLoading,
    send: poolStoreSend,
    onSuccess: poolStoreOnSuccess
} = useRequest((params: poolStoreParams) => poolStorePoster(params),
    { immediate: false }
)
function poolStoreHandle(olo: number) {
    if (messageInput.value === undefined) {
        const dialogArgs = {
            title: '错误',
            closable: false,
            content: '请输入祝福语喔',
            positiveText: '确定',
        }
        window.$dialog.warning(dialogArgs)
        return
    }
    const params: poolStoreParams = {
        binggan: userStore.binggan!,
        forum_id: props.forumId,
        thread_id: props.threadId,
        message: messageInput.value,
        olo: olo,
    }
    poolStoreSend(params).then(() => {
        getPoolData()
        emit('refreshPostsList')
    })
}

//各种emit
const emit = defineEmits<{
    refreshPostsList: [],
}>()

</script>