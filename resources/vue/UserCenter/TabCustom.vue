<template>
    <n-card title="定制饼干" size="small">
        <n-flex vertical>
            <!-- 说明 -->
            <div>
                <n-text :depth="3">说明：</n-text>
                <span>可自由输入名称的定制饼干</span>
            </div>
            <div>
                <n-text :depth="3">价格：</n-text>
                <span>10万 olo</span>
            </div>

            <!-- 数据输入 -->
            <n-form ref="formRef" :model="userInput" label-placement="left" label-width="auto" style="max-width: 400px;"
                :rules="inputRules" :size="commonStore.isMobile ? 'small' : 'medium'">
                <n-form-item label="定制饼干" path="bingganApply">
                    <f-input v-model:value="userInput.bingganApply" placeholder="7~16个字符(字母、数字、下划线)" :maxlength="16"
                        :minlength="7" />
                </n-form-item>
                <n-form-item label="密码" path="password">
                    <f-input v-model:value="userInput.password" placeholder="7~20个字符(字母、数字、下划线)" type="password"
                        :maxlength="20" :minlength="7" :show-password-on="'click'" />
                </n-form-item>
                <n-form-item label="重复密码" path="passwordRepeat">
                    <f-input v-model:value="userInput.passwordRepeat" placeholder="再次输入密码" type="password"
                        :maxlength="20" :minlength="7" :show-password-on="'click'" @keyup.enter="newCustomBingganHandle" />
                </n-form-item>
            </n-form>

            <!-- 提交按钮 -->
            <n-flex size="small" :align="'center'">
                <f-button type="primary" :loading="newCustomBingganLoading" :disabled="newCustomBingganLoading"
                    @click="newCustomBingganHandle">提交</f-button>
                <n-text :depth="3">请务必保存好饼干和密码喔</n-text>
            </n-flex>

        </n-flex>
    </n-card>
</template>

<script setup lang="ts">

import { newCustomBingganPoster, type newCustomBingganParams } from '@/api/methods/user'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { FButton, FInput } from '@custom'
import { useRequest } from 'alova'
import { NCard, NFlex, NForm, NFormItem, NText, type FormInst, type FormItemRule, type FormRules } from 'naive-ui'
import { ref } from 'vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const formRef = ref<FormInst | null>(null)


//输入数据
interface userInputInterface {
    bingganApply: string | null,
    password: string | null,
    passwordRepeat: string | null,
}
const userInput = ref<userInputInterface>({
    bingganApply: null,
    password: null,
    passwordRepeat: null,
})

//数据验证规则
const inputRules: FormRules = {
    bingganApply: {
        required: true,
        validator: (rule: FormItemRule, value: string) => {
            const regExp = /^[a-zA-Z0-9_]+$/;
            if (value === null) {
                return new Error('请输入要定制的饼干')
            } else if (!regExp.test(value)) {
                return new Error('只能是数字、英文、下划线')
            } else if (value.length < 7) {
                return new Error('最少需要7个字符')
            } else if (value.length > 16) {
                return new Error('最多16个字符')
            }
            return true
        },
        trigger: 'blur'
    },
    password: {
        required: true,
        validator: (rule: FormItemRule, value: string) => {
            const regExp = /^[a-zA-Z0-9_]+$/;
            if (value === null) {
                return new Error('请输入密码')
            } else if (!regExp.test(value)) {
                return new Error('只能是数字、英文、下划线')
            } else if (value.length < 7) {
                return new Error('最少需要7个字符')
            } else if (value.length > 20) {
                return new Error('最多20个字符')
            }
            return true
        },
        trigger: 'blur'
    },
    passwordRepeat: {
        required: true,
        validator: (rule: FormItemRule, value: string) => value === userInput.value.password,
        message: '密码不一致',
        trigger: 'blur'
    },
}

//提交申请定制饼干
const { loading: newCustomBingganLoading, send: newCustomBingganSend, onSuccess: newCustomBingganOnSuccess } = useRequest(
    (params: newCustomBingganParams) => newCustomBingganPoster(params),
    { immediate: false }
);
newCustomBingganOnSuccess(() => {
    userStore.refreshUserData() //刷新用户数据
    userInput.value.password = null
    userInput.value.passwordRepeat = null
})
function newCustomBingganHandle() {
    formRef.value?.validate((errors) => {
        if (errors) {
            window.$message.error('请确认信息填写完整')
        } else {
            const dialogArgs = {
                title: '申请定制饼干',
                closable: false,
                content: `申请的定制饼干：${userInput.value.bingganApply}`,
                positiveText: '确定',
                negativeText: '取消',
                onPositiveClick: () => {
                    const params: newCustomBingganParams = {
                        binggan: userStore.binggan!,
                        binggan_apply: userInput.value.bingganApply!,
                        password: userInput.value.password!,
                    }
                    newCustomBingganSend(params)
                },
            }
            window.$dialog.success(dialogArgs)
        }
    })
}




</script>