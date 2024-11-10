<template>
    <n-flex size="small">
        <!-- 日期选择和查询按钮 -->
        <n-date-picker v-model:formatted-value="dateSelected" value-format="yyyy-MM-dd" type="date"
            :size="commonStore.isMobile ? 'small' : 'medium'" :is-date-disabled="dateDisabled" />
        <f-button type="primary" @click="getActivesDataHandle()">
            查询
        </f-button>
        <n-card title="管理员操作记录" size="small">
            <!-- 电脑版表格 -->
            <n-flex v-if="!commonStore.isMobile">
                <n-data-table :columns="columns" :data="activesData.data" :bordered="false"
                    :loading="activesDataLoading" style="height: 100%;" />
                <n-pagination v-model:page="pageSelected" :page-count="activesData.last_page" size="medium"
                    style="margin-left: auto;" />
            </n-flex>
            <!-- 手机版列表 -->
            <template v-if="commonStore.isMobile">
                <n-flex v-if="activesData.data.length > 0" vertical :align="'start'" size="small">
                    <template v-if="!activesDataLoading">
                        <div v-for="rowData in activesData.data" class="actives-item">
                            <n-flex>
                                <div>
                                    <n-text :depth="3">时间：</n-text>
                                    <n-text>{{ rowData.created_at }}</n-text>
                                </div>
                                <div style="margin-left: auto;">
                                    <n-text :depth="3">管理员：</n-text>
                                    <n-text>{{ rowData.name }}</n-text>
                                </div>
                            </n-flex>
                            <div style="margin-top: 6px;" v-if="rowData.olo">
                                <n-text :depth="3">目标饼干：</n-text>
                                <n-text>{{ rowData.binggan_target }}</n-text>
                            </div>
                            <div style="margin-top: 6px;" v-if="rowData.olo">
                                <n-text :depth="3">罚款：</n-text>
                                <n-text>{{ rowData.olo }}</n-text>
                            </div>
                            <div style="margin-top: 6px;">
                                <n-text :depth="3">操作：</n-text>
                                <n-text>{{ rowData.active }}</n-text>
                            </div>
                            <div style="margin-top: 6px;">
                                <n-text :depth="3">原因：</n-text>
                                <n-text>{{ rowData.content }}</n-text>
                            </div>
                        </div>
                    </template>
                    <n-pagination v-model:page="pageSelected" :page-count="activesData.last_page" size="small"
                        style="margin-left: auto;" />
                </n-flex>
                <n-empty v-else />
            </template>
        </n-card>
    </n-flex>
</template>

<script setup lang="ts">

import { type adminActivesGetterParams, adminActivesGetter } from '@/api/methods/admin'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { FButton } from '@custom'
import { useRequest } from 'alova'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { NCard, NDataTable, NDatePicker, NEmpty, NFlex, NPagination, NText, useThemeVars } from 'naive-ui'
import { onMounted, ref, watch } from 'vue'

dayjs.extend(utc)
dayjs.extend(timezone)

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const themeVars = useThemeVars()

//选择日期输入
const dateSelected = ref<string>(dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD'))
watch(dateSelected, () => getActivesDataHandle())
const pageSelected = ref<number>(1)
watch(pageSelected, () => getActivesDataHandle())
onMounted(() => getActivesDataHandle())//不知道为什么上面设定immediate:true的话会报错


//控制日历的可选时间（今天往前）
function dateDisabled(timestamp: number) {
    return dayjs().add(1, 'day').isBefore(timestamp)
}


//表格参数配置
const columns = [
    {
        title: '时间',
        key: 'created_at',
        resizable: true,
    },
    {
        title: '管理员',
        key: 'name',
        resizable: true,
    },
    {
        title: '目标饼干',
        key: 'binggan_target',
        resizable: true,
    },
    {
        title: '罚款',
        key: 'olo',
        resizable: true,
    },
    {
        title: '操作',
        key: 'active',
        resizable: true,
    },
    {
        title: '原因',
        key: 'content',
        resizable: true,
    }
]


//查询数据
const { loading: activesDataLoading, data: activesData, send: getActivesData } = useRequest(
    (params: adminActivesGetterParams) => adminActivesGetter(params),
    { immediate: false, initialData: { data: [], last_page: 1 } }
);
function getActivesDataHandle() {
    const params: adminActivesGetterParams = {
        binggan: userStore.binggan!,
        date: dateSelected.value,
        page: pageSelected.value,
        show_super: true, // 查询超管操作
    }
    getActivesData(params)
}




</script>


<style lang="scss" scoped>
.actives-item {
    font-size: 0.8rem;
    width: 100%;
    margin-top: 2px;
    margin-bottom: 2px;
    border-bottom: 1px solid;
    border-color: v-bind('themeVars.dividerColor');
}
</style>