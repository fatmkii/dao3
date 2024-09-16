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
                            <n-flex v-if="rowData.thread_title !== null" style="margin-top: 6px;" :wrap="false">
                                <n-text :depth="3">主题：</n-text>
                                <router-link :to="getThreadLink(rowData)" style="max-width: 80%;">
                                    <n-ellipsis>
                                        {{ rowData.thread_title }}
                                    </n-ellipsis>
                                </router-link>
                            </n-flex>
                            <n-flex v-if="rowData.post_content !== null" style="margin-top: 6px;" :wrap="false">
                                <n-text :depth="3">主题：</n-text>
                                <router-link :to="getThreadLink(rowData)" style="max-width: 80%;">
                                    <n-ellipsis>
                                        {{ rowData.post_content }}
                                    </n-ellipsis>
                                </router-link>
                            </n-flex>
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

import { type adminActivesData, type adminActivesGetterParams, adminActivesGetter } from '@/api/methods/admin'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { FButton, FInputGroupLabel } from '@custom'
import { useRequest } from 'alova'
import { NCard, NFlex, NEmpty, NText, NDatePicker, NDataTable, NPagination, NEllipsis, useThemeVars } from 'naive-ui'
import { computed, onMounted, ref, h, watch } from 'vue'
import dayjs from 'dayjs'
import { RouterLink } from 'vue-router'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const themeVars = useThemeVars()

//选择日期输入
const dateSelected = ref<string>(dayjs().format('YYYY-MM-DD'))
watch(dateSelected, () => getActivesDataHandle())
const pageSelected = ref<number>(1)
watch(pageSelected, () => getActivesDataHandle())
onMounted(() => getActivesDataHandle())//不知道为什么上面设定immediate:true的话会报错


//控制日历的可选时间（今天往前）
function dateDisabled(timestamp: number) {
    return dayjs().isBefore(timestamp)
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
    },
    {
        title: '主题',
        key: 'thread_title',
        render: renderThreadTitle,
        resizable: true,
    },
    {
        title: '回复',
        key: 'post_content',
        render: renderPostContent,
        resizable: true,
    },
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
        page: pageSelected.value
    }
    getActivesData(params)
}


//生成“主题”单元格内容
function getThreadLink(rowData: adminActivesData) {
    return {
        name: 'thread', params: {
            threadId: rowData.thread_id,
            page: rowData.floor === null ? 1 : Math.ceil((rowData.floor + 1) / 200)
        },
        hash: rowData.floor === null ? undefined : '#f_' + rowData.floor
    }
}
function renderThreadTitle(rowData: adminActivesData, rowIndex: number) {
    if (rowData.thread_id !== null) {
        return h(
            RouterLink,
            {
                to: getThreadLink(rowData),
                target: '_blank',
            },
            () => h(NEllipsis, { style: 'max-width: 120px' }, () => rowData.thread_title))
    } else {
        return h(NEllipsis, { style: 'max-width: 120px' }, () => rowData.thread_title)
    }
}


//生成“回复”单元格内容
function renderPostContent(rowData: adminActivesData, rowIndex: number) {
    if (rowData.thread_id !== null) {
        return h(
            RouterLink,
            {
                to: getThreadLink(rowData),
                target: '_blank',
            },
            () => h(NEllipsis, { style: 'max-width: 120px' }, () => rowData.post_content))
    } else {
        return h(NEllipsis, { style: 'max-width: 120px' }, () => rowData.post_content)
    }
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