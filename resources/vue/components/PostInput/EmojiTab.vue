<template>
    <n-tabs type="line" :justify-content="commonStore.isMobile ? undefined : 'space-between'" :bar-width="0" animated
        @before-leave="tabOnBeforeLeave" size="small" :default-value="-1" v-model:value="tabValue">
        <n-tab-pane v-for="( emojiGroup, key, index ) in  emojiData " :name="emojiGroup.id"
            :tab="tabRender(emojiGroup.name, emojiGroup.id)">
            <n-flex size="small" class="emoji-container">
                <div class="emoji-box" v-for="( emojiSrc, key, index ) in  emojiGroup.emojis "
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
import { computed, defineEmits, ref, h } from 'vue';


//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()

//组件props
interface Props {
    headsId?: number,
    autoHide?: boolean,
    showEmojiGroupIds?: number[],
}
const props = withDefaults(defineProps<Props>(), {
    headsId: 0,
    autoHide: true,
    showEmojiGroupIds: () => emojiDataRaw.map(item => item.id),
})


//当前tab的标签序号
const tabValue = ref<string | number | undefined>()

//处理表情包数据
const emojiData = computed(() => {
    //过滤条件：1）包含在showEmojiGroupIds中（未被个人中心过滤）2）headsId为0（默认显示）或者headsId符合主题headsId
    const result = emojiDataRaw.filter((emojiGroup) =>
        props.showEmojiGroupIds.includes(emojiGroup.id) &&
        (emojiGroup.headsId === 0 || emojiGroup.headsId === props.headsId)
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

<style lang="scss">
.n-tabs-tab-pad {
    // 覆盖原本的tab之间间距(32px)
    --n-tab-gap: 0px;
}

.n-tabs-scroll-padding {
    // 删掉最前面的留空
    display: none;
}

.n-tabs .n-tabs-wrapper {
    // 手动使tabs可以跨行
    flex-wrap: wrap;
    gap: 0px 12px;
    padding-left: 12px;
    padding-right: 12px;
}

.n-tabs-tab {
    // 上面通过把tabValue设定为-1使tab收起来，
    // 但是当没有name=-1的tab时，有时候会出现tab收不起来的情况
    // 所以放了一个隐藏的name=-1的tab
    &[data-name="-1"] {
        display: none !important;
    }
}
</style>