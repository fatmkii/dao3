<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="欢迎加入小火锅！" closable @close="showThis = false"
            size="small">
            <n-flex vertical size="medium" style="word-wrap: break-word;">
                <div>你的饼干是：<n-text strong type="info" style="font-size: 1.5rem;">{{ userStore.binggan
                        }}</n-text><br>（之后在个人中心也可以查看）</div>
                <n-text depth="2">① 饼干就是你的小火锅账号。请保存好，不要泄露喔！</n-text>
                <n-text depth="2">② 为了账号安全，<n-text strong type="error">建议尽快在个人中心设定密码。</n-text></n-text>
                <n-text depth="2">③ 请务必遵守<router-link :to="'/thread/13351'">小火锅版规</router-link>喔！</n-text>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <f-button @click="closeModal">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton } from '@custom';
import { NCard, NFlex, NModal, NText } from 'naive-ui';
import { ref } from 'vue';

const userStore = useUserStore()
const commonStore = useCommonStore()

//将唤醒modal的方法暴露给父组件
const showThis = ref<boolean>(false)
const show = () => (showThis.value = true)
defineExpose({ show })

//关闭窗口并返回主页
function closeModal() {
    showThis.value = false
    window.location.href = "/"; //因为希望从头刷新整个程序状态，所以用js原生的重定向，而不是Vuerouter的push
}

</script>
