
<template>
    <n-modal v-model:show="commonStore.unauthModalShow" display-directive="if">
        <n-card :style="{ maxWidth: maxWidth }" closable @close="commonStore.unauthModalShow = false" size="small">
            <n-flex vertical>
                <img src="https://oss.cpttmm.com/xhg_other/notice_4.png" alt="需要饼干才能进入喔">
                <div style="margin-left: auto;">{{ hintMessage }}</div>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <n-button @click="userLogout" v-bind="themeStore.buttonThemeAttr" type="primary">导入饼干</n-button>
                    <n-button @click="commonStore.unauthModalShow = false">关闭</n-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>
 

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NModal, NButton, NFlex } from 'naive-ui'
import { useCommonStore } from '@/stores/common'
import { userLogout } from '@/js/func/logout'
import { usethemeStore } from '@/stores/theme';

const themeStore = usethemeStore()

//计算modal最大宽度（手机版时候两侧各留16px的空位）
const maxWidth = computed<string>(() => {
    const screenWidth = window.innerWidth
    if (screenWidth >= 500 + 16 + 16) {
        return '500px'
    } else {
        return screenWidth - 32 + 'px'
    }
})

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

