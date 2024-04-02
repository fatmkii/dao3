<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" :title="modalTitle" closable @close="showThis = false"
            size="small">
            <n-flex vertical>
                <n-text>可以用来复制给别人</n-text>
                <n-input :value="modalData" type="textarea" style="border-radius: 10px; margin-top: 6px; "
                    :autosize="{ minRows: 3, maxRows: 8 }"></n-input>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <f-button @click="copyHandle">复制</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import copyToClipboard from '@/js/func/copyToClipboard';
import { useCommonStore } from '@/stores/common';
import { FButton } from '@custom';
import { NCard, NFlex, NInput, NModal, NText } from 'naive-ui';
import { ref } from 'vue';

//基础数据
const commonStore = useCommonStore()

//输入数据
const modalData = ref<string>('')
const modalTitle = ref<string>('')

//来自父组件的唤醒emit
const showThis = ref<boolean>(false)
function show(data: string, title: string) {
    showThis.value = true
    modalData.value = data
    modalTitle.value = title
}
defineExpose({ show })

//复制到剪贴板
function copyHandle() {
    copyToClipboard(modalData.value)
    window.$message.success('已复制到剪贴板')
}

</script>
