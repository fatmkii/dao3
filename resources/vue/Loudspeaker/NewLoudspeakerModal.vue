<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="发布大喇叭" closable @close="showThis = false"
            size="small">
            <div>
                价格暂定为5000个olo（每天）<br>
                禁止发布辱骂、诅咒、黑锦鲤等方面情绪。
            </div>
            <n-form ref="formRef" :model="userInput" label-placement="left" label-width="auto" :rules="inputRules"
                :size="commonStore.isMobile ? 'small' : 'medium'" style="margin-top: 10px;">

                <n-form-item label="生效时间" path="effectiveDate">
                    <n-date-picker v-model:formatted-value="userInput.effectiveDate" value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime" :size="commonStore.isMobile ? 'small' : 'medium'" />
                </n-form-item>
                <n-form-item label="生效天数" path="days">
                    <n-input-number v-model:value="userInput.days" :max="3" :min="1" :step="1" placeholder="1-3天" />
                </n-form-item>
                <n-form-item label="内容" path="content">
                    <f-input placeholder="最多100字" type="textarea" maxlength="100" show-count
                        :autosize="{ minRows: 3, maxRows: 5 }" v-model:value="userInput.content" />
                </n-form-item>
                <n-form-item label="设定颜色" path="color">
                    <n-switch v-model:value="useColor" />
                    <n-color-picker v-model:value="userInput.color" :modes="['hex']" :show-alpha="false"
                        style="max-width: 7rem;margin-left: 12px;" v-show="useColor" />
                </n-form-item>
                <n-form-item label="链接主题" path="threadId">
                    <f-input v-model:value="userInput.threadId" placeholder="主题网址的ID（可留空）" />
                </n-form-item>

                <n-form-item label="设为置顶" path="subId" v-if="userStore.admin.isSuperAdmin">
                    <n-switch @update:value="(value: string) => userInput.subId = value" :checked-value="10"
                        unchecked-value="1" />
                </n-form-item>
            </n-form>
            <template #action>
                <n-flex justify="end">
                    <f-button type="primary" :disable="newLoudspeakerLoading" :loading="newLoudspeakerLoading"
                        @click="newLoudspeakerHandle">发布</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { newLoudspeakerPoster, type newLoudspeakerParams } from '@/api/methods/loudspeaker';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton, FInput } from '@custom';
import { useRequest } from 'alova';
import dayjs from 'dayjs';
import { NCard, NColorPicker, NDatePicker, NFlex, NForm, NFormItem, NInputNumber, NModal, NSwitch, type FormInst, type FormRules } from 'naive-ui';
import { ref } from 'vue';

//基础数据
const commonStore = useCommonStore()
const userStore = useUserStore()
const formRef = ref<FormInst | null>(null)

//输入数据
const userInput = ref({
    subId: '1',
    content: undefined as string | undefined,
    color: undefined as string | undefined,
    threadId: undefined as string | undefined,
    days: 1,
    effectiveDate: dayjs.tz().format('YYYY-MM-DD HH:mm:ss'),
})
const useColor = ref<boolean>(false)

//数据验证规则
const inputRules: FormRules = {
    effectiveDate: {
        required: true,
        message: '请选择生效日期和时间',
        // trigger: 'blur'
    },
    days: {
        required: true,
        message: '请填写生效天数',
        type: 'number',
        // trigger: 'blur'
    },
    content: {
        required: true,
        message: '请填写内容',
        // trigger: 'blur'
    },
    color: {
        required: false,
    },
    threadId: {
        required: false,
    },
    subId: {
        required: false,
    },
}

//来自父组件的唤醒emit和传递的payload
const showThis = ref<boolean>(false)
function show() {
    showThis.value = true
}
defineExpose({ show })

//各种emit
const emit = defineEmits<{
    refreshLoudspeaker: [],
}>()


//发布新的大喇叭
const { loading: newLoudspeakerLoading,
    send: newLoudspeakerSend } = useRequest(
        (params: newLoudspeakerParams) => newLoudspeakerPoster(params), { immediate: false }
    );
function newLoudspeakerHandle() {
    formRef.value?.validate((errors) => {
        if (errors) {
            window.$message.error('请确认信息填写完整')
        } else {
            const params: newLoudspeakerParams = {
                binggan: userStore.binggan!,
                sub_id: userInput.value.subId,
                content: userInput.value.content!,
                color: useColor ? userInput.value.color : undefined,
                thread_id: userInput.value.threadId,
                effective_date: userInput.value.effectiveDate,
                days: userInput.value.days,
            }
            newLoudspeakerSend(params).then(() => {
                emit('refreshLoudspeaker')
                showThis.value = false
            })
        }
    })


}


</script>
