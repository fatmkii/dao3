<template>
    <n-flex style="max-width: 450px;">
        <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;">
            <n-text style="font-size: 0.875rem;">奖罚olo </n-text>
        </n-divider>
        <n-form ref="oloFormRef" :model="oloFormInput" label-placement="left" label-width="auto" :rules="oloInputRules"
            :size="commonStore.isMobile ? 'small' : 'medium'" style="max-width: 300px;">
            <n-form-item label="目标饼干" path="binggan">
                <f-input v-model:value="oloFormInput.binggan" />
            </n-form-item>
            <n-form-item label="奖罚olo" path="olo">
                <n-input-number v-model:value="oloFormInput.olo" :max="1000000" :min="-1000000" :step="1000"
                    :parse="inputNumberParse" :format="inputNumberFormat" placeholder="正数是奖励，负数是罚款" />
            </n-form-item>
            <n-form-item label="附带留言" path="message">
                <f-input v-model:value="oloFormInput.message" placeholder="将显示在收支记录" />
            </n-form-item>
            <f-button type="primary" :loading="setUserOloHandling" :disabled="setUserOloHandling"
                @click="setUserOloHandle">提交</f-button>
        </n-form>
        <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;">
            <n-text style="font-size: 0.875rem;">解锁UUID </n-text>
        </n-divider>
        <n-form ref="uuidFormRef" :model="uuidFormInput" label-placement="left" label-width="auto"
            :rules="uuidInputRules" :size="commonStore.isMobile ? 'small' : 'medium'" style="max-width: 450px;">
            <n-form-item label="解锁UUID" path="uuid">
                <f-input v-model:value="uuidFormInput.uuid" />
            </n-form-item>
            <f-button type="primary" :loading="unlockUuidHandling" :disabled="unlockUuidHandling"
                @click="unlockUuidHandle">提交</f-button>
        </n-form>
        <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;">
            <n-text style="font-size: 0.875rem;">主题转区 </n-text>
        </n-divider>
        <n-form ref="transferFormRef" :model="transferFormInput" label-placement="left" label-width="auto"
            :rules="transferInputRules" :size="commonStore.isMobile ? 'small' : 'medium'" style="max-width: 450px;">
            <n-form-item label="主题ID" path="thread_id">
                <n-input-number :show-button='false' v-model:value="transferFormInput.thread_id" :max='1000000'
                    :min="1" />
            </n-form-item>
            <n-form-item label="目标小岛" path="forum_id">
                <n-select v-model:value="transferFormInput.forum_id" :options="forumsOptions"
                    :consistent-menu-width="false" style="width: 300px" />
            </n-form-item>
            <n-form-item label="解锁日清" path="nissin_clear">
                <n-switch v-model:value="transferFormInput.nissin_clear" />
            </n-form-item>
            <f-button type="primary" :loading="transferThreadHandling" :disabled="transferThreadHandling"
                @click="transferThreadHandle">提交</f-button>
        </n-form>
        <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;">
            <n-text style="font-size: 0.875rem;">发放成就 </n-text>
        </n-divider>
        <n-form ref="formRef" :model="medalFormInput" label-placement="left" label-width="auto" :rules="medalInputRules"
            :size="commonStore.isMobile ? 'small' : 'medium'" style="max-width: 300px;">
            <n-form-item label="目标饼干" path="binggan">
                <f-input v-model:value="medalFormInput.binggan" />
            </n-form-item>
            <n-form-item label="发放成就" path="medalId">
                <n-select v-model:value="medalFormInput.medalId" :options="medalOptions"
                    :menu-props="{ style: { borderRadius: '10px' } }" />
            </n-form-item>
            <f-button type="primary" :loading="createMedalHandling" :disabled="createMedalHandling"
                @click="createMedalHandle">提交</f-button>
        </n-form>
        <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;">
            <n-text style="font-size: 0.875rem;">解密水印 </n-text>
        </n-divider>
        <n-form ref="watermarkFormRef" :model="watermarkFormInput" label-placement="left" label-width="auto"
            :rules="watermarkInputRules" :size="commonStore.isMobile ? 'small' : 'medium'" style="max-width: 450px;">
            <n-form-item label="水印字符串" path="watermark_string">
                <f-input v-model:value="watermarkFormInput.watermark_string" />
            </n-form-item>
            <f-button type="primary" :loading="watermarkDecodeHandling" :disabled="watermarkDecodeHandling"
                @click="watermarkDecodeHandle">提交</f-button>
            <div v-if="watermarkFormInput.result_binggan !== null" style="margin-top: 10px;">
                <n-text>饼干：{{ watermarkFormInput.result_binggan }}</n-text><br />
                <n-a :href="'/thread/' + watermarkFormInput.result_thread_id" target="_blank">
                    跳转到主题 (ID: {{ watermarkFormInput.result_thread_id }})
                </n-a>
            </div>
            <div v-else-if="watermarkFormInput.result_thread_id !== null" style="margin-top: 10px;">
                <n-text type="warning">未登录用户（无饼干）</n-text><br />
                <n-a :href="'/thread/' + watermarkFormInput.result_thread_id" target="_blank">
                    跳转到主题 (ID: {{ watermarkFormInput.result_thread_id }})
                </n-a>
            </div>
        </n-form>
    </n-flex>

</template>

<script setup lang="ts">

import { createMedalPoster, setUserOloPoster, transferThreadPoster, unlockUuidPoster, watermarkDecodePoster, type createMedalParams, type setUserOloParams, type transferThreadParams, type unlockUuidParams, type watermarkDecodeParams } from '@/api/methods/admin'
import { inputNumberFormat, inputNumberParse } from '@/js/func/inputNumberFormat'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { FButton, FInput } from '@custom'
import { useRequest } from 'alova'
import { NDivider, NFlex, NForm, NFormItem, NInputNumber, NSelect, NSwitch, NText, NA, type FormInst, type FormRules, } from 'naive-ui'
import { computed, ref } from 'vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()//各版数据的store
const uuidFormRef = ref<FormInst | null>(null)
const transferFormRef = ref<FormInst | null>(null)
const oloFormRef = ref<FormInst | null>(null)
const formRef = ref<FormInst | null>(null)
const watermarkFormRef = ref<FormInst | null>(null)

//输入的数据
const oloFormInput = ref<{ binggan: string, olo: number | undefined, message: string }>(
    { binggan: '', olo: undefined, message: '' }
)
const uuidFormInput = ref<{ uuid: string }>(
    { uuid: '' }
)
const transferFormInput = ref<
    {
        thread_id: number | null,
        forum_id: number,
        nissin_clear: boolean,
    }>(
        {
            thread_id: null,
            forum_id: 1,
            nissin_clear: true,
        }
    )
const medalFormInput = ref<{ binggan: string, medalId: number }>(
    { binggan: '', medalId: 181 }
)
const watermarkFormInput = ref<{ watermark_string: string, result_binggan: string | null, result_thread_id: number | null }>(
    { watermark_string: '', result_binggan: null, result_thread_id: null }
)

//板块名称的下拉菜单数据
const forumsOptions = computed(() => forumsStore.forumsData.map((item) => ({
    value: item.id,
    label: item.name
})))
//成就选择的下拉菜单
const medalOptions = [
    { value: 181, label: "皇家御用画宗" },
    { value: 182, label: "小火锅守护者" },
]

//数据验证规则
const oloInputRules: FormRules = {
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
const uuidInputRules: FormRules = {
    uuid: {
        required: true,
        message: '请填写目标UUID',
        trigger: 'blur'
    },
}
const transferInputRules: FormRules = {
    thread_id: {
        required: true,
        message: '请填写主题ID',
        type: 'number',
        trigger: 'blur'
    },
    forum_id: {
        required: true,
        message: '请选择目标小岛',
        type: 'number',
        trigger: 'blur'
    },
    nissin_clear: {
        required: true,
    },
}
const medalInputRules: FormRules = {
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
const watermarkInputRules: FormRules = {
    watermark_string: {
        required: true,
        message: '请填写混淆后的水印字符串',
        trigger: 'blur'
    },
}

//提交奖罚olo
const { loading: setUserOloHandling,
    send: setUserOloPosterSend,
    onSuccess: setUserOloOnSuccess,
    onError: setUserOloOnError, } = useRequest((params: setUserOloParams) => setUserOloPoster(params), { immediate: false })
setUserOloOnSuccess(() => {
    oloFormInput.value.binggan = ''
})
setUserOloOnError(() => {
    oloFormInput.value.binggan = ''
})
function setUserOloHandle() {
    oloFormRef.value?.validate((errors) => {
        if (errors) {
            window.$message.error('请确认信息填写完整')
            return
        } else {
            const params: setUserOloParams = {
                binggan: userStore.binggan!,
                binggan_target: oloFormInput.value.binggan,
                olo_num: oloFormInput.value.olo!,
                olo_message: oloFormInput.value.message,
            }
            const actionName = oloFormInput.value.olo! > 0 ? '奖励' : '罚款'
            const dialogArgs = {
                title: '奖罚olo',
                closable: false,
                content: `对象饼干：${oloFormInput.value.binggan} ${actionName}${oloFormInput.value.olo}个olo`,
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

//提交解锁uuid
const { loading: unlockUuidHandling,
    send: unlockUuidPosterSend,
    onSuccess: unlockUuidOnSuccess,
    onError: unlockUuidOnError, } = useRequest((params: unlockUuidParams) => unlockUuidPoster(params), { immediate: false })
unlockUuidOnSuccess(() => {
    uuidFormInput.value.uuid = ''
})
function unlockUuidHandle() {
    uuidFormRef.value?.validate((errors) => {
        if (errors) {
            window.$message.error('请确认信息填写完整')
            return
        } else {
            const params: unlockUuidParams = {
                binggan: userStore.binggan!,
                uuid: uuidFormInput.value.uuid,
            }
            unlockUuidPosterSend(params)
        }
    })
}
//提交转区
const { loading: transferThreadHandling,
    send: transferThreadPosterSend,
    onSuccess: transferThreadOnSuccess,
    onError: transferThreadOnError, } = useRequest((params: transferThreadParams) => transferThreadPoster(params), { immediate: false })
transferThreadOnSuccess(() => {
    transferFormInput.value.thread_id = null
})
function transferThreadHandle() {
    transferFormRef.value?.validate((errors) => {
        if (errors) {
            window.$message.error('请确认信息填写完整')
            return
        } else {
            const params: transferThreadParams = {
                binggan: userStore.binggan!,
                thread_id: transferFormInput.value.thread_id!,
                forum_id: transferFormInput.value.forum_id,
                nissin_clear: transferFormInput.value.nissin_clear,
            }
            transferThreadPosterSend(params)
        }
    })
}


//提交发放成就
const { loading: createMedalHandling,
    send: createMedalPosterSend,
    onSuccess: createMedalOnSuccess,
    onError: createMedalOnError, } = useRequest((params: createMedalParams) => createMedalPoster(params), { immediate: false })
createMedalOnSuccess(() => {
    medalFormInput.value.binggan = ''
})
createMedalOnError(() => {
    medalFormInput.value.binggan = ''
})
function createMedalHandle() {
    formRef.value?.validate((errors) => {
        if (errors) {
            window.$message.error('请确认信息填写完整')
            return
        } else {
            const params: createMedalParams = {
                binggan: userStore.binggan!,
                binggan_target: medalFormInput.value.binggan,
                medal_id: medalFormInput.value.medalId,
            }
            const medalName = medalOptions.find((item) => item.value === medalFormInput.value.medalId)
            const dialogArgs = {
                title: '发放成就',
                closable: false,
                content: `对象饼干：${medalFormInput.value.binggan}  发放成就：${medalName?.label}`,
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

//提交解混淆水印
const { loading: watermarkDecodeHandling,
    send: watermarkDecodePosterSend,
    onSuccess: watermarkDecodeOnSuccess,
    onError: watermarkDecodeOnError, } = useRequest((params: watermarkDecodeParams) => watermarkDecodePoster(params), { immediate: false })
watermarkDecodeOnSuccess((event) => {
    // 显示结果
    watermarkFormInput.value.result_binggan = event.data.binggan
    watermarkFormInput.value.result_thread_id = event.data.thread_id
})
watermarkDecodeOnError(() => {
    watermarkFormInput.value.result_binggan = null
    watermarkFormInput.value.result_thread_id = null
})
function watermarkDecodeHandle() {
    watermarkFormRef.value?.validate((errors) => {
        if (errors) {
            window.$message.error('请确认信息填写完整')
            return
        } else {
            // 清空旧结果
            watermarkFormInput.value.result_binggan = null
            watermarkFormInput.value.result_thread_id = null

            const params: watermarkDecodeParams = {
                watermark_string: watermarkFormInput.value.watermark_string,
            }
            watermarkDecodePosterSend(params)
        }
    })
}


</script>
