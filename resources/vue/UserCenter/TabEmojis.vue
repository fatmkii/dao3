<template>
    <n-flex vertical>
        <!-- 官方表情包的选择 -->
        <n-card title="官方表情包" size="small">
            <template #header-extra>
                <n-text :depth="3" style="font-size: 0.875rem;">可以关闭不想要的表情包</n-text>
            </template>
            <n-checkbox-group v-model:value="emojiSelected">
                <n-flex size="small">
                    <n-checkbox v-for="emojiItem in emojiData" :value="emojiItem.id" :label="emojiItem.name" />
                </n-flex>
            </n-checkbox-group>
        </n-card>
        <!-- 我的表情包的编辑 -->
        <n-card title="我的表情包" size="small">
            <template #header-extra>
                <n-flex size="small" :align="'center'" :wrap="true">
                    <n-text :depth="3" style="font-size: 0.875rem;">可拖拽排序</n-text>
                    <f-button @click="removeDuplicate">去重</f-button>
                    <f-button type="primary" @click="showAppendEmoji = true" v-if="!showAppendEmoji">追加</f-button>
                </n-flex>
            </template>
            <!-- 点击删除功能开关 -->
            <n-flex size="small" style="margin-bottom: 6px;">
                <n-switch v-model:value="emojiDeleteMode" />
                <span>启用点击删除功能</span>
            </n-flex>
            <!-- 表情包 -->
            <n-flex size="small" style="touch-action: none;">
                <Emoji v-for="(emojiItem, index) in emojiListInput" :key="emojiItem.id" :emojiSrc="emojiItem.emojiSrc"
                    :index="index" @click="emojiImgClick(index)" @move-card="moveCard"
                    @delete-emoji="deleteEmojiHandle" />
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
                <div class="emoji-box" v-for="( emojiSrc, key, index ) in appendEmojiInputArray">
                    <img :src="emojiSrc" class="emoji-in-box">
                </div>
            </n-flex>
            <n-input type="textarea" v-model:value="appendEmojiInput" placeholder="在这里贴网址追加表情包。可以一次多个，每行一个。"
                style="border-radius: 10px; margin-top: 6px; " :autosize="{ minRows: 3, maxRows: 5 }" />
        </n-card>

        <!-- 提交按钮和其他显示 -->
        <n-flex :align="'center'" :justify="'end'">
            <n-text :depth="3" style="font-size: 0.875rem;">上面所有变更都要提交后才生效喔</n-text>
            <f-button @click="exportAllEmoji">导出</f-button>
            <f-button @click="emojiSetHandle" type="primary" :loading="myEmojisSetLoading"
                :disabled="myEmojisSetLoading">提交</f-button>
        </n-flex>

        <ExportEmojiModal ref="ExportEmojiModalCom" />
    </n-flex>
</template>

<script setup lang="ts">

import { myEmojisSetPoster, type myEmojisSetParams } from '@/api/methods/user'
import emojiData from '@/data/emojiData'
import { useUserStore } from '@/stores/user'
import Emoji from '@/vue/UserCenter/Dnd/Emoji.vue'
import { FButton } from '@custom'
import { TrashCan } from '@vicons/carbon'
import { toRefs } from '@vueuse/core'
import { useRequest } from 'alova'
import { NCard, NCheckbox, NCheckboxGroup, NFlex, NIcon, NInput, NText, NSwitch, useThemeVars } from 'naive-ui'
import { computed, ref, unref, watch } from 'vue'
import { useDrop } from 'vue3-dnd'
import ExportEmojiModal from './Modal/ExportEmojiModal.vue'

//基础数据
const userStore = useUserStore()
const themeVars = useThemeVars()
const ExportEmojiModalCom = ref<InstanceType<typeof ExportEmojiModal> | null>(null)

//官方表情包选择
const emojiIdsArray = emojiData.map(item => item.id) //提取官方表情包的id，形如[1,2,3……]
const emojiSelected = ref<number[]>(emojiIdsArray.filter((id) => !userStore.userData.emoji_excluded.includes(id)))
const emojiExcluded = computed<number[]>(() => emojiIdsArray.filter((id) => !emojiSelected.value.includes(id)))

//我的表情包列表（仅本组件编辑用的副本）
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
    if (value === false) setEmojiListInput(userStore.userData.my_emoji)
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

//点击删除表情包功能
const emojiDeleteMode = ref<boolean>(false)
function emojiImgClick(index: number) {
    if (emojiDeleteMode.value === true) {
        emojiListInput.value.splice(index, 1)
    }
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
        my_emoji: emojiListInput.value.map(item => item.emojiSrc),
        emoji_excluded: emojiExcluded.value,
    }
    myEmojisSetSend(params)
}
const { loading: myEmojisSetLoading,
    send: myEmojisSetSend,
    onSuccess: myEmojisSetOnSuccess } = useRequest(
        (params: myEmojisSetParams) => myEmojisSetPoster(params), { immediate: false, initialData: [] }
    );
myEmojisSetOnSuccess(() => userStore.refreshUserData())


//导出表情包
function exportAllEmoji() {
    ExportEmojiModalCom.value?.show(emojiListInput.value.map(item => item.emojiSrc).join(',\n'), '我的表情包')
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