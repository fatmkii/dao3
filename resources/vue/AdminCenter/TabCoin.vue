<template>
    <n-form ref="formRef" :model="formInput" label-placement="left" label-width="auto" :rules="inputRules"
        :size="commonStore.isMobile ? 'small' : 'medium'" style="max-width: 300px;">
        <n-form-item label="目标饼干" path="binggan">
            <f-input v-model:value="formInput.binggan" />
        </n-form-item>
        <n-form-item label="奖罚olo" path="olo">
            <n-input-number v-model:value="formInput.olo" :max="1000000" :min="-1000000" :step="1000"
                :parse="inputNumberParse" :format="inputNumberFormat" placeholder="正数是奖励，负数是罚款" />
        </n-form-item>
        <n-form-item label="附带留言" path="message">
            <f-input v-model:value="formInput.message" placeholder="将显示在收支记录" />
        </n-form-item>
        <f-button type="primary" :loading="setUserOloHandling" :disabled="setUserOloHandling"
            @click="setUserOloHandle">提交</f-button>
    </n-form>
</template>

<script setup lang="ts">
import { setUserOloPoster, type setUserOloParams } from '@/api/methods/admin'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { FButton, FInput } from '@custom'
import { useRequest } from 'alova'
import { NForm, NFormItem, NInputNumber, type FormInst, type FormRules } from 'naive-ui'
import { ref } from 'vue'
import { inputNumberFormat, inputNumberParse } from '@/js/func/inputNumberFormat';

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const formRef = ref<FormInst | null>(null)

//输入的数据
const formInput = ref<{ binggan: string, olo: number | undefined, message: string }>(
    { binggan: '', olo: undefined, message: '' }
)

//数据验证规则
const inputRules: FormRules = {
    binggan: {
        required: true,
        message: '请填写目标饼干',
        trigger: 'blur'
    },
    message: {
        required: false,
    },
    olo: {
        required: true,
        message: '请选择要奖罚的olo',
        type: 'number',
        trigger: 'blur'
    },
}

//提交
const { loading: setUserOloHandling,
    send: setUserOloPosterSend,
    onSuccess: setUserOloOnSuccess,
    onError: setUserOloOnError, } = useRequest((params: setUserOloParams) => setUserOloPoster(params), { immediate: false })
setUserOloOnSuccess(() => {
    formInput.value.binggan = ''
})
setUserOloOnError(() => {
    formInput.value.binggan = ''
})
function setUserOloHandle() {
    formRef.value?.validate((errors) => {
        if (errors) {
            window.$message.error('请确认信息填写完整')
            return
        } else {
            const params: setUserOloParams = {
                binggan: userStore.binggan!,
                binggan_target: formInput.value.binggan,
                olo_num: formInput.value.olo!,
                olo_message: formInput.value.message,
            }
            const actionName = formInput.value.olo! > 0 ? '奖励' : '罚款'
            const dialogArgs = {
                title: '奖罚olo',
                closable: false,
                content: `对象饼干：${formInput.value.binggan} ${actionName}${formInput.value.olo}个olo`,
                positiveText: '确定',
                negativeText: '取消',
                onPositiveClick: () => {
                    setUserOloPosterSend(params)
                },
            }
            window.$dialog.warning(dialogArgs)
        }
    })
}

</script>
