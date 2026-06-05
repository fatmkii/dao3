<script setup lang="ts">
import type { AccuseAction } from '@/api/methods/accuse'
import { useCommonStore } from '@/stores/common'
import { FButton, FInput } from '@custom'
import { type FormInst, type FormRules, NCard, NFlex, NForm, NFormItem, NModal, NSwitch, NText } from 'naive-ui'
import { computed, ref, shallowRef } from 'vue'

const commonStore = useCommonStore()
const formRef = ref<FormInst | null>(null)

type ModalAction = Exclude<AccuseAction, 'hint' | 'ignore'>

const showThis = shallowRef(false)
const itemId = shallowRef(0)
const floor = shallowRef(0)
const action = shallowRef<ModalAction>('delete')
const userInput = ref({
    contentInput: undefined as string | undefined,
    reduceOlo: false,
})

const actionLabels: Record<ModalAction, string> = {
    delete: '删帖',
    deleteAll: '删全',
    lock: '封禁饼干',
    ban: '碎饼',
}

const contentMessage = computed(() => {
    if (action.value === 'delete') {
        return `要用管理员权限删除 №${floor.value} 这个回复吗？`
    }
    if (action.value === 'deleteAll') {
        return `要用管理员权限删除 №${floor.value} 的饼干在该主题内的全部回复吗？\n此功能请谨慎使用，仅在有恶意刷屏时。`
    }
    if (action.value === 'lock') {
        return `要封禁 №${floor.value} 的饼干吗？\n第1次3天、2次6天、3次9天、4次碎饼`
    }
    return `你要永久粉碎 №${floor.value} 的饼干吗？`
})

const inputRules = computed<FormRules>(() => ({
    contentInput: {
        required: true,
        message: '请填写理由',
    },
}))

const emit = defineEmits<{
    submit: [payload: { id: number, action: ModalAction, reason: string, reduceOlo: boolean }],
}>()

function show(payload: { id: number, action: ModalAction, floor: number }) {
    itemId.value = payload.id
    action.value = payload.action
    floor.value = payload.floor
    userInput.value = {
        contentInput: undefined,
        reduceOlo: false,
    }
    showThis.value = true
}

function submitHandle() {
    formRef.value?.validate((errors) => {
        if (errors) {
            window.$message.error('请确认信息填写完整')
            return
        }

        emit('submit', {
            id: itemId.value,
            action: action.value,
            reason: userInput.value.contentInput!,
            reduceOlo: ['delete', 'deleteAll'].includes(action.value) ? userInput.value.reduceOlo : false,
        })
        showThis.value = false
    })
}

defineExpose({ show })
</script>

<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" :title="actionLabels[action]" closable
            @close="showThis = false" size="small">
            <n-flex vertical>
                <n-text style="white-space: pre-wrap;">{{ contentMessage }}</n-text>
                <n-form ref="formRef" :model="userInput" label-placement="left" label-width="auto" :rules="inputRules"
                    :size="commonStore.isMobile ? 'small' : 'medium'" style="margin-top: 10px;">
                    <n-form-item label="理由" path="contentInput">
                        <f-input placeholder="必填" v-model:value="userInput.contentInput" />
                    </n-form-item>
                    <n-form-item v-if="['delete', 'deleteAll'].includes(action)" label="罚款olo" path="reduceOlo">
                        <n-switch v-model:value="userInput.reduceOlo" />
                        <n-text style="margin-left: 6px;">每个帖子罚款500，封顶5000个olo</n-text>
                    </n-form-item>
                </n-form>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <f-button type="warning" @click="submitHandle">提交</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>
