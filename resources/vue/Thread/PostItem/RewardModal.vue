<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" :title="`打赏给№${rewardPayload?.floor}`" closable
            @close="showThis = false" size="small">
            <n-flex vertical>
                <div>
                    <n-text v-if="!commonStore.isDouble11">
                        温馨提示：在打赏额以外，会追加扣除7%手续费。</n-text>
                    <n-text v-else>
                        <del>温馨提示：在打赏额以外，会追加扣除7%手续费。</del>
                        <br />
                        活动期间限时手续费2%！
                    </n-text>
                    <br />
                    <n-text>总共扣除：</n-text>
                    <n-text type="error">{{ Math.ceil(inputRewardCoin * (commonStore.isDouble11 ? 1.02 : 1.07)) }}
                    </n-text>
                    <n-text>块奥利奥。</n-text>
                </div>

                <n-input-group>
                    <f-input-group-label style="width: 3.2rem;">打赏</f-input-group-label>
                    <n-input-number type="password" placeholder="olo数量" show-password-on="mousedown" clearable
                        v-model:value="inputRewardCoin" @keyup.enter="rewardHandle" :max="1000000" :min="1" :step="1000"
                        :parse="inputNumberParse" :format="inputNumberFormat" />
                </n-input-group>
                <n-input-group>
                    <f-input-group-label style="width: 3.2rem;" class="round">留言</f-input-group-label>
                    <f-input v-model:value="inputRewardMessage" placeholder="（可留空）" @keyup.enter="rewardHandle" />
                </n-input-group>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <f-button type="primary" @click="rewardHandle" :loading="rewardLoading">打赏</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { userRewardPoster, type userRewardParams } from '@/api/methods/user';
import { inputNumberFormat, inputNumberParse } from '@/js/func/inputNumberFormat';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton, FInput, FInputGroupLabel } from '@custom';
import { useRequest } from 'alova';
import { NCard, NFlex, NInputGroup, NInputNumber, NModal, NText } from 'naive-ui';
import { ref } from 'vue';

//基础数据
const commonStore = useCommonStore()
const userStore = useUserStore()

//输入数据
const inputRewardCoin = ref<number>(100)
const inputRewardMessage = ref<string>()

//来自父组件的唤醒emit和传递的payload
const showThis = ref<boolean>(false)
export interface rewardModalPayload {
    floor: number,
    forumId: number,
    threadId: number,
    postId: number,
    postFloorMessage: string
}
const rewardPayload = ref<rewardModalPayload | null>()
function show(payload: rewardModalPayload) {
    rewardPayload.value = payload
    showThis.value = true
}
defineExpose({ show })

//各种emit
const emit = defineEmits<{
    refreshPostsList: [],
}>()

//执行打赏
function rewardHandle() {
    const params: userRewardParams = {
        binggan: userStore.binggan!,
        post_floor_message: '@' + rewardPayload.value!.postFloorMessage,//3.0代码的引用前面加@
        forum_id: rewardPayload.value!.forumId,
        thread_id: rewardPayload.value!.threadId,
        post_id: rewardPayload.value!.postId,
        coin: inputRewardCoin.value,
        content: inputRewardMessage.value,
    }
    sendRewardHandle(params)
}
const { loading: rewardLoading, send: sendRewardHandle, onSuccess: rewardOnSuccess } = useRequest(
    (params: userRewardParams) => userRewardPoster(params), { immediate: false }
)
rewardOnSuccess(() => {
    showThis.value = false
    emit('refreshPostsList')
})

</script>
