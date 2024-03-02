<template>
    <n-flex vertical>
        <n-flex size="small">
            <!-- 日期选择和查询按钮 -->
            <n-date-picker v-model:formatted-value="dateSelected" value-format="yyyy-MM-dd" type="date"
                :size="commonStore.isMobile ? 'small' : 'medium'" />
            <f-button type="primary" @click="getIncomeDatHandle('day')">
                查询
            </f-button>
            <n-card title="收支记录" size="small">
                <!-- 卡片头，显示总计 -->
                <template #header-extra v-if="incomeData.length > 0">
                    <n-flex size="small" :align="'center'">
                        当日小计：{{ incomeDaySum }}
                        <n-dropdown trigger="click" placement="bottom-end" :options="sumOptions">
                            <f-button size="small" @click="getIncomeDatHandle('sum')">月年总计</f-button>
                        </n-dropdown>
                    </n-flex>
                </template>
                <!-- 电脑版表格 -->
                <n-data-table v-if="!commonStore.isMobile" :columns="columns" :data="incomeData"
                    :pagination="pagination" :bordered="false" />
                <!-- 手机版列表F -->
                <n-flex v-if="commonStore.isMobile && incomeData.length > 0" vertical :align="'start'" size="small">
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
            </n-card>
        </n-flex>
    </n-flex>
</template>

<script setup lang="ts">

import { useLocalStorageToRef } from '@/js/func/localStorageToRef'
import { useTopbarNavControl } from '@/js/func/topbarNav'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { FButton, FCheckbox, FInput } from '@custom'
import { SearchOutline as SearchIcon } from '@vicons/ionicons5'
import { useFetcher, useRequest, useWatcher } from 'alova'
import { NDatePicker, NCard, NDataTable, NFlex, NDropdown, NText, NPagination, NTag, NAlert, useThemeVars } from 'naive-ui'
import { computed, h, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { incomeDataGetter, incomeSumDataGetter, type incomeData, type incomeParams } from '@/api/methods/user'
import dayjs from 'dayjs'
import { RouterLink } from 'vue-router'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const route = useRoute()
const router = useRouter()
const themeVars = useThemeVars()
const pageSize = 30 //每页数量

//选择日期输入
const dateSelected = ref<string>(dayjs().format('YYYY-MM-DD'))
watch(dateSelected, () => incomeData.value = [])

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

//查询数据
function getIncomeDatHandle(mode: 'day' | 'sum') {
    if (dateSelected.value === null) {
        window.$message.error('需要选择日期')
    } else {
        const params: incomeParams = {
            income_date: dateSelected.value,
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