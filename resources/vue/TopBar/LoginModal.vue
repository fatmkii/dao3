<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="欢迎来到小火锅！" closable @close="showThis = false"
            size="small">
            <n-flex vertical>
                <div>这里是私人论坛小火锅，欢迎来玩！<br>QQ小火锅避难群：156840110 <br>使用前需要在下面领取或者导入饼干喔</div>
                <!-- 输入框 -->
                <n-input-group>
                    <f-input-group-label style="width: 3.2rem;">饼干</f-input-group-label>
                    <f-input v-model:value="inputBinggan" placeholder="请输入饼干" maxlength="16"
                        @keyup.enter="loginHandle" />
                </n-input-group>
                <n-input-group>
                    <f-input-group-label style="width: 3.2rem;" class="round">密码</f-input-group-label>
                    <f-input type="password" placeholder="（可留空）请输入密码" show-password-on="mousedown"
                        v-model:value="inputPassword" @keyup.enter="loginHandle" />
                </n-input-group>
                <!-- 领取饼干按钮和导入饼干按钮 -->
                <n-flex>
                    <f-button type="warning"
                        :disabled="userRegisterLoading || !newBingganData.enable || regitserRecordTTL.reg_record_TTL > 0"
                        @click="registerHandle">
                        {{ newBingganButtonText }}
                    </f-button>
                    <f-button style="margin-left: auto;" type="primary" @click="loginHandle"
                        :disabled="userLoginLoading">导入饼干</f-button>
                </n-flex>
                <!-- 开发时间说明文字 -->
                <template v-if="!newBingganData.enable">
                    <n-popover trigger="hover">
                        <template #trigger>
                            <span>领取饼干为定期开放（点击查看开放时间）</span>
                        </template>
                        <span>开放时间为：<br>每月第1日、春节(3天)、国庆(3天)、<br>端午、中秋、618和双十一</span>
                    </n-popover>
                    <div>下次开放：{{ nextDataText }}</div>
                </template>
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
import { newBingganCheckGetter } from '@/api/methods/common';
import { checkRegisterRecordGetter, userRegisterPoster } from '@/api/methods/user';
import { getUUID } from '@/js/func/getUUID';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton, FInput, FInputGroupLabel } from '@custom';
import { useRequest } from 'alova';
import { NCard, NFlex, NInputGroup, NModal, NPopover, NText } from 'naive-ui';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';


//基础数据
const commonStore = useCommonStore()
const userStore = useUserStore()

//将唤醒modal的方法暴露给父组件
const showThis = ref<boolean>(false)
const show = () => (showThis.value = true)
defineExpose({ show })

//输入数据
const inputBinggan = ref<string>('')
const inputPassword = ref<string>('')

//提示文字
const newBingganButtonText = computed<string>(() => {
    return newBingganData.value.enable ? "领取饼干开放中！" : "领取饼干尚未开放"
})
const nextDataText = computed<string>(() => {
    return dayjs(newBingganData.value.next_date * 1000).format('YYYY年M月D日')
})

//向服务器确认是否可以申请饼干
const { data: newBingganData } = useRequest(newBingganCheckGetter, { initialData: { enable: false, next_date: 0 } })
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
