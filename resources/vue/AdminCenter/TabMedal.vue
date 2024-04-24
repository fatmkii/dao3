<template>
    <n-form ref="formRef" :model="formInput" label-placement="left" label-width="auto" :rules="inputRules"
        :size="commonStore.isMobile ? 'small' : 'medium'" style="max-width: 300px;">
        <n-form-item label="目标饼干" path="binggan">
            <f-input v-model:value="formInput.binggan" />
        </n-form-item>
        <n-form-item label="发放成就" path="medalId">
            <n-select v-model:value="formInput.medalId" :options="medalOptions"
                :menu-props="{ style: { borderRadius: '10px' } }" />
        </n-form-item>
        <f-button type="primary" :loading="createMedalHandling" :disabled="createMedalHandling"
            @click="createMedalHandle">提交</f-button>
    </n-form>
</template>

<script setup lang="ts">

import { createMedalPoster, type createMedalParams } from '@/api/methods/admin'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { FInput, FButton } from '@custom'
import { useRequest } from 'alova'
import { NForm, NSelect, NFormItem, NSwitch, NText, useThemeVars, type FormInst, type FormRules } from 'naive-ui'
import { computed, onMounted, ref, watch } from 'vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const themeVars = useThemeVars()
const formRef = ref<FormInst | null>(null)

//输入的数据
const formInput = ref<{ binggan: string, medalId: number }>(
    { binggan: '', medalId: 181 }
)

//数据验证规则
const inputRules: FormRules = {
    binggan: {
        required: true,
        message: '请填写目标饼干',
        trigger: 'blur'
    },
    medalId: {
        required: true,
        message: '请选择要发放的成就',
        type: 'number',
        trigger: 'blur'
    },
}

//可选的成就
const medalOptions = [
    { value: 181, label: "皇家御用画宗" },
    { value: 182, label: "小火锅守护者" },
]

//提交
const { loading: createMedalHandling,
    send: createMedalPosterSend,
    onSuccess: createMedalOnSuccess,
    onError: createMedalOnError, } = useRequest((params: createMedalParams) => createMedalPoster(params), { immediate: false })
createMedalOnSuccess(() => {
    formInput.value.binggan = ''
})
createMedalOnError(() => {
    formInput.value.binggan = ''
})
function createMedalHandle() {
    formRef.value?.validate((errors) => {
        if (errors) {
            window.$message.error('请确认信息填写完整')
            return
        } else {
            const params: createMedalParams = {
                binggan: userStore.binggan!,
                binggan_target: formInput.value.binggan,
                medal_id: formInput.value.medalId,
            }
            const medalName = medalOptions.find((item) => item.value === formInput.value.medalId)
            const dialogArgs = {
                title: '发放成就',
                closable: false,
                content: `对象饼干：${formInput.value.binggan}  发放成就：${medalName?.label}`,
                positiveText: '确定',
                negativeText: '取消',
                onPositiveClick: () => {
                    createMedalPosterSend(params)
                },
            }
            window.$dialog.warning(dialogArgs)
        }
    })


}



</script>
