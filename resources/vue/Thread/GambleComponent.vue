<template>
    <n-card size="small" :bordered="true">
        <n-spin :show="gambleDataLoading">
            <n-flex vertical v-if="gambleData !== undefined">
                <!-- 菠菜标题 -->
                <n-flex size="small" :align="'center'" class="gamble-title">
                    <n-icon :size="commonStore.isMobile ? 24 : 32">
                        <Gamble />
                    </n-icon>
                    <span>{{ gambleQuestionData.title }}</span>
                </n-flex>
                <!-- 菠菜选项 -->
                <n-radio-group v-model:value="gambleOptionSelected">
                    <n-flex vertical size="large">
                        <div v-for="(option, index) in gambleOptionsData" :key="option.id">
                            <n-radio :value="option.id"
                                :label="`（当前赔率 ${option.odds.toFixed(2)}）： ${option.id == gambleQuestionData.result_option_id ? '⭐' : ''} ${option.option_text}`" />
                            <n-progress status="success" type="line" :height="commonStore.isMobile ? 20 : 24"
                                :percentage="Math.floor((option.olo_total / gambleQuestionData.olo_total) * 100)"
                                :indicator-placement="'inside'">
                                {{ option.olo_total }}
                            </n-progress>
                        </div>
                    </n-flex>
                </n-radio-group>

                <!-- 提示 -->
                <template v-if="hasOutdate && gambleQuestionData.is_closed === 0">
                    <span>菠菜已经关闭投注</span>
                </template>
                <template v-if="gambleQuestionData.is_closed === 1">
                    <span>{{ `菠菜已开奖，奖金已发放。中奖项是：${gambleResultText}` }}</span>
                </template>
                <template v-if="gambleQuestionData.is_closed === 2">
                    <span>菠菜已经被管理员中止，投注olo已退回</span>
                </template>
                <template v-if="!hasOutdate && gambleQuestionData.is_closed === 0">
                    <div>
                        <n-text :depth="3">结束时间：</n-text>
                        <span>{{ outdate }} ({{ outdateTTL }})</span>
                    </div>
                </template>

                <!-- 菠菜按钮 -->
                <n-flex size="small" :align="'center'">
                    <n-input-number :max="1000000" :min="1" :step="1000" placeholder="投注额"
                        :disabled="hasOutdate || gambleQuestionData.is_closed !== 0" v-model:value="gambleBettinOlo" />
                    <f-button type="primary" @click="userGambleHandle" :loading="userGambleHandling"
                        :disabled="userGambleHandling || hasOutdate || gambleQuestionData.is_closed !== 0">投注</f-button>
                    <n-dropdown v-if="userStore.checkAdminForums(forumId) && gambleQuestionData.is_closed === 0"
                        trigger="hover" :options="funcOptions" @select="dropdownSelect" placement="bottom-start">
                        <f-button type="warning">管理</f-button>
                    </n-dropdown>
                </n-flex>

                <!-- 已投注额的数据表格 -->
                <!-- 电脑版表格 -->
                <n-data-table v-if="!commonStore.isMobile && gambleUserChoicesData.length > 0" :columns="columns"
                    :data="gambleUserChoicesData" :bordered="false" />
                <!-- 手机版列表 -->
                <template v-if="commonStore.isMobile">
                    <n-flex v-if="gambleUserChoicesData.length > 0" vertical :align="'start'" size="small">
                        <div v-for="rowData in gambleUserChoicesData" class="gamble-item">
                            <n-flex style="margin-bottom: 6px;">
                                <div>
                                    <n-text :depth="3">我的投注：</n-text>
                                    <n-text>{{ rowData.option_text }}</n-text>
                                </div>
                            </n-flex>
                            <n-flex style="margin-bottom: 6px;">
                                <div>
                                    <n-text :depth="3">投注额：</n-text>
                                    <n-text>{{ rowData.betting_olo }}</n-text>
                                </div>
                            </n-flex>
                            <n-flex style="margin-bottom: 6px;" v-if="rowData.win_olo">
                                <div>
                                    <n-text :depth="3">赔率：</n-text>
                                    <n-text>{{ rowData.odds?.toFixed(2) }}</n-text>
                                </div>
                                <div style="margin-left: auto;">
                                    <n-text :depth="3">奖金：</n-text>
                                    <n-text>{{ rowData.win_olo }}</n-text>
                                </div>
                            </n-flex>
                        </div>

                    </n-flex>
                </template>
            </n-flex>
        </n-spin>
    </n-card>
</template>

<script setup lang="ts">
import { adminGambleClosePoster, adminGambleRepealPoster, gambleDataGetter, userGamblePoster, type adminGambleCloseParams, type adminGambleRepealParams, type userChoiceData, type userGambleParams } from '@/api/methods/gamble';
import { renderIcon } from '@/js/func/renderIcon';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton } from '@custom';
import { StarRegular as Close } from '@vicons/fa';
import { DiceSharp as Gamble, CloseCircleOutline as Repeal } from '@vicons/ionicons5';
import { useRequest } from 'alova';
import dayjs from 'dayjs';
import { NCard, NDataTable, NDropdown, NFlex, NIcon, NInputNumber, NProgress, NRadio, NRadioGroup, NSpin, NText, useThemeVars } from 'naive-ui';
import { computed, ref } from 'vue';

//组件props
interface Props {
    gambleId: number,
    forumId: number,
}
const props = withDefaults(defineProps<Props>(), {
})

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const themeVars = useThemeVars()

//用户输入
const gambleOptionSelected = ref<number>()
const gambleBettinOlo = ref<number>(1000)


//过期时间提示
const outdateTTL = computed<string>(() => {
    const outdate = dayjs(gambleQuestionData.value.end_date)
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
    const outdate = dayjs(gambleQuestionData.value.end_date)
    return outdate.format('YY年M月D日 HH:mm')
})
const hasOutdate = computed<boolean>(() => dayjs().isAfter(dayjs(gambleQuestionData.value.end_date)))

//管理员按钮下拉框
const funcOptions = [
    { label: '开奖', key: 'close', icon: renderIcon(Close, { size: '1.5rem' }) },
    { label: '中止', key: 'repeal', icon: renderIcon(Repeal, { size: '1.5rem' }) }
]
function dropdownSelect(key: string) {
    switch (key) {
        case 'close':
            adminGambleCloseHandle()
            break;
        case 'repeal':
            adminGambleRepealHandle()
            break;
        default:
            break;
    }

}

//表格参数配置
const columns = [
    {
        title: '我的投注',
        key: 'option_text',
        resizable: true,
    },
    {
        title: '投注额',
        key: 'betting_olo',
        resizable: true,
    },
    {
        title: '赔率',
        key: 'odds',
        render: (rowData: userChoiceData) => rowData.odds?.toFixed(2) ?? '（开奖时确定）',
        resizable: true,
    },
    {
        title: '奖金',
        key: 'win_olo',
        resizable: true,
    },
]

//获取菠菜数据
const { data: gambleData,
    loading: gambleDataLoading,
    send: gambleDataGetterSend,
    onSuccess: gambleDataOnSuccess } = useRequest(gambleDataGetter(props.gambleId), { immediate: false })
//刷新或刷新菠菜数据
function getGambleData() {
    gambleDataGetterSend({ binggan: userStore.binggan! })
}
if (userStore.binggan!) { getGambleData() }


//拆分数据方便使用
const gambleQuestionData = computed(() => gambleData.value.gamble_question)
const gambleOptionsData = computed(() => gambleData.value.gamble_options)
const gambleUserChoicesData = computed(() =>
    gambleData.value.user_choices?.map((userChoice) => ({
        ...userChoice,
        option_text: gambleOptionsData.value.find((gambleOption) => gambleOption.id === userChoice.option_id)?.option_text
    })) ?? []
)
const gambleResultText = computed(() =>
    gambleOptionsData.value.find(
        (gambleOption) => gambleOption.id === gambleQuestionData.value.result_option_id)?.option_text
)

//用户参与菠菜
const { loading: userGambleHandling,
    send: userGamblePosterSend,
    onSuccess: userGambleOnSuccess } = useRequest((params: userGambleParams) => userGamblePoster(params), { immediate: false })
userGambleOnSuccess(() => {
    getGambleData()
})
function userGambleHandle() {
    if (!gambleOptionSelected.value || !gambleBettinOlo.value) {
        window.$message.error('请选择选项和输入投注额喔')
        return
    }
    const params: userGambleParams = {
        binggan: userStore.binggan!,
        gamble_question_id: props.gambleId,
        bet_option: gambleOptionSelected.value,
        betting_olo: gambleBettinOlo.value,
    }
    const dialogArgs = {
        title: '参加菠菜',
        closable: false,
        content: `确定要参加菠菜吗？将消耗${gambleBettinOlo.value}个olo`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            userGamblePosterSend(params)
        },
    }
    window.$dialog.warning(dialogArgs)
}

//管理员开奖菠菜
function adminGambleCloseHandle() {
    if (!gambleOptionSelected.value) {
        window.$message.error('请选择选项喔')
        return
    }
    const params: adminGambleCloseParams = {
        binggan: userStore.binggan!,
        gamble_question_id: props.gambleId,
        result_option: gambleOptionSelected.value,
    }
    const dialogArgs = {
        title: '开奖菠菜',
        closable: false,
        content: `确定要开奖吗？开奖选项是：${gambleOptionsData.value.find((item) => item.id === gambleOptionSelected.value)?.option_text}`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            adminGambleClosePoster(params).then(() => {
                getGambleData()
            })
        },
    }
    window.$dialog.warning(dialogArgs)
}
//管理员中止菠菜
function adminGambleRepealHandle() {
    const params: adminGambleRepealParams = {
        binggan: userStore.binggan!,
        gamble_question_id: props.gambleId,
    }
    const dialogArgs = {
        title: '中止菠菜',
        closable: false,
        content: `确定要中止菠菜吗？已投注的olo将会退回`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            adminGambleRepealPoster(params).then(() => {
                getGambleData()
            })
        },
    }
    window.$dialog.warning(dialogArgs)
}


</script>

<style scoped lang="scss">
.gamble-title {
    @media all and (min-width: 1200px) {
        font-size: 1.125rem;
    }

    @media not all and (min-width: 1200px) {
        font-size: 1rem;

    }
}

.gamble-item {
    font-size: 0.8rem;
    width: 100%;
    margin-top: 2px;
    margin-bottom: 2px;
    border-bottom: 1px solid;
    border-color: v-bind('themeVars.dividerColor');
}
</style>