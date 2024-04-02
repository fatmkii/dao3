<template>
    <n-flex vertical>
        <!-- 轮播图 -->
        <div class="carousel-box" v-if="!hideBanner">
            <div class="carousel-box" v-if="forumsStore.forumsDataLoading">
                <n-skeleton class="carousel-skeleton" sharp />
            </div>
            <n-carousel show-arrow trigger="hover" autoplay :interval="10000" v-if="!forumsStore.forumsDataLoading">
                <img :src="banner" v-for="banner in forumsStore.forumData(forumId)?.banners" class="carousel-img">
            </n-carousel>
        </div>
        <!-- 各种按钮 -->
        <n-flex style="margin-top:8px ;" size="small">
            <n-dropdown trigger="hover" :options="funcOptions" placement="bottom-start">
                <f-button>功能</f-button>
            </n-dropdown>
            <n-dropdown trigger="hover" :options="filterOptions" placement="bottom-start">
                <f-button>筛选</f-button>
            </n-dropdown>
            <n-icon :size="commonStore.isMobile ? 28 : 34">
                <SearchIcon style="cursor: pointer;" @click="showSearchInput = !showSearchInput" />
            </n-icon>
            <div style="margin-left: auto;"></div>
            <f-button type="primary" @click="$router.push({ name: 'loudspeaker' })">大喇叭</f-button>
            <f-button type="primary"
                @click="$router.push({ name: 'new-thread', params: { forumId: props.forumId } })">新主题</f-button>
        </n-flex>
        <!-- 搜索输入（弹出） -->
        <n-flex v-if="showSearchInput" :wrap="false">
            <f-input v-model:value="searchTitleInput" :maxlength="100" style="max-width: 400px;" placeholder="搜索标题"
                auto-size />
            <f-button type="primary" @click="handleSearch">搜索</f-button>
            <f-button type="default" @click="handleSearchClear">清空</f-button>
        </n-flex>
        <!-- 大喇叭 -->
        <LoudspeakerComponent />
        <!-- 主题列表 -->
        <ThreadList :threads-list-data="threadListData" :new-window-to-post="newWindowToPost"
            :show-this="!threadsDataLoading" @withdraw-delay-thread-success="handleFetchThreadsList" />

        <!-- 底部分页导航及延时主题按钮 -->
        <n-flex :align="'center'">
            <f-button :type="props.delay ? 'default' : 'primary'" @click="toggleDelayThreads">
                {{ props.delay ? '关闭延时主题' : '查看延时主题' }}
            </f-button>
            <Pagination v-model:page="pageSelected" @update:page="pageUpdate"
                :last-page="threadsDataLoading ? 1 : threadsData.threads_data.lastPage" style="margin-left: auto;" />
        </n-flex>

        <!-- 页面底部留空白 -->
        <div style="height: 50px;"></div>

        <!-- 发送到TopBar的版面标题 -->
        <Teleport to="#topbar-nav">
            <router-link to="/" class="flex-item-center">
                <n-ellipsis :style="{ maxWidth: commonStore.isMobile ? '120px' : '900px' }" :tooltip="false">
                    {{ forumsStore.forumData(forumId)?.name }}
                </n-ellipsis>
                <n-tag round class="forum-tag" :size="commonStore.isMobile ? 'small' : 'medium'">{{ forumId }}</n-tag>
            </router-link>
        </Teleport>

        <!-- 侧边栏 -->
        <Sidebar mode="forum" ref="SidebarCom" @refresh="handleFetchThreadsList(true)"
            @new-thread="$router.push({ name: 'new-thread', params: { forumId: props.forumId } })" />
    </n-flex>
</template>

<script setup lang="ts">
import { threadsListGetter, type getThreadsListParams } from '@/api/methods/forums'
import { useDebounce } from '@/js/func/debounce'
import { useStorage } from '@vueuse/core'
import { useTopbarNavControl } from '@/js/func/topbarNav'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import Pagination from '@/vue/Components/Pagination.vue'
import ThreadList from '@/vue/Forum/ThreadList.vue'
import { FButton, FCheckbox, FInput } from '@custom'
import { subtitles } from '@/data/subtitles'
import { SearchOutline as SearchIcon } from '@vicons/ionicons5'
import { useFetcher, useWatcher } from 'alova'
import { NCarousel, NCheckboxGroup, NDropdown, NFlex, NIcon, NSkeleton, NTag, NEllipsis } from 'naive-ui'
import { computed, h, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/vue/Components/Sidebar.vue'
import LoudspeakerComponent from '@/vue/Loudspeaker/LoudspeakerComponent.vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const router = useRouter()
const SidebarCom = ref<InstanceType<typeof Sidebar> | null>(null)
const LoudspeakerComponentCom = ref<InstanceType<typeof LoudspeakerComponent> | null>()

//用teleport组件替代掉topbar的“小火锅”
useTopbarNavControl()


//组件props
interface Props {
    forumId: number //来自路由
    page: number //来自路由
    search?: string,//来自路由
    delay: boolean,//来自路由
}
const props = withDefaults(defineProps<Props>(), {

})


//隐藏版头
const hideBanner = useStorage<boolean>('banner_hiden', false)

//新窗口打开(
const newWindowToPost = useStorage<boolean>('new_window_to_post', false)

//功能选项下拉框
function renderFuncOptions() {
    return h(
        NFlex,
        {
            style: 'padding:6px 8px',
            vertical: true,
        },
        () => [
            h(FCheckbox, {
                checked: hideBanner.value,
                'onUpdate:checked': (value: boolean) => hideBanner.value = value,
                label: "隐藏版头"
            }),
            h(FCheckbox, {
                checked: newWindowToPost.value,
                'onUpdate:checked': (value: boolean) => newWindowToPost.value = value,
                label: "新窗口打开"
            }),
        ]
    )
}
const funcOptions = [
    {
        type: 'group',
        key: 'header',
        label: '功能',
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

//筛选功能
const subtitlesIncluded = useStorage<(string | number)[]>('subtitles_included', subtitles)
const subtitlesExcluded = computed(() => subtitles.filter(item => !subtitlesIncluded.value!.includes(item)))

//筛选选项下拉框
function renderFilterOptions() {
    return h(
        NCheckboxGroup,
        {
            value: subtitlesIncluded.value,
            'onUpdate:value': (value: (string | number)[]) => subtitlesIncluded.value = value,
        },
        () => [
            h(NFlex,
                {
                    style: 'padding:6px 8px',
                    vertical: true,
                },
                () => [
                    Array.from(subtitles).map((subtitleItem) => {
                        return h(FCheckbox, { value: subtitleItem, label: subtitleItem })
                    }),
                ]
            )
        ]
    )
}
const filterOptions = [
    {
        type: 'group',
        key: 'header',
        label: '筛选',
    },
    {
        key: 'header-divider',
        type: 'divider'
    },
    {
        key: 'filterOptions',
        type: 'render',
        render: renderFilterOptions,
    },
]

//搜索功能
const searchTitleInput = ref<string | undefined>(props.search)
const showSearchInput = ref<boolean>(props.search ? true : false)
watch(searchTitleInput, (searchTitle) => {
    //设置防抖，searchTitleInput变更超过500ms后才改变路由
    const pushRoute = useDebounce(
        () => router.push({
            name: "forum", params: { forumId: props.forumId, page: 1 },
            query: { search: searchTitle || undefined }//如果是空字符串''，则返回undefined避免请求中发送一个空的searchTitle
        })
    )
    pushRoute()
})
function handleSearch() {
    router.push({
        name: "forum", params: { forumId: props.forumId, page: 1 },
        query: { search: searchTitleInput.value || undefined }//如果是空字符串''，则返回undefined避免请求中发送一个空的searchTitle
    })
}
function handleSearchClear() {
    searchTitleInput.value = undefined
    showSearchInput.value = false
}

//查看延时主题
function toggleDelayThreads() {
    router.push({ name: "forum", params: { forumId: props.forumId, page: 1 }, query: { delay: props.delay ? undefined : 'true' } })
}

//侦听分页器跳转路由
const pageSelected = ref<number>(props.page)
function pageUpdate(toPage: number) {
    router.push({ name: "forum", params: { forumId: props.forumId, page: toPage }, query: { search: props.search, delay: props.delay ? 'true' : undefined } })
}
watch(() => props.page,
    //其他代码router.push的时候，也需要同时变更pageSelected
    (page) => pageSelected.value = page
)

//useWathcer和useFetcher共用的主题列表数据请求参数
const threadsDataRequestParams = computed<getThreadsListParams>(() => {
    return {
        forumId: props.forumId,
        binggan: userStore.binggan!,
        page: props.page,
        threadsPerPage: 50,
        subtitlesExcluded: subtitlesExcluded.value,
        searchTitle: props.search,
        delay: props.delay
    }
})

//获取主题列表数据（监听props变更）
const { loading: threadsDataLoading, data: threadsData } = useWatcher(
    () => threadsListGetter(threadsDataRequestParams.value),
    [() => props.forumId, () => props.page, () => props.search, () => props.delay, subtitlesExcluded],
    { initialData: [], immediate: true, }
);

//刷新主题列表数据
const remindFetch = ref<boolean>(false)//用来判断是否弹出提醒的
const { fetching: threadsDataFetching, onSuccess: fetchThreadsListOnSucess, fetch: fetchThreadsList } = useFetcher();
function handleFetchThreadsList(remind: boolean = false) {
    remindFetch.value = remind
    fetchThreadsList(threadsListGetter(threadsDataRequestParams.value))
}
fetchThreadsListOnSucess(() => { if (remindFetch.value) { window.$message.success('已刷新数据') } })

//主题列表数据过滤（根据标题屏蔽词）
const threadListData = computed(() => {
    if (threadsDataLoading.value) {
        return []
    } else {
        if (!userStore.userData.binggan.use_pingbici) {
            //如果不使用屏蔽词，则直接返回数据以提升速度
            return threadsData.value.threads_data.data
        } else {
            //处理标题屏蔽词
            const regMode = commonStore.userCustom.pingbiciIngnoreCase ? "gi" : "g"
            return threadsData.value.threads_data.data.filter((threadData) => {
                for (let pingbici of userStore.userData.pingbici.title_pingbici) {
                    const reg = new RegExp(pingbici, regMode);
                    if (reg.test(threadData.title)) return false
                }
                return true
            })
        }
    }
})


</script>

<style lang="scss" scoped>
.carousel-box {
    height: v-bind('commonStore.bannerHeight');
}

.carousel-skeleton {
    height: 100%;
    width: 100%;
}

.carousel-img {
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
}
</style>