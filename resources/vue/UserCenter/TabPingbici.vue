<template>
    <n-flex vertical>
        <!-- 标题屏蔽词 -->
        <n-card title="标题屏蔽词" size="small">
            <n-dynamic-tags v-model:value="pingbiciListInput.title_pingbici" :input-props="{ maxlength: 20 }" />
            <template #header-extra>
                <f-button @click="removeDuplicate('title_pingbici')">去重</f-button>
            </template>
        </n-card>

        <!-- 内容屏蔽词 -->
        <n-card title="内容屏蔽词" size="small">
            <n-dynamic-tags v-model:value="pingbiciListInput.content_pingbici" :input-props="{ maxlength: 20 }" />
            <template #header-extra>

                <f-button @click="removeDuplicate('content_pingbici')">去重</f-button>
            </template>
        </n-card>

        <!-- FJF小尾巴和固马屏蔽词 -->
        <n-card title="FJF小尾巴和固马屏蔽词" size="small">
            <n-dynamic-tags v-model:value="pingbiciListInput.fjf_pingbici" :input-props="{ maxlength: 10 }" />
            <n-text :depth="3" style="font-size: 0.875rem;">注意：同一个饼干在不同FJF主题中，小尾巴会改变</n-text>
            <template #header-extra>
                <f-button @click="removeDuplicate('fjf_pingbici')">去重</f-button>
            </template>
        </n-card>
        <n-flex :align="'center'" :justify="'start'">
            <n-popover trigger="hover">
                <template #trigger>
                    <div>
                        <n-switch v-model:value="commonStore.userCustom.hidePingbiciFloor" />
                        <n-text style="margin-left: 6px;">完全隐藏楼层 </n-text>
                    </div>
                </template>
                <span>这个保存在本地，不用点提交</span>
            </n-popover>
            <n-popover trigger="hover">
                <template #trigger>
                    <div>
                        <n-switch v-model:value="commonStore.userCustom.pingbiciIngnoreCase" />
                        <n-text style="margin-left: 6px;">忽略大小写 </n-text>
                    </div>
                </template>
                <span>这个保存在本地，不用点提交</span>
            </n-popover>
        </n-flex>

        <!-- 操作按钮 -->
        <n-flex :align="'center'" :justify="'end'">
            <n-popover trigger="hover">
                <template #trigger>
                    <div>
                        <n-switch v-model:value="usePingbici" />
                        <n-text style="margin-left: 6px;">启用 </n-text>
                    </div>
                </template>
                <span>关闭屏蔽词功能，可以提升一点性能</span>
            </n-popover>
            <f-button type="primary" @click="pingbiciSetHandle" :loading="pingbiciSetLoading"
                :disabled="pingbiciSetLoading">提交</f-button>
        </n-flex>

    </n-flex>
</template>

<script setup lang="ts">

import { pingbiciSetPoster, type pingbiciSetParams } from '@/api/methods/user'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { FButton } from '@custom'
import { useRequest } from 'alova'
import { NCard, NDynamicTags, NFlex, NPopover, NSwitch, NText } from 'naive-ui'
import { ref, watch } from 'vue'
import ExportEmojiModal from './Modal/ExportEmojiModal.vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const ExportEmojiModalCom = ref<InstanceType<typeof ExportEmojiModal> | null>(null)


//屏蔽词列表（仅本组件编辑用的副本）
interface pingbiciList {
    content_pingbici: string[],
    title_pingbici: string[],
    fjf_pingbici: string[],
}
const pingbiciListInput = ref<pingbiciList>({
    content_pingbici: [],
    title_pingbici: [],
    fjf_pingbici: [],
})

//启用屏蔽词的开关
const usePingbici = ref<boolean>(userStore.userData.binggan.use_pingbici)

//数据初始化和同步
if (userStore.userLoginStatus === true) {
    //初始化数据
    pingbiciListInput.value = userStore.userData.pingbici
    usePingbici.value = userStore.userData.binggan.use_pingbici
}
watch(() => userStore.userDataLoading, (value) => {
    //监听userDataLoading，当用户数据重新读取时，把新数据更新到emojiListInput
    if (value === false) {
        pingbiciListInput.value = userStore.userData.pingbici
        usePingbici.value = userStore.userData.binggan.use_pingbici
    }
})

//去除重复的屏蔽词
type pingbiciNames = 'content_pingbici' | 'title_pingbici' | 'fjf_pingbici'
function removeDuplicate(name: pingbiciNames) {
    pingbiciListInput.value[name] = pingbiciListInput.value[name].filter((item, index) => pingbiciListInput.value[name].indexOf(item) === index);
}



//提交屏蔽词
function pingbiciSetHandle() {
    const params: pingbiciSetParams = {
        binggan: userStore.binggan!,
        use_pingbici: usePingbici.value,
        ...pingbiciListInput.value,
    }
    pingbiciSetSend(params)
}
const { loading: pingbiciSetLoading,
    send: pingbiciSetSend,
    onSuccess: pingbiciSetOnSuccess } = useRequest(
        (params: pingbiciSetParams) => pingbiciSetPoster(params), { immediate: false, initialData: [] }
    );
pingbiciSetOnSuccess(() => userStore.refreshUserData())



</script>