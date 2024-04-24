<template>
    <n-modal v-model:show="showThis" display-directive="if" :size="'small'">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="管理员操作" closable @close="showThis = false"
            size="small">
            <n-flex vertical>
                <n-text style="white-space: pre-wrap;" v-if="messages.contentMessage">
                    {{ messages.contentMessage }}
                </n-text>
                <n-text v-if="hintMessage">
                    {{ hintMessage }}
                </n-text>
                <n-form ref="formRef" :model="userInput" label-placement="left" label-width="auto" :rules="inputRules"
                    :size="commonStore.isMobile ? 'small' : 'medium'" style="margin-top: 10px;">
                    <n-form-item v-if="messages.requireContent" label="理由" path="contentInput">
                        <f-input placeholder="必填" v-model:value="userInput.contentInput" />
                    </n-form-item>
                    <n-form-item v-if="messages.requireSwitch" label="罚款olo" path="switchInput">
                        <n-switch v-model:value="userInput.switchInput" />
                        <n-text style="margin-left: 6px;">每个帖子罚款500，封顶5000个olo</n-text>
                    </n-form-item>
                </n-form>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <f-button v-if="showCommit" type="warning" @click="requestHandle(mode)">提交</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import {
    type deleteAllPostParams, deleteAllPostPoster,
    type deletePostParams, deletePostPoster,
    type deleteThreadParams, deleteThreadPoster,
    type recoveryPostParams, recoveryPostPoster,
    type threadCancelTopParams, threadCancelTopPoster,
    type threadSetTopParams, threadSetTopPoster,
    type userBanParams, userBanPoster,
    type userCheckParams, userCheckPoster,
    type userLockParams, userLockPoster
} from '@/api/methods/admin';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton, FInput } from '@custom';
import { type FormInst, type FormRules, NCard, NFlex, NForm, NFormItem, NModal, NSwitch, NText } from 'naive-ui';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

//基础数据
const commonStore = useCommonStore()
const userStore = useUserStore()
const router = useRouter()
const formRef = ref<FormInst | null>(null)
type adminActions = 'hint' | 'ban' | 'lock' | 'deleteAll' | 'delete' | 'recovery' | 'deleteThread' | 'setTop' | 'cancelTop'

//组件props
interface Props {
    threadId: number
    forumId: number
}
const props = withDefaults(defineProps<Props>(), {
    forumId: 0
})

//输入数据
const userInput = ref({
    contentInput: undefined as string | undefined,// 封禁理由等输入数据
    switchInput: false,//是否扣除olo等输入
})
const mode = ref<adminActions>('hint')
const showCommit = ref<boolean>(true)//是否显示提交按钮（hint的时候不需要显示）
const hintMessage = ref<string>() //hint模式时候的结果（直接从请求获得的）
let postId: number

//数据验证规则
const inputRules = computed<FormRules>(() => ({
    contentInput: {
        required: messages.value.requireContent,
        message: '请填写理由',
    },
    switchInput: {
        required: false,
    },
}))

//配置此modal的内容显示
const messagesOptions = {
    hint: { requireContent: false, contentMessage: false, requireSwitch: false },
    ban: { requireContent: true, contentMessage: '你要永久粉碎这个饼干吗？', requireSwitch: false },
    lock: { requireContent: true, contentMessage: '要封禁这个饼干吗？\n第1次3天、2次6天、3次9天、4次碎饼', requireSwitch: false },
    deleteAll: { requireContent: true, contentMessage: '要用管理员权限删除该饼干全部回复吗？\n此功能请谨慎使用，仅在有恶意刷屏时。', requireSwitch: true },
    delete: { requireContent: true, contentMessage: '要用管理员权限删除这个回复吗？', requireSwitch: true },
    recovery: { requireContent: true, contentMessage: '要用管理员权限恢复这个回复吗？', requireSwitch: false },
    deleteThread: { requireContent: true, contentMessage: '要用管理员权限删除这个主题吗？', requireSwitch: false },
    setTop: { requireContent: false, contentMessage: '要设为置顶吗？', requireSwitch: false },
    cancelTop: { requireContent: false, contentMessage: '要取消置顶吗？', requireSwitch: false },
}
const messages = computed<{ requireContent: boolean, contentMessage: string | boolean, requireSwitch: boolean }>(() => messagesOptions[mode.value])

//来自父组件的唤醒emit和传递的payload
const showThis = ref<boolean>(false)
function show(payload: { action: adminActions, postId?: number }) {
    mode.value = payload.action
    postId = payload.postId ?? 0
    hintMessage.value = undefined
    showThis.value = true
    if (payload.action === 'hint') {
        showCommit.value = false
        requestHandle('hint')
    } else {
        showCommit.value = true
    }
}
defineExpose({ show })

//各种emit
const emit = defineEmits<{
    refreshPostsList: [],
}>()


//执行查询
function requestHandle(action: adminActions) {
    if (action === 'hint') {
        hintMessage.value = '查询中……'
        const paramsHint: userCheckParams = {
            binggan: userStore.binggan!,
            thread_id: props.threadId,
            post_id: postId,
        }
        userCheckPoster(paramsHint).then(response => {
            hintMessage.value = `此饼干状态：${response.user_status}。已被锁定过${response.locked_count}次。`
        })
        return
    }
    formRef.value?.validate((errors) => {
        if (errors) {
            window.$message.error('请确认信息填写完整')
            return
        } else {
            switch (action) {
                case 'ban':
                    const paramsBan: userBanParams = {
                        binggan: userStore.binggan!,
                        thread_id: props.threadId,
                        post_id: postId,
                        content: userInput.value.contentInput!
                    }
                    userBanPoster(paramsBan).then(() => {
                        showThis.value = false
                        emit('refreshPostsList')
                    })
                    break;
                case 'lock':
                    const paramsLock: userLockParams = {
                        binggan: userStore.binggan!,
                        thread_id: props.threadId,
                        post_id: postId,
                        content: userInput.value.contentInput!
                    }
                    userLockPoster(paramsLock).then(() => {
                        showThis.value = false
                        emit('refreshPostsList')
                    })
                    break;
                case 'deleteAll':
                    const paramsDeleteAll: deleteAllPostParams = {
                        binggan: userStore.binggan!,
                        thread_id: props.threadId,
                        post_id: postId,
                        content: userInput.value.contentInput!,
                        reduce_olo: userInput.value.switchInput,
                    }
                    deleteAllPostPoster(paramsDeleteAll).then(() => {
                        showThis.value = false
                        emit('refreshPostsList')
                    })
                    break;
                case 'delete':
                    const paramsDelete: deletePostParams = {
                        binggan: userStore.binggan!,
                        thread_id: props.threadId,
                        post_id: postId,
                        content: userInput.value.contentInput!,
                        reduce_olo: userInput.value.switchInput,
                    }
                    deletePostPoster(paramsDelete).then(() => {
                        showThis.value = false
                        emit('refreshPostsList')
                    })
                    break;
                case 'recovery':
                    const paramsRecovery: recoveryPostParams = {
                        binggan: userStore.binggan!,
                        thread_id: props.threadId,
                        post_id: postId,
                        content: userInput.value.contentInput!,
                    }
                    recoveryPostPoster(paramsRecovery).then(() => {
                        showThis.value = false
                        emit('refreshPostsList')
                    })
                    break;
                case 'deleteThread':
                    const paramsDeleteThread: deleteThreadParams = {
                        binggan: userStore.binggan!,
                        thread_id: props.threadId,
                        content: userInput.value.contentInput!,
                    }
                    deleteThreadPoster(paramsDeleteThread).then(() => {
                        showThis.value = false
                        router.push({ name: 'forum', params: { forumId: props.forumId, page: 1 } })
                    })
                    break;
                case 'setTop':
                    const paramsSetTop: threadSetTopParams = {
                        binggan: userStore.binggan!,
                        thread_id: props.threadId,
                    }
                    threadSetTopPoster(paramsSetTop).then(() => {
                        showThis.value = false
                        emit('refreshPostsList')
                    })
                    break;
                case 'cancelTop':
                    const paramsCancelTop: threadCancelTopParams = {
                        binggan: userStore.binggan!,
                        thread_id: props.threadId,
                    }
                    threadCancelTopPoster(paramsCancelTop).then(() => {
                        showThis.value = false
                        emit('refreshPostsList')
                    })
                    break;
            }
        }
    })
}




</script>
