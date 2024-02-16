<template>
    <n-flex vertical>
        <!-- 顶部功能按钮就及分页导航 -->
        <n-flex :align="'center'" style="margin-top: 8px;">
            <n-icon :size="commonStore.isMobile ? 28 : 34">
                <SearchIcon style="cursor: pointer;" @click="showSearchInput = !showSearchInput" />
            </n-icon>
            <Pagination v-model:page="pageSelected" :last-page="postsListLoading ? 1 : postsListData.posts_data.lastPage"
                style="margin-left: auto;" />
        </n-flex>
        <!-- 搜索输入（弹出） -->
        <n-flex v-if="showSearchInput" :wrap="false">
            <f-input v-model:value="searchContentInput" :maxlength="100" style="max-width: 400px;" placeholder="搜索回复内容"
                auto-size />
            <f-button type="primary" @click="handleFetchPostsList(true)">搜索</f-button>
            <f-button type="default" @click="handleSearchClear">清空</f-button>
        </n-flex>
        <!-- 浏览进度弹出提示 -->
        <BrowseLogger :page="page" :thread-id="threadId" :posts-list-loading="postsListLoading"
            :disable-scroll="Boolean(search)" />
        <!-- 标题 -->
        <n-card v-if="!postsListLoading" class="thread-title-contain" size="small" key="title-card">
            <span class="thread-title">
                {{ postsListData.thread_data.title }} [{{ postsListData.thread_data.posts_num }}]
            </span>
            <f-button size="small" type="primary" v-if="threadData.is_your_thread"
                style="float: right; margin-left: 0.5rem;" @click="ChangeColorModalCom?.show()">
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
            :your-posts-list="postsListLoading ? [] : postsListData.your_post_floors"
            :anti-jingfen="threadData?.anti_jingfen" :no-custom-emoji-mode="noCustomEmojiMode" :no-emoji-mode="noEmojiMode"
            :no-head-mode="noHeadMode" :no-image-mode="noImageMode" :no-video-mode="noVideoMode"
            :no-battle-mode="noBattleMode" :no-hongbao-mode="noHongbaoMode" :no-reward-mode="noRewardMode"
            :no-roll-mode="noRollMode" @quote-click="postInputCom?.quoteHandle"
            @refresh-posts-list="handleFetchPostsList(false)" />

        <!-- 自动涮锅和分页导航 -->
        <n-flex :align="'center'" style="margin-top: 8px;">
            <f-button type="primary" :disabled="postListening || postsListFetching"
                :loading="postListening || postsListFetching" @click="handleFetchPostsList(true)">刷新</f-button>
            <n-switch v-model:value="postListening" :disabled="!isLastPage || postListenShowNextPage">
                <template #checked>
                    涮锅中…
                </template>
                <template #unchecked>
                    自动涮锅
                </template>
            </n-switch>
            <router-link :to="{ name: 'thread', params: { threadId: threadId, page: page + 1 } }"
                v-if="postListenShowNextPage">回帖已经翻页、点击前往
            </router-link>
            <n-text v-if="!isLastPage">在最新一页才能自动涮锅</n-text>
        </n-flex>

        <!-- 分页导航 -->
        <n-flex :align="'center'" style="margin-top: 8px;">
            <f-button @click="router.push({ name: 'forum', params: { forumId: forumData?.id } })">返回小岛</f-button>
            <Pagination v-model:page="pageSelected" :last-page="postsListLoading ? 1 : postsListData.posts_data.lastPage"
                style="margin-left: auto;" />
        </n-flex>
        <!-- 输入框 -->
        <PostInput ref="postInputCom" mode="post" :forum-id="postsListLoading ? 0 : postsListData.forum_data.id"
            :disabled="false" :handling="newPostHandling" @content-commit="newPostHandle" />


        <!-- 底部提示 -->

        <!-- 页面底部留空白 -->
        <div style="height: 50px;"></div>

        <!-- 发送到TopBar的版面标题 -->
        <Teleport to="#topbar-nav" v-if="!postsListLoading">
            <router-link :to="{ name: 'forum', params: { forumId: forumData?.id } }" class="flex-item-center">
                <n-ellipsis :style="{ maxWidth: commonStore.isMobile ? '120px' : '900px' }" :tooltip="false">
                    {{ forumData?.name }}
                </n-ellipsis>
                <n-tag round class="forum-tag" :size="commonStore.isMobile ? 'small' : 'medium'">{{ forumData?.id
                }}</n-tag>
            </router-link>
        </Teleport>
        <Teleport to="#topbar-func" v-if="!postsListLoading">
            <!-- 屏蔽按钮 -->
            <n-dropdown trigger="hover" :options="funcOptions" placement="bottom-start">
                <f-button>屏蔽</f-button>
            </n-dropdown>
        </Teleport>

        <!-- 各种弹出modal -->
        <ChangeColorModal ref="ChangeColorModalCom" :thread-id="threadId" />
    </n-flex>
</template>

<script setup lang="ts">
import { newPostPoster, postGetter, type newPostParams, type postParams, type postData } from '@/api/methods/posts'
import { postsListGetter, type getPostsListParams } from '@/api/methods/threads'
import { useEcho } from '@/js/echo.js'
import { useDebounce } from '@/js/func/debounce'
import { useLocalStorageToRef } from '@/js/func/localStorageToRef'
import { useTopbarNavControl } from '@/js/func/topbarNav'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import Pagination from '@/vue/Components/Pagination.vue'
import type { contentCommit } from '@/vue/Components/PostInput/PostInput.vue'
import PostInput from '@/vue/Components/PostInput/PostInput.vue'
import PostList from '@/vue/Thread/PostList/PostList.vue'
import { FButton, FCheckbox, FInput } from '@custom'
import { SearchOutline as SearchIcon } from '@vicons/ionicons5'
import { useFetcher, useRequest, useWatcher } from 'alova'
import * as CryptoJS from 'crypto-js'
import { NCard, NDropdown, NEllipsis, NFlex, NIcon, NSkeleton, NSwitch, NTag, NAlert, NText, useThemeVars } from 'naive-ui'
import { computed, h, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrowseLogger from './BrowseLogger.vue'
import ChangeColorModal from './ChangeColorModal.vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const route = useRoute()
const router = useRouter()
const themeVars = useThemeVars()
const postInputCom = ref<InstanceType<typeof PostInput> | null>(null)//输入框组件的ref

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

//各种Modal
const ChangeColorModalCom = ref<InstanceType<typeof ChangeColorModal> | null>(null)

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

//侦听分页器跳转路由
const pageSelected = ref<number>(props.page)
watch(pageSelected,
    (toPage) => {
        router.push({ name: "thread", params: { threadId: props.threadId, page: toPage }, query: { search: props.search } })
    }
)
watch(() => props.page,
    //其他代码router.push的时候，也需要同时变更pageSelected
    (page) => pageSelected.value = page
)

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
const { loading: postsListLoading, data: postsListData, onSuccess: postsListOnSuccess } = useWatcher(
    () => postsListGetter(postsListParams.value),
    [() => props.threadId, () => props.page, () => props.search],
    { initialData: {}, immediate: true, }
);
postsListOnSuccess(() => {
    nextTick(() => {
        //如果地址有#hash，则滚动到对应hash
        if (route.hash) {
            const floorTarget = document.querySelector(route.hash)
            floorTarget?.scrollIntoView({ block: "center", behavior: "auto" });
        }
    })
})

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


//自动涮锅功能（广播系统）
const postListening = ref<boolean>(false)
const postListenShowNextPage = ref<boolean>(false)
const isLastPage = computed(() => props.page === (postsListLoading.value ? props.page : postsListData.value.posts_data.lastPage))
const echo = useEcho()
interface broadcastNewPost {
    post_id: number,
    thread_id: number,
    post_floor: number,
}
function listenNewPost(response: broadcastNewPost) {//执行监听的回调
    if (response.post_floor >= props.page * 200) {
        //如果新回复通知中，楼层号大于本页的，则关闭监听并显示翻页选项
        postListening.value = false;
        postListenShowNextPage.value = true;
    } else {
        //否则，请求新回复数据
        const postExist = postsListData.value.posts_data.data.find((post) => post.id === response.post_id)
        if (!postExist) {
            //如果post_id不存在，才去获取新数据
            getPostDataAndPush(response.thread_id, response.post_id);
        }
    }
}
function getPostDataAndPush(threadId: number, postId: number) {//获取单个回复数据并插入到数据中
    const params: postParams = {
        binggan: userStore.binggan!,
        post_id: postId,
        thread_id: threadId,
    }
    postGetter(params).then((postData: postData) => {
        postsListData.value.posts_data.data.push(postData)
        const scrollTopNow =
            document.body.clientHeight - document.documentElement.scrollTop; //用于使窗口位置保持不变
        nextTick(() => {
            if (postInputCom.value?.isTyping) {
                //如果正在输入，则使窗口位置保持不变
                document.documentElement.scrollTop =
                    document.body.clientHeight - scrollTopNow;
            }
        });
    })
}
watch(postListening, (value) => {//开关广播监听
    if (value === true) {
        try {
            handleFetchPostsList(false)
            echo.connect()
            echo.channel("thread_" + props.threadId)
                .listen("NewPost", (response: broadcastNewPost) => listenNewPost(response))
            echo.pusher?.connection.bind("state_change", (states: { previous: string, current: string }) => {
                if (states.current === 'unavailable') {
                    window.$message.error('嗷……服务器的自动涮锅服务好像出问题了，暂时不能使用')
                    postListening.value = false
                }
            })
        } catch (error) {
            window.$message.error('嗷……服务器的自动涮锅服务好像出问题了，暂时不能使用')
            postListening.value = false
        }
    } else {
        if (echo.isConnected) {
            echo.disconnect()
        }
    }
})
onBeforeUnmount(() => {
    if (echo.isConnected) {
        echo.disconnect()
    }
})
watch([() => props.threadId, () => props.page, () => props.search],//路由变化时停止自动涮锅
    () => {
        postListening.value = false
        postListenShowNextPage.value = false
    }
)



//发送新回复
function newPostHandle(content: contentCommit, resolve: (value: any) => void) {
    const timestamp = new Date().getTime();
    const params: newPostParams = {
        binggan: userStore.binggan!,
        forum_id: forumData.value.id,
        thread_id: threadData.value.id,
        content: content.contentInput,
        nickname: content.nicknameInput,
        post_with_admin: content.postWithAdmin,
        new_post_key: CryptoJS.MD5(
            threadData.value.id + userStore.binggan! + timestamp + content.ist
        ).toString(),
        timestamp: timestamp,
    }
    sendNewPostHandle(params)
    newPostOnSuccess(() => {
        resolve('success') //来自PostInput的Promise回调，让PostInput复位
        handleFetchPostsList(false)
    })
}
const { loading: newPostHandling, send: sendNewPostHandle, onSuccess: newPostOnSuccess } = useRequest(
    (params: newPostParams) => newPostPoster(params), { immediate: false }
)


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