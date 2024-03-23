<template>
    <n-form ref="formRef" :model="tabNormalInput" label-placement="left" label-width="auto"
        :size="commonStore.isMobile ? 'small' : 'medium'">
        <n-grid cols="1 600:2" :x-gap="12">
            <n-gi style="max-width: 18rem;">
                <!-- 这些是免费选项 -->
                <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;"> <n-text depth="3"
                        style="font-size: 0.875rem;">常规选项</n-text>
                </n-divider>
                <n-form-item label="副标题" path="subtitle">
                    <n-select v-model:value="tabNormalInput.subtitle" :options="subtitleOptions"
                        :disabled="tabNormalInput.isPrivate" :menu-props="{ style: { borderRadius: '10px' } }" />

                </n-form-item>
                <n-form-item label="全岛公告" path="subId" v-if="tabNormalInput.subtitle === '[公告]'">
                    <n-switch v-model:value="tabNormalInput.subId" :checked-value="99" :unchecked-value="10" />
                </n-form-item>
                <n-form-item label="日清时间" path="nissinTime">
                    <n-select v-model:value="tabNormalInput.nissinTime" :options="nissinTimeOptions"
                        :disabled="nissinTimeDisable" />
                </n-form-item>
                <n-form-item label="随机头像组" path="randomHeadsGroup">
                    <n-select v-model:value="tabNormalInput.randomHeadsGroup" :options="randomHeadsOptions" />
                </n-form-item>
                <n-form-item label="开启反精分" path="antiJingfen">
                    <n-switch v-model:value="tabNormalInput.antiJingfen" />
                </n-form-item>
                <n-form-item label="开启大乱斗" path="canBattle">
                    <n-switch v-model:value="tabNormalInput.canBattle" />
                </n-form-item>
            </n-gi>
            <n-gi style="max-width: 18rem;">
                <!-- 以下是收费选项 -->
                <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;"> <n-text depth="3"
                        style="font-size: 0.875rem;">以下选项每个500olo </n-text>
                </n-divider>
                <n-form-item label="看帖权限" path="lockedByCoin">
                    <n-input-number v-model:value="tabNormalInput.lockedByCoin" placeholder="需要多少olo才能看" :max="25000"
                        :parse="inputNumberParse" :format="inputNumberFormat" :min="0" :step="5000" clearable
                        style="border-radius: 17px;" />
                </n-form-item>
                <n-form-item label="私密主题" path="isPrivate">
                    <n-switch v-model:value="tabNormalInput.isPrivate" />
                </n-form-item>
                <n-form-item label="标题颜色" path="titleColor">
                    <n-switch v-model:value="useTitleColor" />
                    <n-color-picker v-model:value="tabNormalInput.titleColor" :modes="['hex']" :show-alpha="false"
                        :swatches="colorswatches" style="margin-left: 12px;" v-show="useTitleColor" />
                </n-form-item>
                <n-form-item label="合计花费" v-show="paidTotal > 0">
                    <n-text depth="3">{{ paidTotal }}个olo </n-text>
                </n-form-item>
            </n-gi>
        </n-grid>
    </n-form>
</template>

<script setup lang="ts">
import randomHeadsData from '@/data/randomHeads'
import { subtitles as subtitleRaw, type subtitlesType } from '@/data/subtitles'
import { inputNumberFormat, inputNumberParse } from '@/js/func/inputNumberFormat'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { usethemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { NColorPicker, NDivider, NForm, NFormItem, NGi, NGrid, NInputNumber, NSelect, NSwitch, NText } from 'naive-ui'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const themeStore = usethemeStore()
const router = useRouter()

//组件props
interface Props {
    forumId: number
}
const props = withDefaults(defineProps<Props>(), {
})


//收集表单的输入数据， 最后返回给父组件
interface tabNormalInputType {
    subtitle: subtitlesType,
    nissinTime: number,
    antiJingfen: boolean,
    randomHeadsGroup: number,
    canBattle: boolean
    titleColor: string,
    lockedByCoin: number | null,
    isPrivate: boolean,
    subId: number,
}
const tabNormalInput = ref<tabNormalInputType>({
    subtitle: "[闲聊]",
    nissinTime: 1,
    antiJingfen: false,
    randomHeadsGroup: 1,
    canBattle: true,
    titleColor: '#212529',
    lockedByCoin: null,
    isPrivate: false,
    subId: 10,
})

//副标题选项
const subtitles = computed(() => {
    if (userStore.checkAdminForums(props.forumId)) {
        return subtitleRaw
    } else {
        //如果不是此版的管理员，则去掉“公告”
        return subtitleRaw.filter(subtitle => !subtitle.includes("[公告]"));
    }
})
const subtitleOptions = computed(() => {
    return subtitles.value.map((item) => { return { value: item, label: item } })
})

//开启私密主题则副标题锁定
watch(() => tabNormalInput.value.isPrivate, (newValue) => {
    if (newValue) {
        tabNormalInput.value.subtitle = '[私密]'
    }
})

//日清时间选项
const nissinTimeOptions = computed(() => {
    const forumNissinType = forumsStore.forumData(props.forumId)?.is_nissin
    switch (forumNissinType) {
        case 0:
            return [{
                value: 1,
                label: '本小岛不日清',
            }]
        case 1:
            return [{
                value: 1,
                label: '本小岛固定8点日清'
            }]
        case 2:
            return [
                { value: 1, label: "24小时" },
                { value: 2, label: "48小时" },
                { value: 3, label: "72小时" },
                { value: 7, label: "一周" },
                { value: 1095, label: "长期" },
            ]
        default:
            return []
    }
})
const nissinTimeDisable = computed(() => {
    const forumNissinType = forumsStore.forumData(props.forumId)?.is_nissin
    switch (forumNissinType) {
        case 0:
            return true
        case 1:
            return true
        case 2:
            return false
        default:
            return true
    }
})

//随机头像组选项
const randomHeadsOptions = computed(() => {
    return randomHeadsData.map((item) => { return { value: item.id, label: item.name } })
})
watch(() => forumsStore.forumsDataLoading, (value) => {
    //板块信息读取后，自动选择该板块的默认头像组
    if (value === false) {
        const forumData = forumsStore.forumData(props.forumId)
        if (forumData !== undefined) {
            tabNormalInput.value.randomHeadsGroup = forumData.default_heads
        }
    }
}, { immediate: true })


//标题颜色
const useTitleColor = ref<boolean>(false) //选择是否使用
const colorswatches = ['#b65954', '#c78878', '#9b7e70', '#de7562', '#fca44b', '#f1c727', '#f6da79', '#fbda97',
    '#9fc778', '#78c79f', '#8ab185', '#98c0d9', '#8691db', '#7878c7', '#566b7c', '#9678c7', '#9f78c7', '#ca95e9',
    '#ecacc6', '#a86fa2', '#7e3749']

//合计需要花费的olo
const paidTotal = computed<number>(() => {
    let paidTotal = 0
    if (useTitleColor.value) paidTotal += 500
    if (tabNormalInput.value.lockedByCoin ?? 0 > 0) paidTotal += 500
    if (tabNormalInput.value.isPrivate) paidTotal += 500
    return paidTotal
})

//最终返回给父组件的输入数据
const tabNormalInputToParent = computed(() => {
    return {
        ...tabNormalInput.value,
        titleColor: useTitleColor.value ? tabNormalInput.value.titleColor : null,
        subId: tabNormalInput.value.subtitle === '[公告]' ? tabNormalInput.value.subId : 0
    }
})
defineExpose({ tabNormalInput: tabNormalInputToParent })

</script>