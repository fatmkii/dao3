<template>
    <n-flex size="small">
        <!-- 日期选择和筛选、查询按钮 -->
        <n-date-picker v-model:value="dateRangeSelected" type="daterange" update-value-on-close
            :size="commonStore.isMobile ? 'small' : 'medium'" :is-date-disabled="dateDisabled"
            style="max-width: 300px;" />
        <n-dropdown :trigger="commonStore.isMobile ? 'click' : 'hover'" :options="filterOptions"
            placement="bottom-start">
            <f-button>筛选</f-button>
        </n-dropdown>
        <f-button type="primary" @click="getIncomeDataHandle('day')" :loading="incomeDataLoading">
            查询
        </f-button>
        <n-card title="收支记录" size="small">
            <!-- 卡片头，显示总计 -->
            <template #header-extra>
                <n-flex size="small" :align="'center'">
                    区间小计：{{ incomeDaySum }}
                    <n-dropdown trigger="click" placement="bottom-end" :options="sumOptions">
                        <f-button size="small" @click="getIncomeDataHandle('sum')">月年总计</f-button>
                    </n-dropdown>
                </n-flex>
            </template>
            <!-- 电脑版表格 -->
            <n-data-table v-if="!commonStore.isMobile" :columns="columns" :data="incomeData" :pagination="pagination"
                :bordered="false" :loading="incomeDataLoading" />
            <!-- 手机版列表 -->
            <template v-if="commonStore.isMobile">
                <n-flex v-if="incomeData.length > 0" vertical :align="'start'" size="small">
                    <div v-for="rowData in incomeData.slice(pageOffset, pageOffset + pageSize)" class="income-item">
                        <n-flex>
                            <div>
                                <n-text :depth="3">时间：</n-text>
                                <n-text>{{ rowData.created_at }}</n-text>
                            </div>
                            <div style="margin-left: auto;">
                                <n-text :depth="3">收支：</n-text>
                                <n-text>{{ rowData.olo }}</n-text>
                            </div>
                        </n-flex>
                        <n-flex style="margin-top: 6px;  ">
                            <div>
                                <n-text :depth="3">内容：</n-text>
                                <n-text>{{ rowData.content }}</n-text>
                            </div>
                        </n-flex>
                        <div v-if="rowData.thread_id !== null" style="margin-top: 6px;  ">
                            <n-text :depth="3">主题：</n-text>
                            <router-link :to="getThreadLink(rowData)">{{ rowData.thread_title }}</router-link>
                        </div>
                    </div>
                    <n-pagination v-model:page="pageSelected" :item-count="incomeData.length" :page-size="pageSize"
                        size="small" style="margin-left: auto;" />
                </n-flex>
                <n-empty v-else />
            </template>
        </n-card>
    </n-flex>
</template>

<script setup lang="ts">

import { incomeDataGetter, incomeSumDataGetter, type incomeData, type incomeParams } from '@/api/methods/user'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { FButton, FCheckbox } from '@custom'
import { useRequest } from 'alova'
import dayjs from 'dayjs'
import { NCard, NDataTable, NDatePicker, NDropdown, NFlex, NPagination, NText, NEmpty, NCheckboxGroup, useThemeVars } from 'naive-ui'
import { computed, h, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const route = useRoute()
const router = useRouter()
const themeVars = useThemeVars()
const pageSize = 30 //每页数量

//选择日期输入
const dateRangeSelected = ref<[number, number]>([dayjs.tz().valueOf(), dayjs.tz().valueOf()])
//表格参数配置
const pagination = ref({ pageSize: pageSize })
const columns = [
    {
        title: '时间',
        key: 'created_at',
        resizable: true,
    },
    {
        title: '收支',
        key: 'olo',
        resizable: true,
    },
    {
        title: '内容',
        key: 'content',
        resizable: true,
    },
    {
        title: '主题',
        key: 'thread',
        render: renderThreadTitle,
        ellipsis: true,
        resizable: true,
    },
]

//总计的下拉菜单
const sumOptions = computed(() => {
    if (incomeSumDataLoading.value) {
        return [
            {
                label: '加载中...',
                key: "loading",
            },
        ]
    } else {
        return [
            {
                label: '当月统计：' + incomeSumData.value.sum_month,
                key: "monthSum"
            },
            {
                label: '全年统计：' + incomeSumData.value.sum_year,
                key: "yearSum"
            },
        ]
    }
})

//筛选功能
interface typesMap { label: string, value: string | number }
const typesEnum = ['default_in', 'default_out', 'battle_in', 'battle_out', 'hongbao_in', 'hongbao_out', 'reward_out', 'reward_in', 'gamble_out', 'gamble_in', 'bank_in', 'bank_out', 'post', 'penalty']
const typesMapAll = [
    { label: '全部', value: 'all' },
] as typesMap[]
const typesMapIn = [
    { label: '回帖', value: 'post' },
    { label: '乱斗', value: 'battle_in' },
    { label: '红包', value: 'hongbao_in' },
    { label: '打赏', value: 'reward_in' },
    { label: '菠菜', value: 'gamble_in' },
    { label: '粮仓', value: 'bank_in' },
    { label: '其他', value: 'default_in' },
] as typesMap[]
const typesMapOut = [
    { label: '乱斗', value: 'battle_out' },
    { label: '红包', value: 'hongbao_out' },
    { label: '打赏', value: 'reward_out' },
    { label: '菠菜', value: 'gamble_out' },
    { label: '粮仓', value: 'bank_out' },
    { label: '罚款', value: 'penalty' },
    { label: '其他', value: 'default_out' },
] as typesMap[]
const typesIncluded = ref<(string | number)[]>(['all'])

//筛选功能下拉框
function renderFilterOptions(typesMap: typesMap[]) {
    return h(
        NCheckboxGroup,
        {
            value: typesIncluded.value,
            'onUpdate:value': (value: (string | number)[]) => {
                const addedElements = value.filter(item => !typesIncluded.value.includes(item)); //查找这次点击后新增的元素（新增勾选）
                const removedElements = typesIncluded.value.filter(item => !value.includes(item)); //查找这次点击后消失的元素（取消勾选）
                if (addedElements.includes('all')) {
                    //如果这次选择了all，则消除所有其他选项，只保留all
                    typesIncluded.value = ['all']
                } else if (removedElements.includes('all')) {
                    //如果这次取消了all，，则选择所有其他选项
                    typesIncluded.value = typesEnum
                } else if (addedElements.length !== 0 && !addedElements.includes('all')) {
                    //如果这次选择了某个选项，但不是all，则取消all选项
                    typesIncluded.value = value.filter(item => item !== 'all')
                } else if (removedElements.length !== 0 && value.length === 0) {
                    //如果这次取消了某个选项，且已经无其他任何选项，则恢复all选项
                    typesIncluded.value = ['all']
                }
                else {
                    //其他情况，正常处理
                    typesIncluded.value = value
                }
            },
        },
        () => [
            h(NFlex,
                {
                    style: 'padding:6px 8px',
                    vertical: true,
                },
                () => [
                    Array.from(typesMap).map((item) => {
                        return h(FCheckbox, { value: item.value, label: item.label })
                    }),
                ]
            )
        ]
    )
}
const filterOptions = [
    {
        key: 'filterOptions',
        type: 'render',
        render: () => renderFilterOptions(typesMapAll),
    },
    {
        label: '📈收入',
        key: 'in',
        children: [
            {
                key: 'filterOptionsIn',
                type: 'render',
                render: () => renderFilterOptions(typesMapIn),
            },
        ]
    },
    {
        label: '📉支出',
        key: 'out',
        children: [
            {
                key: 'filterOptionsOut',
                type: 'render',
                render: () => renderFilterOptions(typesMapOut),
            },
        ]
    },
]


//控制日历的可选时间（今天往前）
function dateDisabled(timestamp: number) {
    //2022年1月1日 - 当前时间+1天期间为可以选择
    return dayjs().add(1, 'day').isBefore(timestamp) || dayjs(1640966400000).isAfter(timestamp)
}


//手机版的页数和偏移量
const pageSelected = ref<number>(1)
const pageOffset = computed(() => (pageSelected.value - 1) * pageSize)

//查询收支数据接口
const { loading: incomeDataLoading, data: incomeData, send: getIncomeData } = useRequest(
    (params: incomeParams) => incomeDataGetter(params),
    { immediate: false, initialData: [] }
);
const { loading: incomeSumDataLoading, data: incomeSumData, send: getIncomeSumData } = useRequest(
    (params: incomeParams) => incomeSumDataGetter(params),
    { immediate: false, initialData: { sum_year: 0, sum_month: 0, } }
);

//总计数据显示
const incomeDaySum = computed(() => incomeData.value
    .map(item => item.olo).
    reduce((total, current) => total + current, 0)
)

//启动就查询数据并且侦听
watch([dateRangeSelected, typesIncluded], () => getIncomeDataHandle('day'))
onMounted(() => getIncomeDataHandle('day'))//不知道为什么上面设定immediate:true的话会报错
//查询数据
function getIncomeDataHandle(mode: 'day' | 'sum') {
    if (dateRangeSelected.value === null) {
        window.$message.error('需要选择日期')
    } else {
        const params: incomeParams = {
            start_ts: dateRangeSelected.value[0],
            end_ts: dateRangeSelected.value[1],
            type: typesIncluded.value.includes('all') ? null : typesIncluded.value //如果选择了all，则传送null，后端会按all处理
        }
        if (mode === 'day') getIncomeData(params)
        if (mode === 'sum') getIncomeSumData(params)
    }
}


//生成“主题”单元格内容
function getThreadLink(rowData: incomeData) {
    return {
        name: 'thread', params: {
            threadId: rowData.thread_id,
            page: rowData.floor === null ? 1 : Math.ceil((rowData.floor + 1) / 200)
        },
        hash: rowData.floor === null ? undefined : '#f_' + rowData.floor
    }
}
function renderThreadTitle(rowData: incomeData, rowIndex: number) {
    if (rowData.thread_id !== null) {
        return h(RouterLink, {
            to: getThreadLink(rowData),
            target: '_blank',
            innerHTML: rowData.thread_title,
        })
    } else {
        return ''
    }
}

</script>

<style lang="scss" scoped>
.income-item {
    font-size: 0.8rem;
    width: 100%;
    margin-top: 2px;
    margin-bottom: 2px;
    border-bottom: 1px solid;
    border-color: v-bind('themeVars.dividerColor');
}
</style>