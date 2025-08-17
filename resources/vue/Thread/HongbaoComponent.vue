<template>
    <n-card size="small" :bordered="true" class="hongbao-card" :style="backgroundImgStyle">
        <n-spin :show="hongbaoDataLoading">
            <n-flex vertical :align="'center'">
                <n-flex :align="'center'" size="small">
                    <n-text style="font-size: 1rem;">口令红包</n-text>
                    <img src="/hongbao.svg" :style="{ height: commonStore.isMobile ? '30px' : '36px' }"
                        v-if="!useHongbaoPic" />
                </n-flex>
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
                <n-flex size="small" :wrap="false">
                    <f-input v-if="hongbaoData.hongbao_user === null" v-model:value="keywordInput" :maxlength="255"
                        @keyup.enter="hongbaoStoreHandle" style="max-width: 328px;"
                        :placeholder="hongbaoData.num_remains === 0 ? '已经抢光啦' : '请输入口令'" auto-size
                        :disabled="hongbaoData.hongbao_user !== null || hongbaoData.num_remains === 0" />
                    <f-input v-else :value="`你抢到了${hongbaoData.hongbao_user?.olo.toLocaleString('en-us')}个olo`"
                        :maxlength="255" style="max-width: 328px;" auto-size disabled />
                    <f-button type="primary" @click="hongbaoStoreHandle"
                        :disabled="hongbaoData.hongbao_user !== null || hongbaoStoreLoading || hongbaoData.num_remains === 0">抢！</f-button>
                </n-flex>
            </n-flex>
        </n-spin>
    </n-card>
</template>

<script setup lang="ts">
import { hongbaoDataGetter, hongbaoStorePoster, type hongbaoStoreParams } from '@/api/methods/hongbao';
import getNewPostKey from '@/js/func/getNewPostKey';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton, FInput } from '@custom';
import { useRequest } from 'alova';
import { NCard, NFlex, NSpin, NText } from 'naive-ui';
import { computed, ref } from 'vue';

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()

//组件props
interface Props {
    hongbaoId: number,
    threadId: number,
    forumId: number,
    noHongbaoPicMode: boolean,
}
const props = withDefaults(defineProps<Props>(), {
})

const useHongbaoPic = computed(() => hongbaoData.value.pic_url && !props.noHongbaoPicMode)


// 红包封面作为背景
const backgroundImgStyle = computed(() => {
    if (useHongbaoPic.value) {
        return {
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${hongbaoData.value.pic_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }
    }
    return {}
})


//用户输入 
const keywordInput = ref<string>()

//显示用的computed
const hongbaoTypeName = computed(() => {
    const hongbaoTypeMap = {
        1: '随机olo',
        2: '定额olo',
    };
    return hongbaoTypeMap[hongbaoData.value.type]
})

//获取红包数据
const { data: hongbaoData,
    loading: hongbaoDataLoading,
    send: hongbaoDataGetterSend,
    onSuccess: hongbaoDataOnSuccess } = useRequest(hongbaoDataGetter(props.hongbaoId), { immediate: false, initialData: {} })
hongbaoDataOnSuccess((event) => {
    keywordInput.value = event.data.key_word
})
//刷新或获取红包数据
function getHongbaoData() {
    hongbaoDataGetterSend({ binggan: userStore.binggan! })
}
if (userStore.binggan!) { getHongbaoData() }


//提交抢红包
const { loading: hongbaoStoreLoading,
    send: hongbaoStoreSend,
    onSuccess: hongbaoStoreOnSuccess
} = useRequest((params: hongbaoStoreParams) => hongbaoStorePoster(params),
    { immediate: false }
)
hongbaoStoreOnSuccess(() => {
    emit('refreshPostsList')
})
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
    const params: hongbaoStoreParams = {
        binggan: userStore.binggan!,
        forum_id: props.forumId,
        thread_id: props.threadId,
        content: '--红包口令: ' + keywordInput.value,
        nickname: '= =',
        post_with_admin: false,
        new_post_key: newPostKey,
        timestamp: timestamp,
        hongbao_id: props.hongbaoId,
        hongbao_key_word: keywordInput.value!
    }
    hongbaoStoreSend(params).then(() => {
        getHongbaoData()
    })
}

//各种emit
const emit = defineEmits<{
    refreshPostsList: [],
}>()

</script>

<style scoped lang="scss">
.hongbao-title {
    @media all and (min-width: 1200px) {
        font-size: 1.125rem;
    }

    @media not all and (min-width: 1200px) {
        font-size: 1rem;

    }
}

.hongbao-card {
    height: 202px;

    :deep(.n-text) {
        text-shadow:
            -1px -1px 0 white,
            1px -1px 0 white,
            -1px 1px 0 white,
            1px 1px 0 white;
    }
}
</style>