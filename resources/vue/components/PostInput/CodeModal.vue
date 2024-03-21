<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: maxWidth }" title="快捷代码" closable @close="showThis = false" size="small">
            <n-flex vertical>
                <n-text>代码预览：</n-text>
                <n-text>{{ codeTypeMap[codeTypeSelected].insertText }}</n-text>
                <n-input-group>
                    <f-input-group-label style="width: 5.2rem;">代码内容</f-input-group-label>
                    <n-select v-model:value="codeTypeSelected" :options="codeTypeOptions" />
                </n-input-group>
                <n-input-group v-show="codeTypeMap[codeTypeSelected].inputEnable_1">
                    <f-input-group-label style="width: 5.2rem;">
                        {{ codeTypeMap[codeTypeSelected].prepend_1 }}
                    </f-input-group-label>
                    <f-input v-model:value="textInput1" @keyup.enter="insertHandle" />
                </n-input-group>
                <n-input-group v-show="codeTypeMap[codeTypeSelected].inputEnable_2">
                    <f-input-group-label style="width: 5.2rem;">
                        {{ codeTypeMap[codeTypeSelected].prepend_2 }}
                    </f-input-group-label>
                    <f-input v-model:value="textInput2" @keyup.enter="insertHandle" />
                </n-input-group>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <f-button type="primary" @click="insertHandle">插入</f-button>
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

//输入数据
const codeTypeSelected = ref<number>(0)
const textInput1 = ref<string>()
const textInput2 = ref<string>()

//选项
const codeTypeOptions = [
    { value: 0, label: "折叠内容" },
    { value: 1, label: "超链接" },
    { value: 2, label: "图片" },
]
const codeTypeMap = computed(() => [
    {
        prepend_1: "显示内容",
        prepend_2: "隐藏内容",
        inputEnable_1: true,
        inputEnable_2: true,
        inputDefault_1: "显示内容",
        inputDefault_2: "隐藏内容",
        insertText: `<details><summary>${textInput2.value}</summary>${textInput1.value}</details>`,
    },
    {
        prepend_1: "显示文字",
        prepend_2: "链接网址",
        inputEnable_1: true,
        inputEnable_2: true,
        inputDefault_1: "点我跳转",
        inputDefault_2: "",
        insertText: `<a href="${textInput2.value}">${textInput1.value}</a>`,
    },
    {
        prepend_1: "图片链接",
        prepend_2: "",
        inputEnable_1: true,
        inputEnable_2: false,
        inputDefault_1: "",
        inputDefault_2: "",
        insertText: `<img src="${textInput1.value}">`,
    },
])

//选项变动时，设置默认值
watch(codeTypeSelected, () => {
    textInput1.value = codeTypeMap.value[codeTypeSelected.value].inputDefault_1
    textInput2.value = codeTypeMap.value[codeTypeSelected.value].inputDefault_2
}, { immediate: true })

// 插入代码
function insertHandle() {
    emit('insertCode', codeTypeMap.value[codeTypeSelected.value].insertText)
    showThis.value = false
}

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
