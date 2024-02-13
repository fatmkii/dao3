<template>
    <n-flex vertical :size="2" v-if="showThis">
        <!-- 回复card -->
        <PostItem v-for="postData in postsData" :key="postData.id" :post-data="postData" :your-posts-list="yourPostsList"
            :anti-jingfen="antiJingfen" :forum-id="forumId" :no-custom-emoji-mode="noCustomEmojiMode"
            :no-emoji-mode="noEmojiMode" :no-head-mode="noHeadMode" :no-image-mode="noImageMode"
            :no-video-mode="noVideoMode" :random-head-group-index="randomHeadGroupIndex"
            @show-reward-modal="RewardModalCom?.show" @quote-click="quoteClick"
            @refresh-posts-list="emit('refreshPostsList')" />
    </n-flex>
    <n-flex vertical :size="2" v-else>
        <n-skeleton class="posts-card-skeleton" v-for="  n   in   10  " />
    </n-flex>

    <!-- 各种弹出modal -->
    <RewardModal ref="RewardModalCom" @refresh-posts-list="emit('refreshPostsList')" />
</template>

<script setup lang="ts">
import { NFlex, NSkeleton, NCard, NCollapse, NCollapseItem, NIcon, NDropdown, NText } from 'naive-ui'
import { FButton, FCheckbox, FInput } from '@custom'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import type { postData } from '@/api/methods/posts'
import RewardModal from './RewardModal.vue'
import PostItem from './PostItem.vue'
import { useRouter } from 'vue-router'
import { ref, computed, watch, h } from 'vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const router = useRouter()

//组件props
interface Props {
    showThis: boolean,
    postsDataRaw: postData[] | [],
    yourPostsList: number[] | [],
    forumId: number,
    randomHeadGroupIndex: number,
    antiJingfen?: boolean,
    noImageMode?: boolean,
    noEmojiMode?: boolean,
    noCustomEmojiMode?: boolean,
    noHeadMode?: boolean,
    noVideoMode?: boolean,
    noBattleMode?: boolean,
    noRollMode?: boolean,
    noRewardMode?: boolean,
    noHongbaoMode?: boolean,
}
const props = withDefaults(defineProps<Props>(), {
    postsListData: () => [],
    randomHeadGroupIndex: 1,
    antiJingfen: false,
    noImageMode: false,
    noEmojiMode: false,
    noCustomEmojiMode: false,
    noHeadMode: false,
    noVideoMode: false,
    noBattleMode: false,
    noRollMode: false,
    noRewardMode: false,
    noHongbaoMode: false,
})

//各种emit
const emit = defineEmits<{
    refreshPostsList: [],
    quoteClick: [content: string],
}>()

//各种Modal
const RewardModalCom = ref<InstanceType<typeof RewardModal> | null>(null)

//回复数据处理（第一种屏蔽等）
const postsData = computed(() => {
    let postsData: postData[]
    //第一种屏蔽类型：直接过滤掉整个postData元素的（大乱斗/roll点等）
    postsData = props.postsDataRaw.filter((post) => {
        if (props.noBattleMode === true && post.battle_id !== null) { return false }
        if (props.noRollMode === true && post.created_by_admin === 2 && post.nickname === 'Roll点系统') { return false }
        if (props.noRewardMode === true && post.created_by_admin === 2 && post.nickname === '奥利奥打赏系统' && !post.is_your_post) { return false }
        if (props.noHongbaoMode === true) {
            //红包结果屏蔽条件
            const condition1 =
                post.created_by_admin == 2 &&
                post.nickname == "红包结果" &&
                !post.is_your_post;
            //抢红包的口令屏蔽条件
            const condition2 = /^--红包口令: /.test(post.content) && !post.is_your_post;
            if (condition1 || condition2) {
                return false;
            }
        }
        return true
    })
    return postsData
})

//处理来自子组件的回复引用事件
function quoteClick(content: string) {
    emit('quoteClick', content)
}

//生成一个“is_your_post”的floor号清单，给PostItem标注自己的被引用
const yourPostList = computed(() => {
    const result = Array.from(postsData.value).map((postData) => {
        if (postData.is_your_post) {
            return postData.floor
        } else {
            return undefined
        }
    })
    console.log(result)
    return result
})


</script>

<style scoped>
.posts-card-skeleton {
    border-radius: 10px;
    height: 100px;
    width: 100%;
}
</style>