<template>
    <n-flex vertical>
        <!-- 现有表情包的编辑 -->
        <n-card title="我的表情包" size="small">
            <template #header-extra>
                <n-flex size="small" :align="'center'" :wrap="true">
                    <n-text :depth="3" style="font-size: 0.875rem;">可拖拽(new!)</n-text>
                    <f-button type="primary" @click="showAppendEmoji = true" v-if="!showAppendEmoji">追加</f-button>
                    <f-button @click="removeDuplicate">去重</f-button>
                </n-flex>
            </template>
            <!-- 表情包 -->
            <n-flex size="small">
                <Emoji v-for="(emojiItem, index) in emojiListInput" :key="emojiItem.id" :emojiSrc="emojiItem.emojiSrc"
                    :index="index" @move-card="moveCard" @delete-emoji="deleteEmojiHandle" />
            </n-flex>
            <!-- 垃圾桶 -->
            <div :ref="dropTrash" class="emoji-trash" :style="{ backgroundColor: backgroundColor }">
                <n-text :depth="3">拖到这里删除</n-text>
                <n-icon :size="28">
                    <TrashCan />
                </n-icon>
            </div>
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
        <n-flex :align="'center'" :justify="'end'">
            <n-text :depth="3" style="font-size: 0.875rem;">上面所有变更都要提交后才生效喔</n-text>
            <f-button @click="emojiSetHandle" type="primary">提交</f-button>
        </n-flex>
    </n-flex>
</template>

<script setup lang="ts">

import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { myEmojisSetPoster, type myEmojisSetParams } from '@/api/methods/user'
import { FButton } from '@custom'
import { NCard, NFlex, NText, NInput, NIcon, useThemeVars } from 'naive-ui'
import { ref, watch, computed, unref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Emoji from '@/vue/UserCenter/Dnd/Emoji.vue'
import { TrashCan } from '@vicons/carbon'
import { useDrop } from 'vue3-dnd'
import { toRefs } from '@vueuse/core'

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

//拖拽功能
const moveCard = (dragIndex: number, hoverIndex: number) => {
    const item = emojiListInput.value[dragIndex]
    emojiListInput.value.splice(dragIndex, 1)
    emojiListInput.value.splice(hoverIndex, 0, item)
}
const [collect, dropTrash] = useDrop(() => ({
    accept: 'emojiImg',
    drop: () => ({ name: 'Dustbin' }),
    collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    }),
}))
const { canDrop, isOver } = toRefs(collect)
const isActive = computed(() => unref(canDrop) && unref(isOver))
const backgroundColor = computed(() => unref(isActive) ? themeVars.value.tagColor : themeVars.value.cardColor)

//拖拽删除表情包
function deleteEmojiHandle(index: number) {
    emojiListInput.value.splice(index, 1)
}


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
    let arr = emojiListInput.value.map(item => item.emojiSrc)//先合并回string[]
    arr = arr.filter((item, index) => arr.indexOf(item) === index);//去重
    emojiListInput.value = arr.map((item, index) => ({ emojiSrc: item, id: index }));//恢复为{emojiSrc:string,id:number}
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

.emoji-trash {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    margin-top: 12px;
    border: 1px dashed;
    border-radius: 10px;
    border-color: v-bind('themeVars.textColor1');
}
</style>