<template>
    <n-card size="small" :bordered="true">
        <n-spin :show="voteDataLoading">
            <n-flex vertical v-if="voteData !== undefined">
                <!-- 投票标题 -->
                <n-flex size="small" :align="'center'" class="vote-title">
                    <n-icon :size="commonStore.isMobile ? 24 : 32">
                        <Vote />
                    </n-icon>
                    <span>{{ voteData.vote_question.title }}</span>
                </n-flex>
                <!-- 投票选项 -->
                <n-checkbox-group v-model:value="voteOptionsSelected" :disabled="userHasVoted">
                    <n-flex vertical size="large">
                        <div v-for="(option, index) in voteOptionsData" :key="option.id">
                            <n-checkbox :value="option.id" :label="`${index + 1}. ${option.option_text}`" />
                            <n-progress status="success" type="line" :height="commonStore.isMobile ? 20 : 24"
                                :percentage="Math.floor((option.vote_total / voteQuetionData.vote_total) * 100)"
                                :indicator-placement="'inside'">
                                {{ option.vote_total }}票
                            </n-progress>
                        </div>
                    </n-flex>
                </n-checkbox-group>

                <!-- 提示 -->
                <template v-if="hasOutdate">
                    <span>投票已经结束了</span>
                </template>
                <template v-else>
                    <div>
                        <n-text :depth="3">最多选择：</n-text>
                        <span>{{ voteQuetionData.max_choices }}个选项</span>
                    </div>
                    <div>
                        <n-text :depth="3">结束时间：</n-text>
                        <span>{{ outdate }} ({{ outdateTTL }})</span>
                    </div>
                </template>

                <!-- 投票按钮 -->
                <n-flex size="small" :align="'center'">
                    <f-button type="primary" @click="userVoteHandle" :loading="userVoteLoading"
                        :disabled="userVoteLoading || userHasVoted || hasOutdate">投票</f-button>
                    <n-text :depth="3" v-if="userHasVoted">你已经投过票了，谢谢参与！</n-text>
                </n-flex>
            </n-flex>
        </n-spin>
    </n-card>
</template>

<script setup lang="ts">
import { userVotePoster, voteDataGetter, type userVoteParams } from '@/api/methods/vote';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { VoteYea as Vote } from '@vicons/fa';
import { useRequest } from 'alova';
import dayjs from 'dayjs';
import { NCard, NCheckbox, NCheckboxGroup, NFlex, NIcon, NProgress, NSpin, NText } from 'naive-ui';
import { computed, ref, watch } from 'vue';
import { FButton } from '../Custom';

//组件props
interface Props {
    voteId: number,
}
const props = withDefaults(defineProps<Props>(), {
})

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()

//用户选择
const voteOptionsSelected = ref<number[]>([])
watch(voteOptionsSelected, (newValue, oldValue) => {
    if (newValue.length > voteQuetionData.value.max_choices) {
        // 如果超过了最大选择数，则禁止选择
        window.$message.error(`最多只能选择${voteQuetionData.value.max_choices}个选项喔`)
        voteOptionsSelected.value = oldValue
    }
})


//过期时间提示
const outdateTTL = computed<string>(() => {
    const outdate = dayjs(voteQuetionData.value.end_date)
    const now = dayjs()
    const hoursDiff = outdate.diff(now, 'hour')
    if (hoursDiff >= 1) {
        return `${hoursDiff}小时后`
    } else {
        const minutesDiff = outdate.diff(now, 'minute')
        return `${minutesDiff}分钟后`
    }
})
//格式化日期显示
const outdate = computed<string>(() => {
    const outdate = dayjs(voteQuetionData.value.end_date)
    return outdate.format('YY年M月D日 HH:mm')
})
const hasOutdate = computed<boolean>(() => dayjs().isAfter(dayjs(voteQuetionData.value.end_date)))


//获取投票数据
const { data: voteData,
    loading: voteDataLoading,
    send: voteDataGetterSend,
    onSuccess: voteDataOnSuccess } = useRequest(voteDataGetter(props.voteId), { immediate: false })
voteDataOnSuccess((event) => {
    //如果已经投过票，则自动选择已投过票的选项
    if (event.data.user_choices) {
        voteOptionsSelected.value = event.data.user_choices.options_id
    }
})
//刷新或刷新大乱斗数据
function getVoteData() {
    voteDataGetterSend({ binggan: userStore.binggan! })
}
if (userStore.binggan!) { getVoteData() }

//暴露刷新大乱斗数据的方法，当ThreadPage组件刷新回复列表的时候调用
defineExpose({ getVoteData })

//拆分数据方便使用
const voteQuetionData = computed(() => voteData.value.vote_question)
const voteOptionsData = computed(() => voteData.value.vote_options)
const voteUserChoicesData = computed(() => voteData.value.user_choices)
const userHasVoted = computed(() => voteUserChoicesData.value !== null)

//用户投票
const { loading: userVoteLoading,
    send: userVotePosterSend,
    onSuccess: userVoteOnSuccess } = useRequest((params: userVoteParams) => userVotePoster(params), { immediate: false })
userVoteOnSuccess(() => {
    getVoteData()
})
//刷新或刷新大乱斗数据
function userVoteHandle() {
    const params: userVoteParams = {
        binggan: userStore.binggan!,
        vote_question_id: props.voteId,
        vote_options: voteOptionsSelected.value,
    }
    userVotePosterSend(params)
}
if (userStore.binggan!) { getVoteData() }


</script>

<style scoped lang="scss">
.vote-title {
    @media all and (min-width: 1200px) {
        font-size: 1.125rem;
    }

    @media not all and (min-width: 1200px) {
        font-size: 1rem;

    }
}
</style>