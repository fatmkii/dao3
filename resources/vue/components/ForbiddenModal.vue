<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: maxWidth }"  closable @close="showThis = false" size="small">
            <n-flex vertical>
                <img style="width: 100%;" :src="forbiddenImg[errorCode].ImgSrc" />
                <n-text>{{ message }} </n-text>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { forbiddenImg } from '@/data/forbiddenImg';
import { FButton } from '@custom';
import { NCard, NFlex, NModal, NText } from 'naive-ui';
import { computed, ref } from 'vue';

//基础数据
const errorCode = ref<number>(0)
const message = ref<string>('')

//计算modal最大宽度（手机版时候两侧各留16px的空位）
const maxWidth = computed<string>(() => {
    const screenWidth = window.innerWidth
    if (screenWidth >= 500 + 16 + 16) {
        return '500px'
    } else {
        return screenWidth - 32 + 'px'
    }
})

//来自父组件的唤醒emit
const showThis = ref<boolean>(false)
interface forbiddenModalPayload {
    errorCode: number,
    message: string
}
function show(payload: forbiddenModalPayload) {
    errorCode.value = payload.errorCode
    message.value = payload.message
    showThis.value = true
}
defineExpose({ show })

</script>
