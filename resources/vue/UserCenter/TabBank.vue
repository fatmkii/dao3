<template>
    <n-flex :align="'center'">
        <!-- 顶部按钮 -->
        <f-button type="primary" @click="showDepositModal = true">我要存粮</f-button>
        <!-- 粮仓列表 -->
        <n-card title="我的粮仓" size="small">
            <!-- 卡片头，显示总计 -->
            <template #header-extra v-if="bankData.length > 0">
                <div>
                    <n-text :depth="3">粮仓总计：</n-text>
                    <span>{{ bankSum }}</span>
                </div>
            </template>
            <!-- 电脑版表格 -->
            <n-data-table v-if="!commonStore.isMobile" :columns="columns" :data="bankData" :pagination="pagination"
                :loading="bankDataLoading" :bordered="false" />
            <!-- 手机版列表 -->
            <template v-if="commonStore.isMobile">
                <n-flex v-if="bankData.length > 0" vertical :align="'start'" size="small">
                    <div v-for="rowData in bankData.slice(pageOffset, pageOffset + pageSize)" class="bank-item">
                        <n-flex style="margin-bottom: 6px;" v-if="rowData.description">
                            <div>
                                <n-text :depth="3">存粮标签：</n-text>
                                <n-text>{{ rowData.description }}</n-text>
                            </div>
                        </n-flex>
                        <n-flex style="margin-bottom: 6px;">
                            <div>
                                <n-text :depth="3">存入时间：</n-text>
                                <n-text>{{ rowData.created_at }}</n-text>
                            </div>
                            <div style="margin-left: auto;">
                                <n-text :depth="3">存粮：</n-text>
                                <n-text>{{ rowData.olo }}</n-text>
                            </div>
                        </n-flex>
                        <n-flex style="margin-bottom: 6px;">
                            <div>
                                <n-text :depth="3">到期时间：</n-text>
                                <n-text>{{ rowData.expire_date }}</n-text>
                            </div>
                            <div style="margin-left: auto;">
                                <f-button v-if="!rowData.isExpired" size="tiny" type="warning"
                                    @click="withdrawDepositHandle(rowData.id, rowData.isExpired)">提前开仓</f-button>
                                <f-button v-if="rowData.isExpired" size="tiny" type="success"
                                    @click="withdrawDepositHandle(rowData.id, rowData.isExpired)">到期开仓</f-button>
                            </div>
                        </n-flex>
                    </div>
                    <n-pagination v-model:page="pageSelected" :item-count="bankData.length" :page-size="pageSize"
                        size="small" style="margin-left: auto;" />
                </n-flex>
                <n-empty v-else />
            </template>
        </n-card>

        <!-- 存粮的弹出modal -->
        <n-modal v-model:show="showDepositModal" display-directive="if">
            <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="存粮" closable
                @close="showDepositModal = false" size="small">
                <n-flex vertical>
                    <div>
                        存粮没有利息、提前开仓扣12% <br> （那有什么用啊！）
                    </div>
                    <n-input-group>
                        <f-input-group-label style="width: 5.2rem;">存粮标签</f-input-group-label>
                        <f-input v-model:value="descriptionInput" placeholder="可选" />
                    </n-input-group>
                    <n-input-group>
                        <f-input-group-label style="width: 5.2rem;">olo总额</f-input-group-label>
                        <n-input-number v-model:value="oloInput" :max="1000000" :min="10" :step="10000"
                            :parse="inputNumberParse" :format="inputNumberFormat" />
                    </n-input-group>


                    <n-input-group>
                        <f-input-group-label style="width: 5.2rem;">到期日期</f-input-group-label>
                        <n-date-picker v-model:formatted-value="expireDateTimeInput" value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime" :is-date-disabled="dateDisabled" />
                    </n-input-group>
                    <n-text :depth="3">存粮时间最短1天，最长1年</n-text>
                </n-flex>

                <template #action>
                    <n-flex justify="end">
                        <f-button type="primary" :loading="setBankDepositLoading" :disabled="setBankDepositLoading"
                            @click="depositHandle">提交</f-button>
                        <f-button @click="showDepositModal = false">关闭</f-button>
                    </n-flex>
                </template>
            </n-card>
        </n-modal>

    </n-flex>
</template>

<script setup lang="ts">

import { bankDepositPoster, bankWithdrawPoster, getBankDataPoster, type bankData as bankDataRawInterface, type bankDepositParams, type bankWithdrawParams, type getBankDataParams } from '@/api/methods/user'
import { inputNumberFormat, inputNumberParse } from '@/js/func/inputNumberFormat'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { FButton, FInput, FInputGroupLabel } from '@custom'
import { useRequest } from 'alova'
import dayjs from 'dayjs'
import { NCard, NDataTable, NDatePicker, NFlex, NInputGroup, NInputNumber, NModal, NPagination, NText, NEmpty, useThemeVars } from 'naive-ui'
import { computed, h, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const route = useRoute()
const router = useRouter()
const themeVars = useThemeVars()
const pageSize = 10 //每页数量
const showDepositModal = ref<boolean>(false)

//输入的数据
const descriptionInput = ref<string>()
const oloInput = ref<number>(10000)
const expireDateTimeInput = ref<string>(dayjs.tz().add(2, 'day').format('YYYY-MM-DD 00:00:00'))

//表格参数配置
const pagination = ref({ pageSize: pageSize })
const columns = [
    {
        title: '存入时间',
        key: 'created_at',
        resizable: true,
    },
    {
        title: '存粮',
        key: 'olo',
        resizable: true,
    },
    {
        title: '标签',
        key: 'description',
        resizable: true,
    },
    {
        title: '到期时间',
        key: 'expire_date',
        resizable: true,
    },
    {
        title: '操作',
        key: 'controller',
        render: renderController,
        resizable: true,
    },
]

//手机版的页数和偏移量
const pageSelected = ref<number>(1)
const pageOffset = computed(() => (pageSelected.value - 1) * pageSize)


//控制日历的可选时间（1天到1年
function dateDisabled(timestamp: number) {
    return dayjs().isAfter(timestamp) || dayjs().add(1, 'year').isBefore(dayjs(timestamp))
}

//总计数据显示
const bankSum = computed(() => bankData.value
    .map(item => item.olo).
    reduce((total, current) => total + current, 0)
)

//生成“操作”单元格内容
function renderController(rowData: bankDataInterface, rowIndex: number) {
    return h(FButton, {
        onClick: () => withdrawDepositHandle(rowData.id, rowData.isExpired),
        size: "tiny",
        type: rowData.isExpired ? 'success' : "warning",
        innerHTML: rowData.isExpired ? '到期开仓' : "提前开仓"
    })

}



//获取粮仓数据
const { loading: bankDataLoading, data: bankDataRaw, send: getBankDataSend } = useRequest(
    (params: getBankDataParams) => getBankDataPoster(params),
    { immediate: false, initialData: [] }
);
if (userStore.binggan !== null) {
    getBankDataSend({ binggan: userStore.binggan })
}
interface bankDataInterface extends bankDataRawInterface {
    isExpired: boolean,
}
const bankData = computed<bankDataInterface[]>(() =>
    bankDataRaw.value.map((item) => (
        {
            ...item,
            isExpired: dayjs().isAfter(item.expire_date) //为数据加上是否已经到期的标签
        }
    ))
)

//存入粮仓
const { loading: setBankDepositLoading, send: setBankDepositSend, onSuccess: setBankDepositOnSuccess } = useRequest(
    (params: bankDepositParams) => bankDepositPoster(params),
    { immediate: false }
);
setBankDepositOnSuccess(() => {
    userStore.refreshUserData() //刷新用户数据
    getBankDataSend({ binggan: userStore.binggan! }) //刷新数据
    showDepositModal.value = false
})
function depositHandle() {
    if (oloInput.value === null) {
        window.$message.error('请输入要存入的olo')
        return
    }

    const dialogArgs = {
        title: '存入粮仓',
        closable: false,
        content: `要往粮仓存入olo吗？`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            const params: bankDepositParams = {
                binggan: userStore.binggan!,
                olo: oloInput.value,
                description: descriptionInput.value,
                expire_date: expireDateTimeInput.value,
            }
            setBankDepositSend(params)
        },
    }
    window.$dialog.success(dialogArgs)
}

//取出存粮
function withdrawDepositHandle(depositId: number, isExpired: boolean) {
    function handleRequest() {
        const params: bankWithdrawParams = {
            binggan: userStore.binggan!,
            deposit_id: depositId,
            confirm_penalty: !isExpired,
        }
        bankWithdrawPoster(params).then(() => {
            userStore.refreshUserData() //刷新用户数据
            getBankDataSend({ binggan: userStore.binggan! }) //刷新数据
        })
    }

    if (isExpired) {
        const dialogArgs = {
            title: '取出到期的存粮',
            closable: false,
            content: `要取出存粮吗？因为已经到期，不收取手续费。`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: handleRequest,
        }
        window.$dialog.success(dialogArgs)
    } else {
        const dialogArgs = {
            title: '提前取出存粮',
            closable: false,
            content: `确定要提前取出存粮吗？将会扣除12%的奥利奥喔`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: handleRequest,
        }
        window.$dialog.warning(dialogArgs)
    }

}



</script>

<style lang="scss">
.bank-item {
    font-size: 0.8rem;
    width: 100%;
    margin-top: 2px;
    margin-bottom: 2px;
    border-bottom: 1px solid;
    border-color: v-bind('themeVars.dividerColor');
}
</style>