<template>
    <n-card title="密码设定" size="small">
        <n-flex vertical>
            <!-- 说明 -->
            <div>
                <n-text :depth="3">说明：</n-text>
                <span>新饼干无密码。建议尽快设定密码，以免饼干遗失。</span>
            </div>

            <!-- 数据输入 -->
            <n-form ref="formRef" :model="userInput" label-placement="left" label-width="auto" style="max-width: 400px;"
                :rules="inputRules" :size="commonStore.isMobile ? 'small' : 'medium'">
                <n-form-item label="旧密码" path="passwordOld">
                    <f-input v-model:value="userInput.passwordOld" placeholder="(选填)如果未设定密码可以留空" type="password"
                        :maxlength="20" :minlength="7" :show-password-on="'click'" />
                </n-form-item>
                <n-form-item label="密码" path="passwordNew">
                    <f-input v-model:value="userInput.passwordNew" placeholder="7~20个字符(字母、数字、下划线)" type="password"
                        :maxlength="20" :minlength="7" :show-password-on="'click'" />
                </n-form-item>
                <n-form-item label="重复密码" path="passwordRepeat">
                    <f-input v-model:value="userInput.passwordRepeat" placeholder="再次输入密码" type="password"
                        :maxlength="20" :minlength="7" :show-password-on="'click'" @keyup.enter="setPasswordHandle" />
                </n-form-item>
            </n-form>

            <!-- 提交按钮 -->
            <n-flex size="small" :align="'center'">
                <f-button type="primary" :loading="setPasswordLoading" :disabled="setPasswordLoading"
                    @click="setPasswordHandle">提交</f-button>
                <n-text :depth="3">请务必保存好新密码喔</n-text>
            </n-flex>

        </n-flex>
    </n-card>
</template>

<script setup lang="ts">

import { useTopbarNavControl } from '@/js/func/topbarNav'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { FButton, FCheckbox, FInput } from '@custom'
import { SearchOutline as SearchIcon } from '@vicons/ionicons5'
import { useFetcher, useRequest, useWatcher } from 'alova'
import { NCard, NFlex, NForm, NFormItem, NText, type FormInst, type FormItemRule, type FormRules } from 'naive-ui'
import { computed, h, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userSetPasswordPoster, type userSetPasswordParams } from '@/api/methods/auth'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const formRef = ref<FormInst | null>(null)


//输入数据
interface userInputInterface {
    passwordOld: string | null,
    passwordNew: string | null,
    passwordRepeat: string | null,
}
const userInput = ref<userInputInterface>({
    passwordOld: null,
    passwordNew: null,
    passwordRepeat: null,
})

//数据验证规则
const inputRules: FormRules = {
    passwordOld: {
        required: false
    },
    passwordNew: {
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
        validator: (rule: FormItemRule, value: string) => value === userInput.value.passwordNew,
        message: '密码不一致',
        trigger: 'blur'
    },
}

//提交变更密码
const { loading: setPasswordLoading, send: setPasswordSend, onSuccess: setPasswordOnSuccess } = useRequest(
    (params: userSetPasswordParams) => userSetPasswordPoster(params),
    { immediate: false }
);
setPasswordOnSuccess(() => {
    userInput.value.passwordOld = null
    userInput.value.passwordNew = null
    userInput.value.passwordRepeat = null
})
function setPasswordHandle() {
    formRef.value?.validate((errors) => {
        if (errors) {
            window.$message.error('请确认信息填写完整')
        } else {
            const params: userSetPasswordParams = {
                binggan: userStore.binggan!,
                old_password: userInput.value.passwordOld!,
                new_password: userInput.value.passwordNew!,
            }
            setPasswordSend(params)
        }
    })
}







</script>