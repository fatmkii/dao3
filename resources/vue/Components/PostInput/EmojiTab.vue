<template>
    <n-tabs type="line" :bar-width="0" animated @before-leave="tabOnBeforeLeave"
        :size="commonStore.isMobile ? 'small' : 'medium'" :default-value="-1" v-model:value="tabValue">
        <n-tab-pane v-for="(emojiGroup, key) in emojiData" :name="emojiGroup.id"
            :tab="tabRender(emojiGroup.name, emojiGroup.id)">
            <n-flex size="small" class="emoji-container" :style="tabPaneStyle">
                <div class="emoji-box" v-for="(emojiSrc, key) in emojiGroup.emojis"
                    @click="emojiClick(emojiSrc, emojiGroup.name)">
                    <img :src="emojiSrc" class="emoji-in-box">
                </div>
            </n-flex>
        </n-tab-pane>
        <n-tab-pane :name="-1" tab="隐藏"></n-tab-pane>
    </n-tabs>
</template>

<script setup lang="ts">
import emojiDataRaw from '@/data/emojiData';
import { useUserStore } from '@/stores/user';
import { useCommonStore } from '@/stores/common';
import { NFlex, NTabPane, NTabs } from 'naive-ui';
import { computed, ref, h } from 'vue';


//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()

//组件props
interface Props {
    randomHeadsGroup?: number,
    autoHide?: boolean,
}
const props = withDefaults(defineProps<Props>(), {
    randomHeadsGroup: 1,
    autoHide: true,
})

//TabPane的style，主要是给侧边栏留白
const tabPaneStyle = computed(() => {
    // 这是给侧边栏的padding,避免阻挡文字内容。
    let paddingLeft = 0
    let paddingRight = 0
    if (commonStore.isMobile) { //电脑版不需要padding
        if (commonStore.userCustom.sidebarLeft) {
            paddingLeft = 20
        } else {
            paddingRight = 20
        }
    }
    return {
        paddingLeft: paddingLeft + 'px',
        paddingRight: paddingRight + 'px',
    }
})


//当前tab的标签序号
const tabValue = ref<number>()

//处理表情包数据
const emojiData = computed(() => {
    //过滤条件：1）未包含在userData的emoji_exclude中（个人中心的设定）2）headsId为0（默认显示）或者headsId符合主题headsId
    const result = emojiDataRaw.filter((emojiGroup) =>
        !userStore.userData.emoji_excluded.includes(emojiGroup.id) && //排除掉用户设定的不显示表情包
        (emojiGroup.headsId === 0 || emojiGroup.headsId === props.randomHeadsGroup)
    )
    //追加自定义表情包
    if (userStore.userData.my_emoji) {
        result.unshift({
            id: 0,
            headsId: 0,
            name: '自定义',
            emojis: userStore.userData.my_emoji,
        })
    }
    return result
})

//点击表情包处理
const emit = defineEmits<{
    appendEmoji: [emojiSrc: string, isMyEmoji: boolean]
}>()
function emojiClick(emojiSrc: string, emojiDataName: string) {
    const isMyEmoji = emojiDataName === '自定义'
    emit("appendEmoji", emojiSrc, isMyEmoji);
    if (props.autoHide) {
        tabValue.value = -1//自动收起表情包
    }
}

//tab手动render来绑定一个事件，使再次点击tab的时候可以关闭（其实是跳转去-1）
let closeFlag: boolean = false //用来标记是否是手动操作关闭tab的标记
function tabRender(tabName: string, tabId: number) {
    return h('span',
        {
            onClick: () => closeTabOrNot(tabId),
            innerHTML: tabName
        }
    )
}
function closeTabOrNot(tabId: number) {
    if (tabId === tabValue.value) {
        //下面的逻辑是：因为是先执行closeTabOrNot，再执行tabOnBeforeLeave
        //给予closeFlag标记让tabOnBeforeLeave返回false，使tab不要切换（也就是保持-1）
        closeFlag = true
        tabValue.value = -1
    }
}
function tabOnBeforeLeave(name: string | number, oldName: string | number | null) {
    if (closeFlag) {
        closeFlag = false
        return false//返回false tab不切换（也就是保持-1）
    } else {
        return true //返回true tab正常切换
    }
}

</script>