
<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: maxWidth }" title="我的表情包" closable @close="showThis = false" size="small">
            <n-flex vertical>
                <n-text>可以用来复制给别人</n-text>
                <n-input :value="emojisArrayData" type="textarea" style="border-radius: 10px; margin-top: 6px; "
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
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton } from '@custom';
import { NCard, NFlex, NModal, NInput, NText } from 'naive-ui';
import { computed, ref } from 'vue';
import copyToClipboard from '@/js/func/copyToClipboard'

//基础数据
const commonStore = useCommonStore()
const userStore = useUserStore()


//计算modal最大宽度（手机版时候两侧各留16px的空位）
const maxWidth = computed<string>(() => {
    const screenWidth = window.innerWidth
    if (screenWidth >= 500 + 16 + 16) {
        return '500px'
    } else {
        return screenWidth - 32 + 'px'
    }
})

//输入数据
const emojisArrayData = ref<string>('')

//来自父组件的唤醒emit
const showThis = ref<boolean>(false)
function show(data: string) {
    showThis.value = true
    emojisArrayData.value = data
}
defineExpose({ show })

//复制到剪贴板
function copyHandle() {
    copyToClipboard(emojisArrayData.value)
    window.$message.success('已复制到剪贴板')
}

</script>

