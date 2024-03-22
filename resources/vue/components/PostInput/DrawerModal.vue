<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: maxWidth }" title="快捷代码" closable @close="showThis = false" size="small">
            <n-flex vertical>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <f-button type="primary" @click="">插入</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { FButton, FInput, FInputGroupLabel } from '@custom';
import { NCard, NFlex, NInputGroup, NModal, NSelect, NText } from 'naive-ui';
import { computed, ref, watch } from 'vue';

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
function show() {
    showThis.value = true
}
defineExpose({ show })

//各种emit
const emit = defineEmits<{
    insertCode: [code: string],
}>()


</script>
