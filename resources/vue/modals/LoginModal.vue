
<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: maxWidth }" title="欢迎来到小火锅！" closable @close="showThis = false" size="small">
            <n-flex vertical>
                <div>这里是私人论坛，欢迎来玩！<br>QQ小火锅避难群：156840110 <br>使用前需要在下面申请或者导入饼干喔</div>
                <n-input-group>
                    <n-input-group-label style="width: 3.5rem;">饼干</n-input-group-label>
                    <n-input v-model:value="inputBinggan" placeholder="请输入饼干" maxlength="9" show-count
                        @keyup.enter="loginHandle" />
                </n-input-group>
                <n-input-group>
                    <n-input-group-label style="width: 3.5rem;">密码</n-input-group-label>
                    <n-input type="password" placeholder="（可留空）请输入密码" show-password-on="mousedown"
                        v-model:value="inputPassword" @keyup.enter="loginHandle" />
                </n-input-group>
                <n-flex>
                    <n-button round type="warning"> 我想领取新饼干！ </n-button>
                    <n-button style="margin-left: auto;" v-bind="themeStore.buttonThemeAttr" type="primary"
                        @click="loginHandle">导入饼干</n-button>
                </n-flex>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <n-popover placement="bottom" trigger="hover">
                        <template #trigger>
                            <n-tag style="margin-right: auto;" size="large"> 什么是饼干？ </n-tag>
                        </template>
                        <span>
                            饼干就是你在小火锅的账号，<br>由随机分配的9位数字和字母组成。
                        </span>
                    </n-popover>
                    <n-button @click="showThis = false">关闭</n-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>
 

<script setup lang="ts">
import { userLoginPoster } from '@/api/methods/auth';
import { usethemeStore } from '@/stores/theme';
import { useRequest } from 'alova';
import { NButton, NCard, NFlex, NInput, NInputGroup, NInputGroupLabel, NModal, NPopover, NTag } from 'naive-ui';
import { computed, ref } from 'vue';

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

//将唤醒modal的方法暴露给父组件
const showThis = ref<boolean>(false)
const show = () => (showThis.value = true)
defineExpose({ show })

//输入数据
const inputBinggan = ref<string>('')
const inputPassword = ref<string>('')

//导入饼干
function loginHandle() {
    const { onSuccess, data } = useRequest(userLoginPoster(inputBinggan.value, inputPassword.value))
    onSuccess(() => {
        localStorage.Token = data.value.token
        localStorage.Binggan = data.value.binggan
        window.location.href = "/"; //因为希望从头刷新整个程序状态，所以用js原生的重定向，而不是Vuerouter的push
    })
}



</script>

