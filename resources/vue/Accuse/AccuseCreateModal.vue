<script setup lang="ts">
import type { AccuseCreateParams } from '@/api/methods/accuse'
import { useCommonStore } from '@/stores/common'
import { FButton, FInput, FInputGroupLabel } from '@custom'
import { NCard, NFlex, NInputGroup, NModal } from 'naive-ui'
import { reactive, shallowRef } from 'vue'

const commonStore = useCommonStore()

const showThis = shallowRef(false)
const form = reactive<AccuseCreateParams>({
    thread_id: 0,
    post_id: 0,
    floor: 0,
    reason: '',
})

const emit = defineEmits<{
    submit: [params: AccuseCreateParams],
    close: [],
}>()

function show(params: Omit<AccuseCreateParams, 'reason'>) {
    form.thread_id = params.thread_id
    form.post_id = params.post_id
    form.floor = params.floor
    form.reason = ''
    showThis.value = true
}

function close() {
    showThis.value = false
    emit('close')
}

function handleShowUpdate(value: boolean) {
    showThis.value = value
    if (!value) {
        emit('close')
    }
}

function submitHandle() {
    if (form.reason.trim().length < 5) {
        window.$message.error('举报理由不少于5字')
        return
    }

    emit('submit', {
        thread_id: form.thread_id,
        post_id: form.post_id,
        floor: form.floor,
        reason: form.reason.trim(),
    })
    showThis.value = false
}

defineExpose({ show })
</script>

<template>
    <n-modal :show="showThis" display-directive="if" @update:show="handleShowUpdate">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="新增举报" closable size="small" @close="close">
            <n-flex vertical>
                <n-input-group>
                    <f-input-group-label style="width: 5.5rem;">主题ID</f-input-group-label>
                    <f-input :value="String(form.thread_id)" disabled />
                </n-input-group>
                <n-input-group>
                    <f-input-group-label style="width: 5.5rem;">回复楼层</f-input-group-label>
                    <f-input :value="'№' + form.floor" disabled />
                </n-input-group>
                <f-input v-model:value="form.reason" type="textarea" placeholder="填写举报理由（至少5字）&#10;为提升效率，请附上具体楼规、缩写、花名等&#10;如需举报多条，请在这里说明" :maxlength="500" show-count />
            </n-flex>

            <template #action>
                <n-flex justify="end">
                    <f-button @click="close">取消</f-button>
                    <f-button type="primary" @click="submitHandle">提交</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>
