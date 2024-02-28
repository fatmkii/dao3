<template>
    <n-flex vertical>
        <!-- 现有表情包的编辑 -->
        <n-card title="我的表情包" size="small">
            <template #header-extra>
                <n-flex size="small" :align="'center'">
                    <n-text :depth="3" style="font-size: 0.875rem;">可拖拽(new!)</n-text>
                    <f-button type="primary" @click="showAppendEmoji = true" v-if="!showAppendEmoji">追加</f-button>
                    <f-button @click="removeDuplicate">一键去重</f-button>
                </n-flex>
            </template>
            <n-flex size="small">
                <div class="emoji-box" v-for="( emojiItem, key, index ) in  emojiListInput">
                    <img :src="emojiItem.emojiSrc" class="emoji-in-box">
                </div>
            </n-flex>
        </n-card>
        <!-- 追加表情包功能 -->
        <n-card title="待追加的表情包" size="small" class="dash-line" v-if="showAppendEmoji">
            <template #header-extra>
                <n-flex size="small">
                    <f-button type="primary" @click="appendEmojiHandle">追加</f-button>
                    <f-button type="default" @click="showAppendEmoji = false; appendEmojiInput = ''">关闭</f-button>
                </n-flex>
            </template>
            <n-flex size="small">
                <div class="emoji-box" v-for="( emojiSrc, key, index ) in  appendEmojiInputArray">
                    <img :src="emojiSrc" class="emoji-in-box">
                </div>
            </n-flex>
            <n-input type="textarea" v-model:value="appendEmojiInput" placeholder="在这里贴网址追加表情包。可以一次多个，每行一个。"
                style="border-radius: 10px; margin-top: 6px; " :autosize="{ minRows: 3, maxRows: 5 }" />
        </n-card>

        <!-- 选择表情包功能 -->

        <!-- 提交按钮和其他显示 -->
        <n-flex :align="'center'">
            <f-button @click="emojiSetHandle" type="primary">提交</f-button>
            <n-text :depth="3" style="font-size: 0.875rem;">上面所有变更都要提交后才生效喔</n-text>
        </n-flex>
    </n-flex>
</template>

<script setup lang="ts">

import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { myEmojisSetPoster, type myEmojisSetParams } from '@/api/methods/user'
import { FButton } from '@custom'
import { NCard, NFlex, NText, NInput, useThemeVars } from 'naive-ui'
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const route = useRoute()
const router = useRouter()
const themeVars = useThemeVars()


//表情包列表（仅本组件编辑用的副本）
interface emojiItem {
    emojiSrc: string,
    id: number
}
const emojiListInput = ref<emojiItem[]>([])
function setEmojiListInput(value: string[] | null) {
    if (Array.isArray(value)) {
        emojiListInput.value = value.map((src, index) => ({ emojiSrc: src, id: index }))
    } else {
        emojiListInput.value = []
    }
}
if (userStore.userLoginStatus === true) {
    //初始化数据
    setEmojiListInput(userStore.userData.my_emoji)
}
watch(() => userStore.userDataLoading, (value) => {
    //监听userDataLoading，当用户数据重新读取时，把新数据更新到emojiListInput
    if (value === true) setEmojiListInput(userStore.userData.my_emoji)
})


//新表情包的追加
const showAppendEmoji = ref<boolean>(false)
const appendEmojiInput = ref<string>('')
const appendEmojiInputArray = computed(() => {
    //1）换行、英文或者中文逗号都可以分割。2）并且去掉多余空行。
    return appendEmojiInput.value?.split(/[\n,，]+/).filter(item => item != '')
})
function appendEmojiHandle() {
    showAppendEmoji.value = false
    //将新输入表情包转换成emojiItem类型后，再追加到emojiListInput（并且id递增）
    const appendArray = appendEmojiInputArray.value.map((item, index) => ({ emojiSrc: item, id: index + emojiListInput.value.length }))
    emojiListInput.value = emojiListInput.value.concat(appendArray)
    appendEmojiInput.value = ''

}

//去除重复的表情包
function removeDuplicate() {
    emojiListInput.value = emojiListInput.value.filter((item, index) => emojiListInput.value.indexOf(item) === index);
}


//提交表情包
function emojiSetHandle() {
    if (showAppendEmoji.value === true) {
        //如果用户忘记追加表情包，先追加再提交。
        appendEmojiHandle()
    }
    const params: myEmojisSetParams = {
        binggan: userStore.binggan!,
        my_emoji: emojiListInput.value.map(item => item.emojiSrc)
    }
    myEmojisSetPoster(params).then()
}

//导出表情包
function exportAllEmoji() {

}

</script>

<style lang="scss" scoped>
.dash-line {
    border: 1px dashed;
    border-color: v-bind('themeVars.textColor1');
}
</style>