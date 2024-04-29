<template>
    <n-card size="small" :bordered="true">
        <n-spin :show="crowdDataLoading">
            <n-flex vertical v-if="crowdData !== undefined">
                <!-- 众筹标题 -->
                <n-flex size="small" :align="'center'" class="crowd-title">
                    <n-icon :size="commonStore.isMobile ? 24 : 32">
                        <Crowd />
                    </n-icon>
                    <span>{{ crowdData.title }}</span>
                </n-flex>

                <n-flex vertical :align="'center'">
                    <!-- 众筹进度显示 -->
                    <n-progress type="dashboard" status="success" :percentage="crowdPercent">
                        <span style="text-align: center">进度{{ crowdPercent }}% </span>
                    </n-progress>


                    <!-- 提示 -->
                    <template v-if="hasOutdate && crowdData.is_closed === 0">
                        <span>众筹已经过期了</span>
                    </template>
                    <template v-if="crowdData.is_closed === 1">
                        <span>众筹已达成目标！谢谢各位参与~</span>
                    </template>
                    <template v-if="crowdData.is_closed === 2">
                        <span>众筹已经被管理员中止，olo已退回</span>
                    </template>
                    <template v-if="!hasOutdate && crowdData.is_closed === 0">
                        <div>
                            <n-text :depth="3">结束时间：</n-text>
                            <span>{{ outdate }} ({{ outdateTTL }})</span>
                        </div>
                    </template>
                    <div>
                        <n-text :depth="3">众筹目标：</n-text>
                        <span>{{ `${crowdData.olo_target.toLocaleString('en-us')} 个olo` }}</span>
                    </div>
                    <div>
                        <n-text :depth="3">已众筹到：</n-text>
                        <span>{{ `${crowdData.olo_total.toLocaleString('en-us')} 个olo` }}</span>
                    </div>

                    <!-- 众筹按钮 -->
                    <n-flex size="small" :align="'center'">
                        <n-input-number :max="1000000" :min="1" :step="1000" placeholder="投入额"
                            :disabled="hasOutdate || crowdData.is_closed !== 0" v-model:value="crowdOlo" />
                        <f-button type="primary" @click="userCrowdHandle" :loading="userCrowdHandling"
                            :disabled="userCrowdHandling || hasOutdate || crowdData.is_closed !== 0">投入</f-button>
                        <n-dropdown v-if="userStore.checkAdminForums(forumId) && crowdData.is_closed === 0"
                            :trigger="commonStore.isMobile ? 'click' : 'hover'" :options="funcOptions" @select="dropdownSelect" placement="bottom-start">
                            <f-button type="warning">管理</f-button>
                        </n-dropdown>
                    </n-flex>
                </n-flex>

                <!-- 已投注额的数据表格 -->
                <n-data-table v-if="crowdRecordsData.length > 0" :columns="columns" :data="crowdRecordsData"
                    :bordered="false" />
            </n-flex>
        </n-spin>
    </n-card>
</template>

<script setup lang="ts">
import { adminCrowdRepealPoster, crowdDataGetter, userCrowdPoster, type adminCrowdRepealParams, type userCrowdParams } from '@/api/methods/crowd';
import { renderIcon } from '@/js/func/renderIcon';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton } from '@custom';
import { Trophy as Crowd } from "@vicons/fa";
import { CloseCircleOutline as Repeal } from '@vicons/ionicons5';
import { useRequest } from 'alova';
import dayjs from 'dayjs';
import { NCard, NDataTable, NDropdown, NFlex, NIcon, NInputNumber, NProgress, NSpin, NText, useThemeVars } from 'naive-ui';
import { computed, ref } from 'vue';

//组件props
interface Props {
    crowdId: number,
    forumId: number,
}
const props = withDefaults(defineProps<Props>(), {
})

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const themeVars = useThemeVars()

//用户输入
const crowdOlo = ref<number>(1000)


//过期时间提示
const outdateTTL = computed<string>(() => {
    const outdate = dayjs(crowdData.value.end_date)
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
    const outdate = dayjs(crowdData.value.end_date)
    return outdate.format('YY年M月D日 HH:mm')
})
const hasOutdate = computed<boolean>(() => dayjs().isAfter(dayjs(crowdData.value.end_date)))

//管理员按钮下拉框
const funcOptions = [
    { label: '中止', key: 'repeal', icon: renderIcon(Repeal, { size: '1.5rem' }) }
]
function dropdownSelect(key: string) {
    switch (key) {
        case 'repeal':
            adminCrowdRepealHandle()
            break;
        default:
            break;
    }

}

//表格参数配置
const columns = [
    {
        title: '我支持的olo',
        key: 'olo',
        resizable: true,
    },
    {
        title: '参与时间',
        key: 'created_at',
        resizable: true,
    },
]

//获取众筹数据
const { data: crowdDataRaw,
    loading: crowdDataLoading,
    send: crowdDataGetterSend,
    onSuccess: crowdDataOnSuccess } = useRequest(crowdDataGetter(props.crowdId), { immediate: false })
//刷新或获取众筹数据
function getCrowdData() {
    crowdDataGetterSend({ binggan: userStore.binggan! })
}
if (userStore.binggan!) { getCrowdData() }


//拆分数据方便使用
const crowdData = computed(() => crowdDataRaw.value?.crowd)
const crowdRecordsData = computed(() => crowdDataRaw.value?.crowd_record ?? [])
const crowdPercent = computed<number>(() => Math.round(crowdData.value.olo_total / crowdData.value.olo_target * 100))

//用户参与众筹
const { loading: userCrowdHandling,
    send: userCrowdPosterSend,
    onSuccess: userCrowdOnSuccess } = useRequest((params: userCrowdParams) => userCrowdPoster(params), { immediate: false })
userCrowdOnSuccess(() => {
    getCrowdData()
})
function userCrowdHandle() {
    if (!crowdOlo.value) {
        window.$message.error('请输入众筹金额喔')
        return
    }
    const params: userCrowdParams = {
        binggan: userStore.binggan!,
        crowd_olo: crowdOlo.value,
        crowd_id: props.crowdId
    }
    const dialogArgs = {
        title: '参加众筹',
        closable: false,
        content: `确定要参加众筹吗？将消耗${crowdOlo.value}个olo`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            userCrowdPosterSend(params)
        },
    }
    window.$dialog.warning(dialogArgs)
}


//管理员中止众筹
function adminCrowdRepealHandle() {
    const params: adminCrowdRepealParams = {
        binggan: userStore.binggan!,
        crowd_id: props.crowdId,
    }
    const dialogArgs = {
        title: '中止众筹',
        closable: false,
        content: `确定要中止众筹吗？已投注的olo将会退回`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            adminCrowdRepealPoster(params).then(() => {
                getCrowdData()
            })
        },
    }
    window.$dialog.warning(dialogArgs)
}


</script>

<style scoped lang="scss">
.crowd-title {
    @media all and (min-width: 1200px) {
        font-size: 1.125rem;
    }

    @media not all and (min-width: 1200px) {
        font-size: 1rem;

    }
}

.crowd-item {
    font-size: 0.8rem;
    width: 100%;
    margin-top: 2px;
    margin-bottom: 2px;
    border-bottom: 1px solid;
    border-color: v-bind('themeVars.dividerColor');
}
</style>