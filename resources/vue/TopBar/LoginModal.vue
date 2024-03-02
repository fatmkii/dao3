<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: maxWidth }" title="欢迎来到小火锅！" closable @close="showThis = false" size="small">
            <n-flex vertical>
                <div>这里是私人论坛，欢迎来玩！<br>QQ小火锅避难群：156840110 <br>使用前需要在下面申请或者导入饼干喔</div>
                <n-input-group>
                    <f-input-group-label style="width: 3.2rem;">饼干</f-input-group-label>
                    <f-input v-model:value="inputBinggan" placeholder="请输入饼干" maxlength="9" show-count
                        @keyup.enter="loginHandle" />
                </n-input-group>
                <n-input-group>
                    <f-input-group-label style="width: 3.2rem;" class="round">密码</f-input-group-label>
                    <f-input type="password" placeholder="（可留空）请输入密码" show-password-on="mousedown"
                        v-model:value="inputPassword" @keyup.enter="loginHandle" />
                </n-input-group>
                <n-flex>
                    <n-popover placement="bottom" trigger="hover" :disabled="newBingganEnable">
                        <template #trigger>
                            <f-button type="warning"
                                :disabled="userRegisterLoading || !newBingganEnable || regitserRecordTTL.reg_record_TTL > 0"
                                @click="registerHandle">
                                我想领取新饼干！
                            </f-button>
                        </template>
                        <n-text>嗷！很抱歉，领取新饼干目前暂停中…… </n-text>
                    </n-popover>
                    <f-button style="margin-left: auto;" type="primary" @click="loginHandle"
                        :disabled="userLoginLoading">导入饼干</f-button>
                </n-flex>
            </n-flex>

            <template #action>
                <n-flex justify="end">
                    <n-text v-if="regitserRecordTTL.reg_record_TTL > 0" style="margin-right: auto;">
                        {{ regitserRecordMessage }}
                    </n-text>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { userLoginPoster } from '@/api/methods/auth';
import { newBingganEnableGetter } from '@/api/methods/globalSetting';
import { userRegisterPoster } from '@/api/methods/user';
import { checkRegisterRecordGetter, type checkRegisterRecordData } from '@/api/methods/user';
import { getUUID } from '@/js/func/getUUID';
import { useUserStore } from '@/stores/user';
import { FButton, FInput, FInputGroupLabel } from '@custom'
import { useRequest } from 'alova';
import { NCard, NFlex, NInputGroup, NModal, NPopover, NText } from 'naive-ui';
import { computed, ref } from 'vue';

//计算modal最大宽度（手机版时候两侧各留16px的空位）
const maxWidth = computed<string>(() => {
    const screenWidth = window.innerWidth
    if (screenWidth >= 500 + 16 + 16) {
        return '500px'
    } else {
        return screenWidth - 32 + 'px'
    }
})

//将唤醒modal的方法暴露给父组件
const showThis = ref<boolean>(false)
const show = () => (showThis.value = true)
defineExpose({ show })

//输入数据
const inputBinggan = ref<string>('')
const inputPassword = ref<string>('')


//向服务器确认是否可以申请饼干
const { data: newBingganEnable } = useRequest(newBingganEnableGetter, { initialData: false })
//向服务器确认目前IP是否可以注册
const { data: regitserRecordTTL } = useRequest(checkRegisterRecordGetter(), { initialData: { reg_record_TTL: -2 } })
const regitserRecordMessage = computed(() => {
    if (regitserRecordTTL.value?.reg_record_TTL <= 0) {
        return undefined
    } else {
        return `在${Math.floor(regitserRecordTTL.value?.reg_record_TTL / 3600)}小时后才能再次领取饼干。`
    }
})

//导入饼干
const loginHandle = () => {
    postUserLogin(inputBinggan.value, inputPassword.value)
    inputPassword.value = ""
}
const { loading: userLoginLoading,
    onSuccess: userLoginOnSuccess,
    data: userLoginData,
    send: postUserLogin }
    = useRequest(userLoginPoster, { immediate: false })
userLoginOnSuccess(() => {
    localStorage.Token = userLoginData.value.token
    localStorage.Binggan = userLoginData.value.binggan
    window.location.href = "/"; //因为希望从头刷新整个程序状态，所以用js原生的重定向，而不是Vuerouter的push
})

//申请饼干
const registerHandle = () => { postUserRegister(getUUID()) }
const { loading: userRegisterLoading,
    onSuccess: userRegisterOnSuccess,
    onError: userRegisterOnError,
    data: userRegisterData,
    send: postUserRegister }
    = useRequest(userRegisterPoster, { immediate: false })
userRegisterOnSuccess(() => {
    const userStore = useUserStore()
    userStore.binggan = userRegisterData.value.binggan
    localStorage.Token = userRegisterData.value.token
    localStorage.Binggan = userRegisterData.value.binggan
    showThis.value = false
    emit('submitRegister')
})
userRegisterOnError((event) => {
    window.$dialog.error({
        title: '申请饼干失败',
        content: event.error.message,
    })
})
//用于成功申请饼干提示modal的事件
const emit = defineEmits(['submitRegister'])



</script>
