<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="追加屏蔽词" closable @close="showThis = false"
            size="small">
            <n-flex vertical>
                <n-text>暂时只做了“内容屏蔽词”的追加</n-text>
                <n-input-group>
                    <f-input-group-label style="width: 4.2rem;">屏蔽词</f-input-group-label>
                    <f-input v-model:value="pingbiciInput" :max="255" @keyup.enter="pingbiciAddHandle" />
                </n-input-group>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <f-button type="primary" @click="pingbiciAddHandle" :loading="pingbiciAddLoading"
                        :disabled="!pingbiciInput">提交</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { pingbiciAddPoster, type pingbiciAddParams } from '@/api/methods/user';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton, FInput, FInputGroupLabel } from '@custom';
import { useRequest } from 'alova';
import { NCard, NFlex, NInputGroup, NModal, NText } from 'naive-ui';
import { ref } from 'vue';

//基础数据
const commonStore = useCommonStore()
const userStore = useUserStore()

//输入数据
const pingbiciInput = ref<string>()

//提交追加屏蔽词
const { loading: pingbiciAddLoading, send: pingbiciAddSend, onSuccess: pingbiciAddOnsuccess } = useRequest(
    (params: pingbiciAddParams) => pingbiciAddPoster(params),
    { immediate: false }
)
function pingbiciAddHandle() {
    if (!pingbiciInput.value) {
        window.$message.error('请填写屏蔽词')
        return
    }
    const params: pingbiciAddParams = {
        binggan: userStore.binggan!,
        content_pingbici: pingbiciInput.value
    }
    pingbiciAddSend(params)
}
pingbiciAddOnsuccess(() => {
    userStore.refreshUserData()
    showThis.value = false
})

//来自父组件的唤醒emit
const showThis = ref<boolean>(false)
function show() {
    showThis.value = true
}
defineExpose({ show })

</script>
