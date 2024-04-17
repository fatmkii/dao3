<template>
    <n-flex vertical>
        <template v-if="showThis">
            <!-- 顶部功能按钮就及分页导航 -->
            <n-flex :align="'center'" style="margin-top: 8px;">
                <n-icon :size="commonStore.isMobile ? 28 : 34">
                    <SearchIcon style="cursor: pointer;" @click="showSearchInput = !showSearchInput" />
                </n-icon>
                <Pagination v-model:page="pageSelected" @update:page="pageUpdate"
                    :last-page="postsListLoading ? 1 : postsListData.posts_data.lastPage" style="margin-left: auto;" />
            </n-flex>
            <!-- 搜索输入（弹出） -->
            <n-flex v-if="showSearchInput" :wrap="false">
                <f-input v-model:value="searchContentInput" :maxlength="100" style="max-width: 400px;"
                    placeholder="搜索回复内容" auto-size />
                <f-button type="primary" @click="handleSearch">搜索</f-button>
                <f-button type="default" @click="handleSearchClear">清空</f-button>
            </n-flex>
            <!-- 浏览进度弹出提示 -->
            <BrowseLogger :page="page" :thread-id="threadId" :posts-list-loading="postsListLoading"
                :disable-scroll="Boolean(search)" :is-search="Boolean(search)" />
            <!-- 大喇叭（top） -->
            <LoudspeakerComponent v-if="commonStore.userCustom.loudspeakerPosition === 'top'" />
            <!-- 标题 -->
            <n-card class="thread-title-contain" size="small" key="title-card">
                <span class="thread-title">
                    {{ threadData?.title }} [{{ threadData?.posts_num }}]
                </span>
                <n-dropdown v-if="userStore.checkAdminForums(forumData?.id)" trigger="click" :options="adminOptions"
                    @select="dropdownSelect" :size="commonStore.isMobile ? 'medium' : 'large'">
                    <n-icon :size="commonStore.isMobile ? 20 : 24"
                        style="cursor: pointer;float: right; margin-left: 0.5rem;">
                        <Dropdown />
                    </n-icon>
                </n-dropdown>
                <f-button size="small" type="primary" v-if="threadData?.is_your_thread"
                    style="float: right; margin-left: 0.5rem;" @click="ChangeColorModalCom?.show()">
                    变色
                </f-button>
            </n-card>
        </template>
        <template v-if="!postsListLoading && showThis">

            <!-- 循环渲染各个回复 -->
            <n-flex vertical :size="2">
                <!-- 这是第0楼 -->
                <PostItem :post-data="postsData[0]" :your-posts-list="yourPostsList"
                    :anti-jingfen="threadData?.anti_jingfen" :forum-id="forumData.id"
                    :no-custom-emoji-mode="noCustomEmojiMode" :no-emoji-mode="noEmojiMode" :no-head-mode="noHeadMode"
                    :no-image-mode="noImageMode" :no-video-mode="noVideoMode" :use-url-mode="useUrlMode"
                    :random-head-group-index="threadData.random_heads_group" @show-reward-modal="RewardModalCom?.show"
                    @quote-click="postInputCom?.quoteHandle" @refresh-posts-list="handleFetchPostsList(false)"
                    @admin-handle="AdminActionModalCom?.show" />
                <!-- 投票、菠菜、红包、众筹等组件（插在中间） -->
                <VoteComponent ref="VoteComponentCom" v-if="threadData.vote_question_id !== null"
                    :vote-id="threadData.vote_question_id" />
                <GambleComponent ref="GambleComponentCom" v-if="threadData.gamble_question_id !== null"
                    :gamble-id="threadData.gamble_question_id" :forum-id="forumData?.id" />
                <CrowdComponent ref="CrowdComponentCom" v-if="threadData.crowd_id !== null"
                    :crowd-id="threadData.crowd_id" :forum-id="forumData?.id" />
                <HongbaoComponent ref="HongbaoComponentCom" v-if="threadData.hongbao_id !== null"
                    :hongbao-id="threadData.hongbao_id" :thread-id="threadId" :forum-id="forumData?.id"
                    @refresh-posts-list="handleFetchPostsList(false)" />
                <!-- 这是第1楼及之后 -->
                <PostItem v-for="postData in postsData.slice(1)" :key="postData.id" :post-data="postData"
                    :your-posts-list="yourPostsList" :anti-jingfen="threadData?.anti_jingfen" :forum-id="forumData.id"
                    :no-custom-emoji-mode="noCustomEmojiMode" :no-emoji-mode="noEmojiMode" :no-head-mode="noHeadMode"
                    :no-image-mode="noImageMode" :no-video-mode="noVideoMode" :use-url-mode="useUrlMode"
                    :random-head-group-index="threadData.random_heads_group" @show-reward-modal="RewardModalCom?.show"
                    @quote-click="postInputCom?.quoteHandle" @refresh-posts-list="handleFetchPostsList(false)"
                    @admin-handle="AdminActionModalCom?.show" ref="PostItemComs" />
            </n-flex>

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
                <Pagination v-model:page="pageSelected" @update:page="pageUpdate"
                    :last-page="postsListLoading ? 1 : postsListData.posts_data.lastPage" style="margin-left: auto;" />
            </n-flex>
            <!-- 大喇叭（center） -->
            <LoudspeakerComponent v-if="commonStore.userCustom.loudspeakerPosition === 'center'" />
        </template>
        <n-flex vertical :size="2" v-else>
            <n-card size="small" :bordered="true" class="post-card-skeleton" v-for="  n in 200  " />
        </n-flex>

        <!-- 输入框（只有输入框用v-show避免重复加载） -->
        <PostInput v-show="!postsListLoading && showThis" ref="postInputCom" mode="post" :forum-id="forumData?.id"
            :thread-id="threadId" :disabled="false" :handling="newPostHandling"
            :random-heads-group="threadData?.random_heads_group" @content-commit="newPostHandle"
            @refresh-posts-list="handleFetchPostsList" />

        <template v-if="!postsListLoading && showThis">
            <!-- 底部提示 -->
            <n-flex justify="end">
                <n-text v-if="forumData.is_nissin === 2 && threadData.sub_id === 0">
                    本贴将于
                    <n-text type="error">
                        {{ nissinTTL }}
                    </n-text>
                    日清，请及时更换帖子喔
                </n-text>
                <n-text v-if="forumData.is_nissin === 1 && threadData.sub_id === 0">
                    本小岛
                    <n-text type="error">
                        每日早上8:00
                    </n-text>
                    日清，请及时更换帖子喔
                </n-text>
            </n-flex>

            <!-- 大喇叭（top） -->
            <LoudspeakerComponent v-if="commonStore.userCustom.loudspeakerPosition === 'bottom'" />

            <!-- 页面底部留空白 -->
            <div style="height: 50px;"></div>

            <!-- 发送到TopBar的版面标题 -->
            <Teleport to="#topbar-nav">
                <router-link :to="{ name: 'forum', params: { forumId: forumData?.id } }" class="flex-item-center">
                    <n-ellipsis :style="{ maxWidth: commonStore.isMobile ? '120px' : '900px' }" :tooltip="false">
                        {{ forumData?.name }}
                    </n-ellipsis>
                    <n-tag round class="forum-tag" :size="commonStore.isMobile ? 'small' : 'medium'">{{ forumData?.id
                        }}</n-tag>
                </router-link>
            </Teleport>
            <Teleport to="#topbar-func">
                <!-- 屏蔽按钮 -->
                <n-dropdown trigger="hover" :options="funcOptions" placement="bottom-start">
                    <f-button>屏蔽</f-button>
                </n-dropdown>
            </Teleport>

            <!-- 各种弹出modal -->
            <ChangeColorModal ref="ChangeColorModalCom" :thread-id="threadId" />
            <CaptchaModal ref="CaptchaModalCom" @water-unlock-on-success="newPostHandleAgain" />
            <JumpModal ref="JumpModalCom" :thread-id="threadId" :posts-num="threadData.posts_num" :page="page" />
            <RewardModal ref="RewardModalCom" @refresh-posts-list="handleFetchPostsList" />
        </template>
        <!-- 侧边栏 -->
        <Sidebar :mode="'thread'" @refresh="handleFetchPostsList(true)" @show-jump-modal="JumpModalCom!.show()" />
    </n-flex>

    <!-- 加载时候的转圈圈 -->
    <n-spin v-show="postsListLoading" size="large" class="spin" />
    <!-- 禁止访问的时候的弹出图片 -->
    <ForbiddenModal ref="ForbiddenModalCom" />
    <!-- 管理员操作的弹出modal -->
    <AdminActionModal ref="AdminActionModalCom" v-if="userStore.checkAdminForums(forumData?.id)"
        @refresh-posts-list="handleFetchPostsList" :thread-id="threadId" :forum-id="forumData?.id" />
</template>

<script setup lang="ts">
import { newPostPoster, postGetter, type newPostParams, type postData, type postParams } from '@/api/methods/posts'
import { postsListGetter, type getPostsListParams } from '@/api/methods/threads'
import { useEcho } from '@/js/echo.js'
import { useDebounce } from '@/js/func/debounce'
import getNewPostKey from '@/js/func/getNewPostKey'
import { renderIcon } from '@/js/func/renderIcon'
import { useTopbarNavControl } from '@/js/func/topbarNav'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import Pagination from '@/vue/Components/Pagination.vue'
import type { contentCommit } from '@/vue/Components/PostInput/PostInput.vue'
import PostInput from '@/vue/Components/PostInput/PostInput.vue'
import Sidebar from '@/vue/Components/Sidebar.vue'
import LoudspeakerComponent from '@/vue/Loudspeaker/LoudspeakerComponent.vue'
import JumpModal from '@/vue/Thread/JumpModal.vue'
import AdminActionModal from '@/vue/Thread/PostItem/AdminActionModal.vue'
import PostItem from '@/vue/Thread/PostItem/PostItem.vue'
import RewardModal from '@/vue/Thread/PostItem/RewardModal.vue'
import { FButton, FCheckbox, FInput } from '@custom'
import { Delete } from '@vicons/carbon'
import { ArrowDown as Down, ArrowUp as Up } from '@vicons/fa'
import { EllipsisHorizontal as Dropdown, SearchOutline as SearchIcon } from '@vicons/ionicons5'
import { useStorage } from '@vueuse/core'
import { useFetcher, useRequest, useWatcher } from 'alova'
import dayjs from 'dayjs'
import { NCard, NDropdown, NEllipsis, NFlex, NIcon, NSpin, NSwitch, NTag, NText, NTooltip, type DropdownOption } from 'naive-ui'
import { computed, defineAsyncComponent, h, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrowseLogger from './BrowseLogger.vue'
import CaptchaModal from './CaptchaModal.vue'
import ChangeColorModal from './ChangeColorModal.vue'

//异步加载组件
const VoteComponent = defineAsyncComponent(() =>
    import('./VoteComponent.vue')
)
const GambleComponent = defineAsyncComponent(() =>
    import('./GambleComponent.vue')
)
const CrowdComponent = defineAsyncComponent(() =>
    import('./CrowdComponent.vue')
)
const HongbaoComponent = defineAsyncComponent(() =>
    import('./HongbaoComponent.vue')
)



//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const route = useRoute()
const router = useRouter()
const postInputCom = ref<InstanceType<typeof PostInput> | null>(null)//输入框组件的ref
const PostItemComs = ref<InstanceType<typeof PostItem>[]>([]) //回复内容的组件，但注意这里ref不包括第0楼
const VoteComponentCom = ref<InstanceType<typeof VoteComponent> | null>(null)//输入框组件的ref
const GambleComponentCom = ref<InstanceType<typeof GambleComponent> | null>(null)//输入框组件的ref
const CrowdComponentCom = ref<InstanceType<typeof CrowdComponent> | null>(null)//输入框组件的ref
const HongbaoComponentCom = ref<InstanceType<typeof HongbaoComponent> | null>(null)//输入框组件的ref

//用teleport组件替代掉topbar的“小火锅”
useTopbarNavControl()

//异步加载组件
const ForbiddenModal = defineAsyncComponent(() =>
    import('@/vue/Components/ForbiddenModal.vue')
)

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
const CaptchaModalCom = ref<InstanceType<typeof CaptchaModal> | null>(null)
const JumpModalCom = ref<InstanceType<typeof JumpModal> | null>(null)
const ForbiddenModalCom = ref<InstanceType<typeof ForbiddenModal> | null>(null)//禁止访问的时候的弹出图片
const RewardModalCom = ref<InstanceType<typeof RewardModal> | null>(null)
const AdminActionModalCom = ref<InstanceType<typeof AdminActionModal> | null>(null)

//整体显示的开关。当遇到禁止进入等提示的时候关闭
const showThis = ref<boolean>(true)

//显示TTL用的
const nissinTTL = computed(() => {
    const nissinDate = dayjs(threadData.value.nissin_date)
    const now = dayjs()
    const hoursDiff = nissinDate.diff(now, 'hour')
    const minutesDiff = nissinDate.diff(now, 'minute') - 60 * hoursDiff
    return `${hoursDiff}小时${minutesDiff}分钟后`
})

//屏蔽选项下拉框
const noVideoMode = useStorage<boolean>('no_video_mode', false) //音频视频
const noImageMode = useStorage<boolean>('no_image_mode', false)//图片
const noEmojiMode = useStorage<boolean>('no_emoji_mode', false)//一般表情包
const noCustomEmojiMode = useStorage<boolean>('no_custom_emoji_mode', false) //自定义表情包
const noHeadMode = useStorage<boolean>('no_head_mode', false) //头像
const noBattleMode = useStorage<boolean>('no_battle_mode', false) //大乱斗
const noRollMode = useStorage<boolean>('no_roll_mode', false) //roll点
const noRewardMode = useStorage<boolean>('no_reward_mode', false) //打赏
const noHongbaoMode = useStorage<boolean>('no_hongbao_mode', false) //红包结果
const useUrlMode = useStorage<boolean>('use_url_mode', false) //自动转换超链接（实验性）

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
    // { ref: useUrlMode, label: '自动转换超链接（实验性）' },
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
            h(
                NTooltip,
                { keepAliveOnHover: false, placement: "bottom", style: { width: 'max-content' } },
                {
                    trigger: () => h(
                        FCheckbox,
                        {
                            checked: useUrlMode.value,
                            'onUpdate:checked': (value: boolean) => useUrlMode.value = value,
                            label: "自动转换超链接"
                        }
                    ),
                    default: () => "实验性功能，可能会导致回复显示出错"
                }
            )
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
const adminOptions = computed<DropdownOption[]>(() => {
    const options = [
        { label: '删除主题', key: 'deleteThread', icon: renderIcon(Delete, { size: '1.5rem' }) }
    ]
    if (threadData.value.sub_id === 0) {
        options.push({ label: '设为置顶', key: 'setTop', icon: renderIcon(Up, { size: '1.5rem' }) })
    } else {
        options.push({ label: '取消置顶', key: 'cancelTop', icon: renderIcon(Down, { size: '1.5rem' }) })
    }
    return options
})

function dropdownSelect(key: 'deleteThread' | 'setTop' | 'cancelTop') {
    AdminActionModalCom.value?.show({ action: key })
}

//侦听分页器跳转路由
const pageSelected = ref<number>(props.page)
function pageUpdate(toPage: number) {
    router.push({ name: "thread", params: { threadId: props.threadId, page: toPage }, query: { search: props.search } })
}
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
const { loading: postsListLoading, data: postsListData, onSuccess: postsListOnSuccess, onError: postsListOnError } = useWatcher(
    () => postsListGetter(postsListParams.value),
    [() => props.threadId, () => props.page, () => props.search],
    { initialData: {}, immediate: true, }
);
postsListOnSuccess(() => {
    nextTick(() => {
        //如果地址有#hash，则滚动到对应hash并高亮显示
        if (route.hash) {
            const floorTarget = document.querySelector(route.hash)
            floorTarget?.scrollIntoView({ block: "center", behavior: "auto" });
            floorTarget?.classList.add('on-focus');//高亮显示该楼层
        }
    })
})
postsListOnError((event) => {
    showThis.value = false
    ForbiddenModalCom.value?.show({ errorCode: event.error.cause.code, message: event.error.message })
})

//刷新回复列表数据
const remindFetch = ref<boolean>(false)//用来判断是否弹出提醒的
const { fetching: postsListFetching, onSuccess: fetchPostsListOnSuccess, onError: fetchPostsListOnError, fetch: fetchPostsList } = useFetcher();
function handleFetchPostsList(remind: boolean = false) {
    remindFetch.value = remind
    fetchPostsList(postsListGetter(postsListParams.value))//刷新回复列表数据
    PostItemComs.value.forEach((element: InstanceType<typeof PostItem>) => {
        element.refreshBattleData()
    });
}
fetchPostsListOnSuccess(() => { if (remindFetch.value) { window.$message.success('已刷新数据') } })
fetchPostsListOnError((event) => {
    showThis.value = false
    ForbiddenModalCom.value?.show({ errorCode: event.error.cause.code, message: event.error.message })
})

//从postsListData抽离出threadData和forumData方便使用
const postsDataRaw = computed(() => postsListData.value.posts_data.data)
const threadData = computed(() => postsListData.value.thread_data)
const forumData = computed(() => postsListData.value.forum_data)
const yourPostsList = computed(() => postsListData.value.your_post_floors)

//回复数据处理（第一种屏蔽等）
const postsData = computed(() => {
    let postsData: postData[]
    //第一种屏蔽类型：直接过滤掉整个postData元素的（大乱斗/roll点等）
    postsData = postsDataRaw.value.filter((post) => {
        if (noBattleMode.value === true && post.battle_id !== null) { return false }
        if (noRollMode.value === true && post.created_by_admin === 2 && post.nickname === 'Roll点系统') { return false }
        if (noRewardMode.value === true && post.created_by_admin === 2 && post.nickname === '奥利奥打赏系统' && !post.is_your_post) { return false }
        if (noHongbaoMode.value === true) {
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
        if (userStore.userData?.binggan.use_pingbici
            && commonStore.userCustom.hidePingbiciFloor //如果选择了“完全隐藏楼层”，则这里直接过滤回复数据
        ) {
            const regMode = commonStore.userCustom.pingbiciIngnoreCase ? "gi" : "g"
            //处理内容屏蔽词
            for (let pingbici of userStore.userData.pingbici.content_pingbici) {
                const reg = new RegExp(pingbici, regMode);
                if (reg.test(post.content)) return false
            }
            //处理FJF屏蔽词
            if (threadData.value.anti_jingfen) {
                for (let pingbici of userStore.userData.pingbici.fjf_pingbici) {
                    const reg = new RegExp(pingbici, 'g');//这里不能用regMode（一定要区分大小写）
                    if (reg.test(post.created_binggan_hash!.slice(0, 5))) return false
                }
            }
            for (let pingbici of userStore.userData.pingbici.fjf_pingbici) {
                const reg = new RegExp(pingbici, regMode);
                if (reg.test(post.nickname)) return false
            }
        }
        return true
    })
    return postsData
})

//搜索功能
const searchContentInput = ref<string | undefined>(props.search)
const showSearchInput = ref<boolean>(props.search ? true : false)
watch(searchContentInput, (searchContent) => {
    //设置防抖，searchContentInput变更超过500ms后才改变路由
    const pushRoute = useDebounce(
        () => router.push({
            name: "thread", params: { threadId: props.threadId, page: 1 },
            query: { search: searchContent || undefined }//如果是空字符串''，则返回undefined避免请求中发送一个空的searchTitle
        })
    )
    pushRoute()
})
function handleSearch() {
    router.push({
        name: "thread", params: { threadId: props.threadId, page: 1 },
        query: { search: searchContentInput.value || undefined }//如果是空字符串''，则返回undefined避免请求中发送一个空的searchTitle
    })
}
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
        if (commonStore.userCustom.hongbaoThenStop && postData.hongbao_id !== null) {
            //如果刷出来红包，并且启动了“自动涮锅遇到红包暂停”功能，则停止自动涮锅
            window.$message.info('有红包！停止涮锅！（个人中心开启了红包自动停止涮锅）')
            postListening.value = false
        }
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
let contentCommitTemp: contentCommit
let resolveTemp: (value: any) => void
function newPostHandle(content: contentCommit, resolve: (value: any) => void) {
    const { timestamp, newPostKey } = getNewPostKey(content.ist, threadData.value.id, userStore.binggan!)
    const params: newPostParams = {
        binggan: userStore.binggan!,
        forum_id: forumData.value.id,
        thread_id: threadData.value.id,
        content: content.contentInput,
        nickname: content.nicknameInput,
        post_with_admin: content.postWithAdmin,
        new_post_key: newPostKey,
        timestamp: timestamp,
    }
    sendNewPostHandle(params)
    newPostOnSuccess(() => {
        resolve('success') //来自PostInput的Promise回调，让PostInput复位
        handleFetchPostsList(false)
    })
    newPostOnError((event) => {
        if (event.error.cause.code === 244291) {
            contentCommitTemp = content
            resolveTemp = resolve
            CaptchaModalCom.value?.show()
        }
    })
}
function newPostHandleAgain() {
    newPostHandle(contentCommitTemp, resolveTemp)
}

const { loading: newPostHandling, send: sendNewPostHandle, onSuccess: newPostOnSuccess, onError: newPostOnError } = useRequest(
    (params: newPostParams) => newPostPoster(params), { immediate: false }
)


</script>

<style scoped lang="scss">
.thread-title {
    @media all and (min-width: 1200px) {
        font-size: 1.125rem;
    }

    @media not all and (min-width: 1200px) {
        font-size: 1rem;

    }
}

.thread-title-contain {
    border-radius: 10px;
}

.thread-title-skeleton {
    border-radius: 10px;
    height: 48px;
}

.spin {
    position: fixed;
    left: calc(50% - 10px);
    top: 40%;
}

.post-card-skeleton {
    border-radius: 10px;
    height: 115px;
    width: 100%;
}
</style>