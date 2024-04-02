<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="标题改色" closable @close="showThis = false"
            size="small">
            <n-flex vertical>
                <n-text>
                    要更换标题颜色吗？每次收费500个olo喔
                </n-text>
                <n-color-picker v-model:value="titleColorInput" :modes="['hex']" :show-alpha="false"
                    style="max-width: 8.2rem;" :swatches="colorswatches" />
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <f-button type="primary" @click="changeColorHandle" :loading="changeColorLoading">提交</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { threadChangeColorPoster, type threadChangeColorParams } from '@/api/methods/threads';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton } from '@custom';
import { useRequest } from 'alova';
import { NCard, NColorPicker, NFlex, NModal, NText } from 'naive-ui';
import { ref } from 'vue';

//基础数据
const commonStore = useCommonStore()
const userStore = useUserStore()

//组件props
interface Props {
    threadId: number
}
const props = withDefaults(defineProps<Props>(), {

})

//输入数据
const titleColorInput = ref<string>()
//标题颜色预设
const colorswatches = ['#b65954', '#c78878', '#9b7e70', '#de7562', '#fca44b', '#f1c727', '#f6da79', '#fbda97',
    '#9fc778', '#78c79f', '#8ab185', '#98c0d9', '#8691db', '#7878c7', '#566b7c', '#9678c7', '#9f78c7', '#ca95e9',
    '#ecacc6', '#a86fa2', '#7e3749']

//来自父组件的唤醒emit
const showThis = ref<boolean>(false)
function show() {
    showThis.value = true
}
defineExpose({ show })

//各种emit
const emit = defineEmits<{
    refreshPostsList: [],
}>()

//标题换色功能
const { loading: changeColorLoading, send: changeColorSend, onSuccess: changeColorOnsuccess } = useRequest((params: threadChangeColorParams) => threadChangeColorPoster(params), { immediate: false })
function changeColorHandle() {
    if (!titleColorInput.value) {
        window.$message.error('颜色输入不能为空')
        return
    }
    const params: threadChangeColorParams = {
        binggan: userStore.binggan!,
        thread_id: props.threadId,
        color: titleColorInput.value,
    }
    changeColorSend(params)
    changeColorOnsuccess(() => showThis.value = false)
}

</script>
