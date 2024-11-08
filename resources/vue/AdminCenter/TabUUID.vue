<template>
    <n-form ref="formRef" :model="formInput" label-placement="left" label-width="auto" :rules="inputRules"
        :size="commonStore.isMobile ? 'small' : 'medium'" style="max-width: 300px;">
        <n-form-item label="解锁UUID" path="uuid">
            <f-input v-model:value="formInput.uuid" />
        </n-form-item>
        <f-button type="primary" :loading="unlockUuidHandling" :disabled="unlockUuidHandling"
            @click="unlockUuidHandle">提交</f-button>
    </n-form>
</template>

<script setup lang="ts">

import { unlockUuidPoster, type unlockUuidParams } from '@/api/methods/admin'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { FButton, FInput } from '@custom'
import { useRequest } from 'alova'
import { NForm, NFormItem, type FormInst, type FormRules } from 'naive-ui'
import { ref } from 'vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const formRef = ref<FormInst | null>(null)

//输入的数据
const formInput = ref<{ uuid: string }>(
    { uuid: '' }
)

//数据验证规则
const inputRules: FormRules = {
    uuid: {
        required: true,
        message: '请填写目标UUID',
        trigger: 'blur'
    },
}

//提交
const { loading: unlockUuidHandling,
    send: unlockUuidPosterSend,
    onSuccess: unlockUuidOnSuccess,
    onError: unlockUuidOnError, } = useRequest((params: unlockUuidParams) => unlockUuidPoster(params), { immediate: false })
unlockUuidOnSuccess(() => {
    formInput.value.uuid = ''
})
function unlockUuidHandle() {
    formRef.value?.validate((errors) => {
        if (errors) {
            window.$message.error('请确认信息填写完整')
            return
        } else {
            const params: unlockUuidParams = {
                binggan: userStore.binggan!,
                uuid: formInput.value.uuid,
            }
            unlockUuidPosterSend(params)
        }
    })
}



</script>
