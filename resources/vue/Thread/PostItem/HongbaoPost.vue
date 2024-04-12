<template>
    <n-flex size="small" vertical>
        <n-card size="small" :bordered="true" embedded class="hongbao-post-card">
            <n-flex vertical :align="'center'">
                <n-flex :align="'center'" size="small">
                    <n-text style="font-size: 1rem;">{{ keywordTypeName }}</n-text>
                    <img src="/hongbao.svg" :style="{ height: commonStore.isMobile ? '30px' : '36px' }" />
                </n-flex>
                <div>
                    <n-text :depth="3" v-if="hongbaoData.question">提示：</n-text>
                    <n-text>{{ hongbaoData.question }}</n-text>
                </div>
                <div>
                    <n-text :depth="3" v-if="hongbaoData.key_word">口令：</n-text>
                    <n-text>{{ hongbaoData.key_word }}</n-text>
                </div>
                <div>
                    <n-text :depth="3">数量：</n-text>
                    <n-text>{{ hongbaoData.num_remains }} /{{ hongbaoData.num_total }} （{{ hongbaoTypeName }}）</n-text>
                </div>
                <div v-if="!hongbaoData.olo_hide">
                    <n-text :depth="3">总额：</n-text>
                    <n-text>{{ hongbaoData.olo_total?.toLocaleString('en-us') }} olo </n-text>
                </div>
            </n-flex>
        </n-card>
        <n-flex size="small" :wrap="false">
            <f-input v-if="hongbaoData.hongbao_user === null" v-model:value="keywordInput" :maxlength="255"
                @keyup.enter="hongbaoStoreHandle" style="max-width: 328px;"
                :placeholder="hongbaoData.num_remains === 0 ? '已经抢光啦' : '请输入口令'" auto-size
                :disabled="hongbaoData.hongbao_user !== null || hongbaoData.num_remains === 0" />
            <f-input v-else :value="`你抢到了${hongbaoData.hongbao_user?.olo.toLocaleString('en-us')}个olo`" :maxlength="255"
                style="max-width: 328px;" auto-size disabled />
            <f-button type="primary" @click="hongbaoStoreHandle"
                :disabled="hongbaoData.hongbao_user !== null || hongbaoPostStoreLoading || hongbaoData.num_remains === 0">抢！</f-button>
        </n-flex>
    </n-flex>
</template>

<script setup lang="ts">
import { hongbaoPostStorePoster, type hongbaoPostStoreParams } from '@/api/methods/hongbao'
import { hongbaoPostData } from '@/api/methods/posts'
import getNewPostKey from '@/js/func/getNewPostKey'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { FButton, FInput } from '@/vue/Custom'
import { useRequest } from 'alova'
import { NCard, NFlex, NText } from 'naive-ui'
import { computed, ref } from 'vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()


//组件props
interface Props {
    hongbaoData: hongbaoPostData,
    threadId: number,
    forumId: number,
}
const props = withDefaults(defineProps<Props>(), {
})


//显示用的computed
const hongbaoTypeName = computed(() => {
    const hongbaoTypeMap = {
        1: '随机',
        2: '定额',
    };
    return hongbaoTypeMap[props.hongbaoData.type]
})
const keywordTypeName = computed(() => {
    const keywordTypeMap = {
        1: '口令红包',
        2: '抢答红包',
        3: '暗号红包'
    };
    return keywordTypeMap[props.hongbaoData.key_word_type]
})

//用户输入 
const keywordInput = ref<string>(props.hongbaoData.key_word_type === 1 ? props.hongbaoData.key_word! : '')

//注册事件
const emit = defineEmits<{
    refreshPostsList: [],
}>()

//提交抢红包
const { loading: hongbaoPostStoreLoading, send: hongbaoPostStoreSend, onSuccess: hongbaoPostStoreOnSuccess, onError: hongbaoPostStoreOnError } = useRequest(
    (params: hongbaoPostStoreParams) => hongbaoPostStorePoster(params),
    { immediate: false }
)
function hongbaoStoreHandle(event: MouseEvent | KeyboardEvent) {
    if (!event.isTrusted) {
        const dialogArgs = {
            title: '错误',
            closable: false,
            content: '请不要用脚本抢红包喔',
            positiveText: '确定',
        }
        window.$dialog.warning(dialogArgs)
        return
    }
    const { timestamp, newPostKey } = getNewPostKey(event.isTrusted, props.threadId, userStore.binggan!)
    const params: hongbaoPostStoreParams = {
        binggan: userStore.binggan!,
        forum_id: props.forumId,
        thread_id: props.threadId,
        content: '--红包口令: ' + keywordInput.value,
        nickname: '= =',
        post_with_admin: false,
        new_post_key: newPostKey,
        timestamp: timestamp,
        hongbao_post_id: props.hongbaoData.id,
        hongbao_key_word: keywordInput.value
    }
    hongbaoPostStoreSend(params)
}
hongbaoPostStoreOnSuccess(() => {
    keywordInput.value = ''
    emit('refreshPostsList')
})
hongbaoPostStoreOnError(() => {
    keywordInput.value = ''
    emit('refreshPostsList')
})

</script>

<style scoped>
.hongbao-post-card {
    max-width: 400px;
}
</style>