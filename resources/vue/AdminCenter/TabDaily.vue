<template>
    <n-flex size="small">
        <!-- 日期范围选择和查询按钮 -->
        <n-date-picker v-model:formatted-value="dateRange" value-format="yyyy-MM-dd" type="daterange"
            :size="commonStore.isMobile ? 'small' : 'medium'" :is-date-disabled="dateDisabled" clearable />
        <f-button type="primary" @click="getDailyDataHandle()">
            查询
        </f-button>
        <n-card title="每日数据" size="small">
            <!-- 电脑版表格 -->
            <n-flex v-if="!commonStore.isMobile">
                <n-data-table :columns="columns" :data="dailyData.data" :bordered="false" :loading="dailyDataLoading"
                    style="height: 100%;" />
                <n-pagination v-model:page="pageSelected" :page-count="dailyData.last_page" size="medium"
                    style="margin-left: auto;" />
            </n-flex>
            <!-- 手机版列表 -->
            <template v-if="commonStore.isMobile">
                <n-flex v-if="dailyData.data.length > 0" vertical :align="'start'" size="small">
                    <template v-if="!dailyDataLoading">
                        <div v-for="rowData in dailyData.data" class="daily-item">
                            <n-flex>
                                <div>
                                    <n-text :depth="3">日期：</n-text>
                                    <n-text>{{ rowData.date }}</n-text>
                                </div>
                                <div style="margin-left: auto;">
                                    <n-text :depth="3">登录人数：</n-text>
                                    <n-text>{{ rowData.login_count }}</n-text>
                                </div>
                            </n-flex>
                        </div>
                    </template>
                    <n-pagination v-model:page="pageSelected" :page-count="dailyData.last_page" size="small"
                        style="margin-left: auto;" />
                </n-flex>
                <n-empty v-else />
            </template>
        </n-card>
    </n-flex>
</template>

<script setup lang="ts">

import { type dailyDataGetterParams, dailyDataGetter } from '@/api/methods/admin'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { FButton } from '@custom'
import { useRequest } from 'alova'
import { NCard, NFlex, NEmpty, NText, NDatePicker, NDataTable, NPagination, useThemeVars } from 'naive-ui'
import { ref, onMounted, watch } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc)
dayjs.extend(timezone)

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const themeVars = useThemeVars()

//日期范围选择（默认为一周前到今天）
const dateRange = ref<[string, string]>([
    dayjs().tz('Asia/Shanghai').subtract(7, 'day').format('YYYY-MM-DD'),
    dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD')
])
watch(dateRange, () => {
    pageSelected.value = 1
    getDailyDataHandle()
})

//分页
const pageSelected = ref<number>(1)
watch(pageSelected, () => getDailyDataHandle())
onMounted(() => getDailyDataHandle())

//控制日历的可选时间（从2026-02-01开始，到今天为止）
const minDate = dayjs('2026-02-01').valueOf()
function dateDisabled(timestamp: number) {
    if (timestamp < minDate) return true
    if (dayjs().add(1, 'day').isBefore(timestamp)) return true
    return false
}

//表格参数配置
const columns = [
    {
        title: '日期',
        key: 'date',
        resizable: true,
    },
    {
        title: '登录人数',
        key: 'login_count',
        resizable: true,
    },
]

//查询数据
const { loading: dailyDataLoading, data: dailyData, send: getDailyData } = useRequest(
    (params: dailyDataGetterParams) => dailyDataGetter(params),
    { immediate: false, initialData: { data: [], last_page: 1 } }
);
function getDailyDataHandle() {
    const params: dailyDataGetterParams = {
        binggan: userStore.binggan!,
        page: pageSelected.value,
        date_start: dateRange.value[0],
        date_end: dateRange.value[1],
    }
    getDailyData(params)
}

</script>


<style lang="scss" scoped>
.daily-item {
    font-size: 0.8rem;
    width: 100%;
    margin-top: 2px;
    margin-bottom: 2px;
    border-bottom: 1px solid;
    border-color: v-bind('themeVars.dividerColor');
}
</style>
