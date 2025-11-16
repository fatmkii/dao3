<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" closable @close="showThis = false" size="small">
            <n-flex vertical :align="'center'" :size="[4, 4]">
                <img style="max-width: 100%;" :src="modalParams.emojiUrl" ref="emojiImgDom">
                <span>(new!)点击图片可以追加到自定义表情包</span>
                <span>当前票数：{{ modalParams.voteNum }}</span>
                <n-input-group>
                    <f-input-group-label style="width: 4.2rem;">投票额</f-input-group-label>
                    <n-input-number v-model:value="voteNum" :max="10000" :min="1" :step="1" @keyup.enter="voteHandle" />
                </n-input-group>
            </n-flex>
            <template #action>
                <n-flex :align="'center'">
                    <span v-if="modalParams.endFlag === 0">
                        活动尚未开始
                    </span>
                    <span v-if="modalParams.endFlag === 1">
                        将会花费
                        <n-text type="error">{{ (voteNum ?? 0) * 100 }}</n-text>
                        个olo
                    </span>
                    <span v-if="modalParams.endFlag === 2">
                        活动已经结束了
                    </span>
                    <f-button type="primary" @click="voteHandle" :loading="voteHandleLoading"
                        :disabled="voteHandleLoading || modalParams.endFlag !== 1"
                        style="margin-left: auto;">投票</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { FButton } from '@custom';
import { FInputGroupLabel } from '@custom';
import { NCard, NFlex, NAlert, NModal, NInputGroup, NInputNumber, NText } from 'naive-ui';
import { ref, h, nextTick } from 'vue';
import { type moeUserVoteParams, moeUserVotePoster } from '@/api/methods/emojiContest';
import { useRequest } from 'alova';
import { useUserStore } from '@/stores/user';
import type { MessageRenderMessage } from 'naive-ui'
import { myEmojisAddPoster, type myEmojisAddParams } from '@/api/methods/user'

//基础数据
const commonStore = useCommonStore()
const userStore = useUserStore()
const modalParams = ref<modalParams>({
    emojiUrl: '',
    emojiGroupId: 0,
    emojiId: 0,
    voteNum: 0,
    endFlag: 0, //活动进度，0=未开始，1=进行中，2=已结束
})
const voteNum = ref<number>()
const emojiImgDom = ref<HTMLImageElement | null>(null)//回复内容组件的ref


//来自父组件的唤醒emit
const showThis = ref<boolean>(false)
interface modalParams {
    emojiUrl: string,
    emojiGroupId: number,
    emojiId: number,
    voteNum: number,
    endFlag: number,
}
function show(params: modalParams) {
    showThis.value = true
    modalParams.value = params
    voteNum.value = undefined

    //配置点击追加表情包的功能
    nextTick(() => {
        setImgOnClick()
    })
}
defineExpose({ show })

//提交投票
const { loading: voteHandleLoading, send: voteHandleSend, onSuccess: voteHandleOnSuccess, onError: voteHandleOnError } = useRequest(
    (params: moeUserVoteParams) => moeUserVotePoster(params),
    { immediate: false }
)

function voteHandle() {
    if (voteNum.value === undefined) {
        window.$message.error('请输入投票数')
        return
    }
    const params: moeUserVoteParams = {
        binggan: userStore.binggan!,
        emoji_id: modalParams.value.emojiId,
        emoji_group_id: modalParams.value.emojiGroupId,
        olo: voteNum.value * 100,
    }
    voteHandleSend(params)
}
voteHandleOnSuccess(() => {
    emit('refreshMoeData', modalParams.value.emojiGroupId)
    voteNum.value = undefined
    showThis.value = false
})

//点击图片添加到表情包功能
const emojiSelected = ref<HTMLImageElement>()
function setImgOnClick() {
    const imgDom = emojiImgDom.value
    console.log(imgDom)

    imgDom?.addEventListener('click', (event) => {
        emojiSelected.value = imgDom
        window.$message.success('要添加至自定义表情包吗？', {
            render: renderMessage,
            closable: true
        })
    })
}
const renderMessage: MessageRenderMessage = (props) => {
    const { type } = props
    return h(
        NAlert,
        {
            closable: false,
            type: type === 'loading' ? 'default' : type,
            showIcon: false,
            style: {
                boxShadow: 'var(--n-box-shadow)',
                maxWidth: 'calc(100vw - 64px)',
                width: '250px'
            }
        },
        () => [
            h('span', { innerText: props.content }),
            h(
                FButton,
                {
                    size: 'tiny',
                    type: 'success',
                    onClick: emojiAddHandle
                },
                {
                    default: () => '确定'
                }

            )
        ]
    )
}
function emojiAddHandle() {
    const myEmojis = userStore.userData.my_emoji
    const newEmojiSrc = emojiSelected.value?.getAttribute('src')
    if (!newEmojiSrc) { return }
    if (myEmojis !== null && myEmojis.includes(newEmojiSrc)) {
        window.$message.error('已经添加过该表情包了')
    } else {
        const params: myEmojisAddParams = {
            binggan: userStore.binggan!,
            my_emoji: newEmojiSrc!,
        }
        myEmojisAddPoster(params).then(() => userStore.refreshUserData())
    }

}

//各种emit
const emit = defineEmits<{
    refreshMoeData: [emojiGroupId: number],
}>()

</script>
