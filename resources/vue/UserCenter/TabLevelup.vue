<template>
    <n-flex vertical>
        <n-card title="升级饼干" size="small">
            <!-- 卡片头，显示总计 -->
            <template #header-extra>
                <n-text :depth="3">
                    说明：可支付olo升级饼干，<br v-if="commonStore.isMobile">增加屏蔽词、表情包等的容量。
                </n-text>
            </template>
            <!-- 饼干等级表格 -->
            <n-data-table :columns="columns" :data="userLevelDataTable" :bordered="false" :loading="userLevelDataLoading" />
        </n-card>
        <n-flex size="small">
            <f-button @click="showMenuModal = true">查看价格表</f-button>
        </n-flex>

        <!-- 饼干价目表的弹出modal -->
        <n-modal v-model:show="showMenuModal" display-directive="if">
            <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="升级饼干价目表" closable
                @close="showMenuModal = false" size="small">
                <img src="https://oss.cpttmm.com/xhg_other/price_list.png" style="max-width: 100%;" />

                <template #action>
                    <n-flex justify="end">
                        <f-button @click="showMenuModal = false">关闭</f-button>
                    </n-flex>
                </template>
            </n-card>
        </n-modal>


        <!-- 饼干价目表的弹出modal -->
        <n-modal v-model:show="showLevelUpModal" display-directive="if">
            <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="升级饼干" closable
                @close="showLevelUpModal = false" size="small">
                <n-flex vertical size="small">
                    <div>
                        <n-text :depth="3">项目：</n-text>
                        <span>{{ levelMenu[modeSelected].name }}</span>
                    </div>
                    <div>
                        <n-text :depth="3">升级容量：</n-text>
                        <span>
                            +{{ levelMenu[modeSelected].intervel }}
                            {{ modeSelected === 'my_battle_chara' ? '角色槽' : '字符' }}
                        </span>
                    </div>
                    <div>
                        <n-text :depth="3">最大容量：</n-text>
                        <span>
                            {{ levelMenu[modeSelected].max }}
                            {{ modeSelected === 'my_battle_chara' ? '角色槽' : '字符' }}
                        </span>
                    </div>
                    <div>
                        <n-text :depth="3">本次消费：</n-text>
                        <n-text type="warning">{{ levelMenu[modeSelected].olo }} 个olo</n-text>
                    </div>

                    <span v-if="userLevelData[modeSelected] >= levelMenu[modeSelected].max"
                        style="margin-left: auto;">嗷，这个项目已经塞满了！无法继续升级。</span>
                    <span v-else style="margin-left: auto;">确定要升级这个项目吗？</span>
                </n-flex>

                <template #action>
                    <n-flex justify="end">
                        <f-button type="primary"
                            :disabled="userLevelData[modeSelected] >= levelMenu[modeSelected].max || setUserLevelUpLoading"
                            :loading="setUserLevelUpLoading" @click="levelUpHandle(modeSelected)">升级！</f-button>
                        <f-button @click="showLevelUpModal = false">关闭</f-button>
                    </n-flex>
                </template>
            </n-card>
        </n-modal>
    </n-flex>
</template>

<script setup lang="ts">

import type { getUserLevelParams, userLevelUpMode, userLevelUpParams } from '@/api/methods/user'
import { getUserLevelGetter, userLevelUpPoster } from '@/api/methods/user'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { FButton } from '@custom'
import { useRequest } from 'alova'
import { NCard, NDataTable, NFlex, NModal, NText } from 'naive-ui'
import { computed, h, ref } from 'vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const showMenuModal = ref<boolean>(false)
const showLevelUpModal = ref<boolean>(false)

//价格提示用的数据表
const levelMenu = {
    title_pingbici: {
        name: '标题屏蔽词',
        min: 1000,
        max: 4000,
        intervel: 200,
        olo: 4000,
    },
    content_pingbici: {
        name: '内容屏蔽词',
        min: 1000,
        max: 4000,
        intervel: 200,
        olo: 4000,
    },
    fjf_pingbici: {
        name: 'FJF黑名单',
        min: 1000,
        max: 4000,
        intervel: 200,
        olo: 4000,
    },
    my_emoji: {
        name: '我的表情包',
        min: 5000,
        max: 30000,
        intervel: 1000,
        olo: 20000,
    },
    my_battle_chara: {
        name: '大乱斗角色',
        min: 0,
        max: 3,
        intervel: 1,
        olo: 50000,
    },
}

//表格参数配置
const columns = [
    {
        title: '项目',
        key: 'name',
        resizable: true,
    },
    {
        title: '目前容量',
        key: 'value',
        resizable: true,
    },
    {
        title: '操作',
        key: 'controller',
        render: renderController,
        resizable: true,
    },
]
interface userLevelDataTableRowData { name: string, value: number, mode: userLevelUpMode }
const userLevelDataTable = computed<userLevelDataTableRowData[]>(() =>
    [
        { name: '标题屏蔽词', value: userLevelData.value.title_pingbici, mode: 'title_pingbici' },
        { name: '内容屏蔽词', value: userLevelData.value.content_pingbici, mode: 'content_pingbici' },
        { name: 'FJF黑名单', value: userLevelData.value.fjf_pingbici, mode: 'fjf_pingbici' },
        { name: '我的表情包', value: userLevelData.value.my_emoji, mode: 'my_emoji' },
        { name: '大乱斗角色', value: userLevelData.value.my_battle_chara, mode: 'my_battle_chara' },
    ]
)


//生成“操作”单元格内容
function renderController(rowData: userLevelDataTableRowData) {
    return h(FButton, {
        onClick: () => userLevelUpModalShow(rowData.mode),
        size: "tiny",
        type: 'success',
        innerHTML: '升级',
    })
}


//获取粮仓数据
const userLevelDataInit = {
    title_pingbici: 0,
    content_pingbici: 0,
    fjf_pingbici: 0,
    my_emoji: 0,
    my_battle_chara: 0
}
const { loading: userLevelDataLoading, data: userLevelData, send: getUserLevelDataSend } = useRequest(
    (params: getUserLevelParams) => getUserLevelGetter(params),
    { immediate: false, initialData: userLevelDataInit }
);
if (userStore.binggan !== null) {
    getUserLevelDataSend({ binggan: userStore.binggan })
}


//显示升级确认的modal
const modeSelected = ref<userLevelUpMode>('title_pingbici')
function userLevelUpModalShow(mode: userLevelUpMode) {
    modeSelected.value = mode
    showLevelUpModal.value = true
}


//升级饼干操作
const { loading: setUserLevelUpLoading, send: setUserLevelUpSend, onSuccess: setUserLevelUpOnSuccess } = useRequest(
    (params: userLevelUpParams) => userLevelUpPoster(params),
    { immediate: false }
);
setUserLevelUpOnSuccess(() => {
    userStore.refreshUserData() //刷新用户数据
    getUserLevelDataSend({ binggan: userStore.binggan })
    showLevelUpModal.value = false
})
function levelUpHandle(mode: userLevelUpMode) {
    const params: userLevelUpParams = {
        binggan: userStore.binggan!,
        mode: mode,
    }
    setUserLevelUpSend(params)
}




</script>