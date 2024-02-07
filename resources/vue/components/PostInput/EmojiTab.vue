<template>
    <n-tabs type="card" animated size="small" :default-value="-1" v-model:value="tabValue" @close="tabValue = -1">
        <n-tab-pane v-for="(emojiGroup, key, index) in emojiData" :name="emojiGroup.id" :tab="emojiGroup.name"
            :closable="tabValue == emojiGroup.id">
            <n-flex size="small" class="emoji-container">
                <div class="emoji-box" v-for="(emojiSrc, key, index) in emojiGroup.emojis"
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
import { NFlex, NTabPane, NTabs } from 'naive-ui';
import { computed, defineEmits, ref } from 'vue';


//基础数据
const userStore = useUserStore()

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

//自定义事件
const emit = defineEmits(['appendEmoji'])

//当前tab数据
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
function emojiClick(emojiSrc: string, emojiDataName: string) {
    const isMyEmoji = emojiDataName === '自定义'
    emit("appendEmoji", emojiSrc, isMyEmoji);
    if (props.autoHide) {
        tabValue.value = -1//自动收起表情包
    }
}

</script>

<style>
.n-tabs-tab {
    /* 覆盖原本的圆角(3px) */
    --n-tab-border-radius: 10px;

    /* 上面通过把tabValue设定为-1使tab收起来，
    但是当没有name=-1的tab时，有时候会出现tab收不起来的情况
    所以放了一个隐藏的name=-1的tab */
    &[data-name="-1"] {
        display: none !important;
    }
}
</style>