<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="验证码" closable @close="showThis = false"
            size="small">
            <n-flex vertical>
                <n-text>
                    嗷……你可能刷太多了，休息一下吧。
                </n-text>
                <n-input-group>
                    <f-input-group-label style="width: 3.2rem;" class="round">输入</f-input-group-label>
                    <f-input placeholder="请输入验证码" maxlength="4" show-count v-model:value="captchaInput"
                        @keyup.enter="waterUnlockHandle" />
                </n-input-group>
                <img v-if="!captchaLoading" :src="'data:image/png;base64,' + captchaData.captcha_img"
                    style="max-width: 200px;" @click="handleFetchCaptchaData" />
                <n-text>
                    点击可更换验证码。不区分大小写。
                </n-text>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <f-button type="primary" @click="waterUnlockHandle" :loading="waterUnlockLoading"
                        :disabled="waterUnlockLoading">提交</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { captchaGetter, type captchaData } from '@/api/methods/common';
import { waterUnlockPoster, type waterUnlockParams } from '@/api/methods/user';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton, FInput, FInputGroupLabel } from '@custom';
import { useFetcher, useRequest } from 'alova';
import { NCard, NFlex, NInputGroup, NModal, NText } from 'naive-ui';
import { computed, ref } from 'vue';

//基础数据
const commonStore = useCommonStore()
const userStore = useUserStore()

//输入数据
const captchaInput = ref<string>()
const captchaKey = computed(() => captchaData.value.captcha_key)

//来自父组件的唤醒emit
const showThis = ref<boolean>(false)
function show() {
    showThis.value = true
    sendCaptchaGetter()
}
defineExpose({ show })

//各种emit
const emit = defineEmits<{
    waterUnlockOnSuccess: [],
}>()

//获取验证码
const { data: captchaData, loading: captchaLoading, send: sendCaptchaGetter } = useRequest(captchaGetter, { immediate: false })
const { fetch: fetchCaptchaData } = useFetcher();
function handleFetchCaptchaData() {
    fetchCaptchaData(captchaGetter())
}

//提交验证码
const { loading: waterUnlockLoading, send: waterUnlockSend, onSuccess: waterUnlockOnSuccess, onError: waterUnlockOnError } = useRequest((params: waterUnlockParams) => waterUnlockPoster(params), { immediate: false })
function waterUnlockHandle() {
    if (!captchaInput.value) {
        window.$message.error('验证码不能为空')
        return
    }
    const params: waterUnlockParams = {
        binggan: userStore.binggan!,
        captcha_code: captchaInput.value,
        captcha_key: captchaKey.value
    }
    waterUnlockSend(params)
    waterUnlockOnSuccess(() => {
        captchaInput.value = ""
        showThis.value = false
        emit('waterUnlockOnSuccess')
    })
    waterUnlockOnError(() => {
        captchaInput.value = ""
        handleFetchCaptchaData()
    })
}

</script>
