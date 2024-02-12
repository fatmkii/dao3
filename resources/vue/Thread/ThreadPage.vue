<template>
    <n-flex vertical>
        <template v-if="showThis">
            <!-- 顶部功能按钮就及分页导航 -->
            <n-flex :align="'center'" style="margin-top: 8px;">
                <n-icon :size="commonStore.isMobile ? 28 : 34">
                    <SearchIcon style="cursor: pointer;" @click="showSearchInput = !showSearchInput" />
                </n-icon>
                <Pagination v-model:page="pageSelected"
                    :last-page="postsListLoading ? 1 : postsListData.posts_data.lastPage" style="margin-left: auto;" />
            </n-flex>
            <!-- 搜索输入（弹出） -->
            <n-flex v-if="showSearchInput" :wrap="false">
                <f-input v-model:value="searchContentInput" :maxlength="100" style="max-width: 400px;" placeholder="搜索回复内容"
                    auto-size />
                <f-button type="primary" @click="console.log('//TODO搜索')">搜索</f-button>
                <f-button type="default" @click="handleSearchClear">清空</f-button>
            </n-flex>

            <!-- 标题 -->
            <n-card v-if="!(postsListLoading || postsListFetching)" class="thread-title-contain" size="small"
                key="title-card">
                <span class="thread-title">
                    {{ postsListData.thread_data.title }} [{{ postsListData.thread_data.posts_num }}]
                </span>
                <f-button size="small" type="primary" v-if="threadData.is_your_thread"
                    style="float: right; margin-left: 0.5rem;">
                    变色
                </f-button>
                <f-button size="small" type="warning" v-if="userStore.checkAdminForums(forumData?.id)"
                    style="float: right; margin-left: 0.5rem">
                    删主题
                </f-button>
            </n-card>
            <n-skeleton v-else class="thread-title-skeleton" sharp />

            <!-- 循环渲染各个回复 -->
            <PostList :show-this="!postsListLoading" :forum-id="postsListLoading ? 0 : postsListData.forum_data.id"
                :random-head-group-index="postsListLoading ? 1 : postsListData.thread_data.random_heads_group"
                :posts-data-raw="postsListLoading ? [] : postsListData.posts_data.data"
                :anti-jingfen="threadData?.anti_jingfen" :no-custom-emoji-mode="noCustomEmojiMode"
                :no-emoji-mode="noEmojiMode" :no-head-mode="noHeadMode" :no-image-mode="noImageMode"
                :no-video-mode="noVideoMode" :no-battle-mode="noBattleMode" :no-hongbao-mode="noHongbaoMode"
                :no-reward-mode="noRewardMode" :no-roll-mode="noRollMode"
                @refresh-posts-list="handleFetchPostsList(false)" />

            <!-- 自动涮锅和分页导航 -->
            <n-flex :align="'center'" style="margin-top: 8px;">
                <f-button type="primary" :disabled="postListening" :loading="postListening"
                    @click="handleFetchPostsList(true)">刷新</f-button>
                <n-switch v-model:value="postListening">
                    <template #checked>
                        涮锅中…
                    </template>
                    <template #unchecked>
                        自动涮锅
                    </template>
                </n-switch>
            </n-flex>

            <!-- 分页导航 -->
            <n-flex :align="'center'" style="margin-top: 8px;">
                <f-button @click="router.push({ name: 'forum', params: { forumId: forumData?.id } })">返回小岛</f-button>
                <Pagination v-model:page="pageSelected"
                    :last-page="postsListLoading ? 1 : postsListData.posts_data.lastPage" style="margin-left: auto;" />
            </n-flex>
            <!-- 输入框 -->
            <PostInput mode="post" :forum-id="postsListLoading ? 0 : postsListData.forum_data.id" :disabled="false"
                :handling="false" @content-commit="console.log('//TODO发帖')" />


            <!-- 底部提示 -->

        </template>
        <!-- 各种弹出提示框或者模态框 -->



        <!-- 页面底部留空白 -->
        <div style="height: 50px;"></div>

        <!-- 发送到TopBar的版面标题 -->
        <Teleport to="#topbar-nav" v-if="!postsListLoading">
            <router-link :to="{ name: 'forum', params: { forumId: forumData?.id } }" class="flex-item-center">
                <n-ellipsis :style="{ maxWidth: commonStore.isMobile ? '120px' : '900px' }" :tooltip="false">
                    {{ forumData?.name }}
                </n-ellipsis>
                <n-tag round class="forum-tag" :size="commonStore.isMobile ? 'small' : 'medium'">{{ forumData?.id }}</n-tag>
            </router-link>
        </Teleport>
        <Teleport to="#topbar-func" v-if="!postsListLoading">
            <!-- 屏蔽按钮 -->
            <n-dropdown trigger="hover" :options="funcOptions" placement="bottom-start">
                <f-button>屏蔽</f-button>
            </n-dropdown>
        </Teleport>
    </n-flex>
</template>

<script setup lang="ts">
import { NFlex, NTag, NEllipsis, NDropdown, NIcon, NSkeleton, NCard, useThemeVars, NSwitch } from 'naive-ui'
import { useDebounce } from '@/js/func/debounce'
import { FButton, FCheckbox, FInput } from '@custom'
import { useLocalStorageToRef } from '@/js/func/localStorageToRef'
import { useTopbarNavControl } from '@/js/func/topbarNav'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { postsListGetter, type getPostsListParams } from '@/api/methods/threads'
import Pagination from '@/vue/Components/Pagination.vue'
import PostList from '@/vue/Thread/PostList/PostList.vue'
import PostInput from '@/vue/Components/PostInput/PostInput.vue'
import { useWatcher, useFetcher } from 'alova'
import { useRouter } from 'vue-router'
import { ref, computed, watch, h } from 'vue'
import { SearchOutline as SearchIcon } from '@vicons/ionicons5'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const router = useRouter()
const themeVars = useThemeVars()

//用teleport组件替代掉topbar的“小火锅”
useTopbarNavControl()


//组件props
interface Props {
    threadId: number //来自路由
    page: number //来自路由
    search?: string//来自路由
}
const props = withDefaults(defineProps<Props>(), {

})

//整体显示的开关。当遇到禁止进入等提示的时候关闭
const showThis = ref<boolean>(true)


//屏蔽选项下拉框
const noVideoMode = useLocalStorageToRef<boolean>('no_video_mode', false) //音频视频
const noImageMode = useLocalStorageToRef<boolean>('no_image_mode', false)//图片
const noEmojiMode = useLocalStorageToRef<boolean>('no_emoji_mode', false)//一般表情包
const noCustomEmojiMode = useLocalStorageToRef<boolean>('no_custom_emoji_mode', false) //自定义表情包
const noHeadMode = useLocalStorageToRef<boolean>('no_head_mode', false) //头像
const noBattleMode = useLocalStorageToRef<boolean>('no_battle_mode', false) //大乱斗
const noRollMode = useLocalStorageToRef<boolean>('no_roll_mode', false) //roll点
const noRewardMode = useLocalStorageToRef<boolean>('no_reward_mode', false) //打赏
const noHongbaoMode = useLocalStorageToRef<boolean>('no_hongbao_mode', false) //红包结果

const refList = [//用于批量生成checkbox
    { ref: noVideoMode, label: '音频视频' },
    { ref: noImageMode, label: '图片' },
    { ref: noEmojiMode, label: '一般表情包' },
    { ref: noCustomEmojiMode, label: '自定义表情包' },
    { ref: noHeadMode, label: '头像' },
    { ref: noBattleMode, label: '大乱斗' },
    { ref: noRollMode, label: 'roll点' },
    { ref: noRewardMode, label: '打赏' },
    { ref: noHongbaoMode, label: '红包结果' },
]
function renderFuncOptions() {
    return h(
        NFlex,
        {
            style: 'padding:6px 8px',
            vertical: true,
        },
        () => [
            Array.from(refList).map((item) => {
                return h(FCheckbox, {
                    checked: item.ref.value,
                    'onUpdate:checked': (value: boolean) => item.ref.value = value,
                    label: item.label
                })
            }),
        ]
    )
}
const funcOptions = [
    {
        type: 'group',
        key: 'header',
        label: '屏蔽',
    },
    {
        key: 'header-divider',
        type: 'divider'
    },
    {
        key: 'funcOption',
        type: 'render',
        render: renderFuncOptions,
    },
]

//搜索功能
const searchContentInput = ref<string | undefined>(props.search)
const showSearchInput = ref<boolean>(props.search ? true : false)
watch(searchContentInput, (searchContent) => {
    //设置防抖，searchContentInput变更超过500ms后才改变路由
    const pushRoute = useDebounce(
        () => router.push({
            name: "thread", params: { threadId: props.threadId, page: props.page },
            query: { search: searchContent || undefined }//如果是空字符串''，则返回undefined避免请求中发送一个空的searchTitle
        })
    )
    pushRoute()
})
function handleSearchClear() {
    searchContentInput.value = undefined
    showSearchInput.value = false

}

//侦听分页器跳转路由
const pageSelected = ref<number>(props.page)
watch(pageSelected,
    (toPage) => {
        router.push({ name: "thread", params: { threadId: props.threadId, page: toPage }, query: { search: props.search } })
    }
)

//自动涮锅功能//TODO
const postListening = ref<boolean>(false)



//useWathcer和useFetcher共用的回复列表数据请求参数
const postsListParams = computed<getPostsListParams>(() => {
    return {
        threadId: props.threadId,
        binggan: userStore.binggan!,
        page: props.page,
        searchContent: props.search,
    }
})

//获取回复列表数据（监听props变更）
const { loading: postsListLoading, data: postsListData } = useWatcher(
    () => postsListGetter(postsListParams.value),
    [() => props.threadId, () => props.page, () => props.search],
    { initialData: {}, immediate: true, }
);

//刷新回复列表数据
const remindFetch = ref<boolean>(false)//用来判断是否弹出提醒的
const { fetching: postsListFetching, onSuccess: fetchPostsListOnSucess, fetch: fetchPostsList } = useFetcher();
function handleFetchPostsList(remind: boolean = false) {
    remindFetch.value = remind
    fetchPostsList(postsListGetter(postsListParams.value))
}
fetchPostsListOnSucess(() => { if (remindFetch.value) { window.$message.success('已刷新数据') } })

//从postsListData抽离出threadData和forumData方便使用
const threadData = computed(() => postsListData.value.thread_data)
const forumData = computed(() => postsListData.value.forum_data)

</script>

<style scoped>
.thread-title {
    font-size: 1.125rem;
}

.thread-title-contain {
    border-radius: 10px;
    /* background-color: v-bind('themeVars.buttonColor2'); */
}

.thread-title-skeleton {
    border-radius: 10px;
    height: 48px;
}
</style>