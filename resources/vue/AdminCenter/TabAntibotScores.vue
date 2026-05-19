<template>
    <n-flex size="small">
        <n-date-picker v-model:formatted-value="dateRange" value-format="yyyy-MM-dd" type="daterange"
            :size="commonStore.isMobile ? 'small' : 'medium'" :is-date-disabled="dateDisabled" />
        <f-button type="primary" @click="getDataHandle()">
            查询
        </f-button>
        <n-card title="反机器人多维评分" size="small">
            <div v-if="commonStore.isMobile" style="text-align: center; padding: 20px;">
                请在电脑页面查看
            </div>
            <n-flex v-else vertical>
                <n-data-table :columns="columns" :data="tableData" :bordered="false"
                    :loading="dataLoading" style="height: 100%;" :row-key="(row: any) => row._idx" />
                <n-pagination v-model:page="pageSelected" :page-count="dataList.last_page" size="medium"
                    style="margin-left: auto;" />
            </n-flex>
        </n-card>
    </n-flex>
</template>

<script setup lang="ts">
import { antiBotScoresGetter } from '@/api/methods/admin'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { FButton } from '@custom'
import { useRequest } from 'alova'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { NCard, NDataTable, NDatePicker, NFlex, NPagination, useThemeVars } from 'naive-ui'
import { computed, onMounted, ref, watch } from 'vue'

dayjs.extend(utc)
dayjs.extend(timezone)

const userStore = useUserStore()
const commonStore = useCommonStore()
const themeVars = useThemeVars()

function getDefaultDateRange(): [string, string] {
    const now = dayjs().tz('Asia/Shanghai')
    const monthStart = now.startOf('month')
    const today = now.format('YYYY-MM-DD')
    const sevenDaysAgo = now.subtract(6, 'day')
    const from = sevenDaysAgo.isBefore(monthStart) ? monthStart.format('YYYY-MM-DD') : sevenDaysAgo.format('YYYY-MM-DD')
    return [from, today]
}

const dateRange = ref<[string, string]>(getDefaultDateRange())
const pageSelected = ref<number>(1)

watch(pageSelected, () => getDataHandle())
onMounted(() => getDataHandle())

function dateDisabled(timestamp: number) {
    const date = dayjs(timestamp)
    const now = dayjs().tz('Asia/Shanghai')
    return !date.isSame(now, 'month')
}

const columns = [
    { title: '#', key: '_idx', width: 50 },
    { title: '饼干', key: 'binggan', resizable: true },
    { title: '评分', key: '_sc', resizable: true },
    { title: 'A 间隔方差', key: '_dimA', resizable: true, ellipsis: { tooltip: true } },
    { title: 'B 均隔', key: '_dimB', resizable: true, ellipsis: { tooltip: true } },
    { title: 'C 不看帖', key: '_dimC', resizable: true, ellipsis: { tooltip: true } },
    { title: '时间', key: 'created_at', resizable: true },
]

const { loading: dataLoading, data: dataList, send: getData } = useRequest(
    (params: { binggan: string, date_from: string, date_to: string, page: number }) =>
        antiBotScoresGetter(params),
    { immediate: false, initialData: { data: [], last_page: 1 } },
)

function fmtDim(d: any): string {
    if (!d || d.s === undefined) return '—'
    return `${d.s}分`
        + (d.v !== undefined ? ` v=${d.v}` : '')
        + (d.avg !== undefined ? ` avg=${d.avg}s` : '')
        + (d.n !== undefined ? ` n=${d.n}` : '')
}

const tableData = computed(() => {
    return dataList.value.data.map((item, index) => {
        let sc = '?'
        let dimA = '—', dimB = '—', dimC = '—'
        try {
            const parsed = JSON.parse(item.content)
            sc = parsed.sc ?? '?'
            const dm = parsed.dm
            if (dm) {
                dimA = fmtDim(dm.A)
                dimB = fmtDim(dm.B)
                dimC = fmtDim(dm.C)
            }
        } catch { /* fallback to raw content */ }
        return {
            ...item,
            _idx: (pageSelected.value - 1) * 10 + index + 1,
            _sc: `${sc}分`,
            _dimA: dimA,
            _dimB: dimB,
            _dimC: dimC,
        }
    })
})

function getDataHandle() {
    if (!dateRange.value || dateRange.value.length !== 2) return
    getData({
        binggan: userStore.binggan!,
        date_from: dateRange.value[0],
        date_to: dateRange.value[1],
        page: pageSelected.value,
    })
}
</script>
