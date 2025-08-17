<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="发起红包" closable @close="showThis = false"
            size="small">
            <n-flex vertical>
                <div>
                    <n-text :depth="3">温馨提示：</n-text>在红包总额以外，会追加扣除7%手续费。
                </div>
                <div>
                    <n-text :depth="3">总共扣除：</n-text>
                    <n-text type="warning">{{ Math.ceil(olo * (commonStore.isDouble11 ? 1.02 : 1.07)) }}</n-text>个奥利奥
                </div>
                <n-input-group>
                    <f-input-group-label style="width: 5.2rem;">红包类型</f-input-group-label>
                    <n-select v-model:value="keywordType" :options="keywordTypeOptions" />
                </n-input-group>
                <n-input-group>
                    <f-input-group-label style="width: 5.2rem;">olo类型</f-input-group-label>
                    <n-select v-model:value="hongbaoType" :options="hongbaoTypeOptions" />
                </n-input-group>
                <n-input-group>
                    <f-input-group-label style="width: 5.2rem;">红包个数</f-input-group-label>
                    <n-input-number v-model:value="num" :max="50" :min="5" :step="5" />
                </n-input-group>
                <n-input-group>
                    <f-input-group-label style="width: 5.2rem;">olo总额</f-input-group-label>
                    <n-input-number v-model:value="olo" :max="1000000" :min="3000" :step="1000"
                        :parse="inputNumberParse" :format="inputNumberFormat" />
                </n-input-group>
                <n-input-group>
                    <f-input-group-label style="width: 5.2rem;">红包口令</f-input-group-label>
                    <f-input v-model:value="keyword" placeholder="必填" />
                </n-input-group>
                <n-input-group>
                    <f-input-group-label style="width: 5.2rem;">红包封面</f-input-group-label>
                    <f-input v-model:value="picUrl" placeholder="（可选）填写图片的完整网址" />
                </n-input-group>
                <n-input-group>
                    <f-input-group-label style="width: 5.2rem;">口令提示</f-input-group-label>
                    <f-input v-model:value="question" placeholder="抢答红包或者暗号红包时，必填" />
                </n-input-group>
                <n-input-group v-for="n in messageNum">
                    <f-input-group-label style="width: 5.2rem;">回复留言</f-input-group-label>
                    <f-input v-model:value="hongbaoMessage[n - 1]" :placeholder="`#${n}（可选） 多个留言时随机抽取一个`"
                        :maxlength="255" />
                </n-input-group>

                <n-flex size="small" :align="'center'">
                    <n-text :depth="3">留言数量</n-text>
                    <n-button size="tiny" circle :disabled="messageNum === 5" @click="messageNumChange(1)">
                        <template #icon>
                            <n-icon>
                                <Plus />
                            </n-icon>
                        </template>
                    </n-button>
                    <n-button size="tiny" circle :disabled="messageNum === 1" @click="messageNumChange(-1);">

                        <template #icon>
                            <n-icon>
                                <Minus />
                            </n-icon>
                        </template>
                    </n-button>
                    <n-checkbox v-model:checked="hideOlo" label="隐藏olo总额" style="margin-left: auto;" />
                </n-flex>
            </n-flex>

            <template #action>
                <n-flex justify="end">
                    <f-button type="primary" @click="hongbaoPostCreateHandle" :disabled="hongbaoPostCreateLoading"
                        :loading="hongbaoPostCreateLoading">提交</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { hongbaoPostCreatePoster, type hongbaoPostCreateParams } from '@/api/methods/hongbao';
import { inputNumberFormat, inputNumberParse } from '@/js/func/inputNumberFormat';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton, FInput, FInputGroupLabel } from '@custom';
import { Minus, Plus } from '@vicons/fa';
import { useRequest } from 'alova';
import { NButton, NCard, NCheckbox, NFlex, NIcon, NInputGroup, NInputNumber, NModal, NSelect, NText } from 'naive-ui';
import { computed, ref } from 'vue';

//基础数据
const commonStore = useCommonStore()
const userStore = useUserStore()

//组件props
interface Props {
    threadId: number,
    forumId: number,
}
const props = withDefaults(defineProps<Props>(), {

})

//NSelect选项
const keywordTypeOptions = [
    { value: 1, label: "口令红包 直接公开口令" },
    { value: 2, label: "抢答红包 回复答对才公开口令" },
    { value: 3, label: "暗号红包 抢完红包才公开口令" },
]
const hongbaoTypeOptions = [
    { value: 1, label: "随机olo" },
    { value: 2, label: "定额olo" },
]

//输入数据
const olo = ref<number>(3000)
const num = ref<number>(10)
const hongbaoType = ref<1 | 2>(1)
const keywordType = ref<1 | 2 | 3>(1)
const keyword = ref<string>()
const question = ref<string>()
const hongbaoMessage = ref<string[]>([])
const hideOlo = ref<boolean>(false)
const picUrl = ref<string>()

//控制留言数量
const messageNum = ref<number>(1)
function messageNumChange(value: 1 | -1) {
    if (value === 1 && messageNum.value < 5) {
        messageNum.value += 1;
    }
    if (value === -1 && messageNum.value > 1) {
        hongbaoMessage.value.splice(messageNum.value - 1, 1)
        messageNum.value -= 1;
    }
}

//提交发起红包
const { loading: hongbaoPostCreateLoading, send: hongbaoPostCreateSend, onSuccess: hongbaoPostCreateOnsuccess } = useRequest(
    (params: hongbaoPostCreateParams) => hongbaoPostCreatePoster(params),
    { immediate: false }
)
function hongbaoPostCreateHandle() {

    function exec() {
        const params: hongbaoPostCreateParams = {
            binggan: userStore.binggan!,
            forum_id: props.forumId,
            thread_id: props.threadId,
            hongbao_olo: olo.value,
            hongbao_num: num.value,
            type: hongbaoType.value,
            key_word_type: keywordType.value,
            hongbao_key_word: keyword.value!, //注意是否已经处理为undefined的情况
            hongbao_question: question.value,
            hongbao_message_json: hongbaoMessage.value,
            hongbao_olo_hide: hideOlo.value,
            pic_url: picUrl.value,
        }
        hongbaoPostCreateSend(params)
    }

    if (keyword.value === undefined) {
        window.$message.error('必须填写“红包口令”喔')
        return
    }
    if (question.value === undefined && [2, 3].includes(keywordType.value)) {
        window.$message.error('抢答红包或者暗号红包时，必须填写“口令提示”喔')
        return
    }
    if (hongbaoType.value === 2 && olo.value % num.value !== 0) {
        // window.$message.error("选择定额红包时，总额要是红包数量的整倍数喔");
        const dialogArgs = {
            title: '提醒',
            closable: false,
            content: `olo总额不是红包个数的整倍数，多出的余数olo将在最后一个红包发出。`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => {
                exec()
            },
        }
        window.$dialog.warning(dialogArgs)
        return;
    }
    exec()
}
hongbaoPostCreateOnsuccess(() => {
    emit('refreshPostsList')
    showThis.value = false
})

//来自父组件的唤醒emit
const showThis = ref<boolean>(false)
function show() {
    showThis.value = true
}
defineExpose({ show })

//各种emit
const emit = defineEmits<{
    refreshPostsList: [],
}>()

</script>
