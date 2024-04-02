<template>
    <n-modal v-model:show="commonStore.unauthModalShow" display-directive="if">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" closable @close="commonStore.unauthModalShow = false"
            size="small">
            <n-flex vertical>
                <img src="https://oss.cpttmm.com/xhg_other/notice_4.png" alt="需要饼干才能进入喔">
                <div style="margin-left: auto;">{{ hintMessage }}</div>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <f-button @click="userLogout" type="primary">导入饼干</f-button>
                    <f-button @click="commonStore.unauthModalShow = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { userLogout } from '@/js/func/logout';
import { useCommonStore } from '@/stores/common';
import { FButton } from '@custom';
import { NCard, NFlex, NModal } from 'naive-ui';
import { computed } from 'vue';

//通过全局的commonStore的state，在全局控制唤醒此modal
const commonStore = useCommonStore()

//通过全局的commonStore的state（来自不同地方的错误码），显示不同的提示内容
const hintMessage = computed<string>(() => {
    if (commonStore.requestErrorCode === 401) {
        return "你未导入饼干，或者饼干的登录信息已失效。请申请或重新导入饼干。"
    }
    if (commonStore.requestErrorCode === 21499) {
        return "嗷……你的饼干被碎了。请申请或重新导入饼干。"
    }
    return ""
})


</script>
