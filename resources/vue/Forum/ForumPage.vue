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
                <n-button :size="commonStore.buttonSize">功能</n-button>
            </n-dropdown>
            <n-dropdown trigger="hover" :options="filterOptions" placement="bottom-start">
                <n-button :size="commonStore.buttonSize">筛选</n-button>
            </n-dropdown>
            <n-icon :size="commonStore.isMobile ? 28 : 34">
                <SearchIcon style="cursor: pointer;" @click="showSearchInput = !showSearchInput" />
            </n-icon>
            <n-button :size="commonStore.buttonSize" v-bind="themeStore.buttonThemeAttr" type="primary"
                @click="handleFetchThreadsData">测试</n-button>
            <div style="margin-left: auto;"></div>
            <n-button :size="commonStore.buttonSize" v-bind="themeStore.buttonThemeAttr" type="primary">大喇叭</n-button>
            <n-button :size="commonStore.buttonSize" v-bind="themeStore.buttonThemeAttr" type="primary">新主题</n-button>
        </n-flex>
        <!-- 搜索输入（弹出） -->
        <n-flex v-if="showSearchInput" :wrap="false">
            <n-input v-model:value="searchTitleInput" :maxlength="100" style="max-width: 400px;" round
                :size="commonStore.inputSize" placeholder="搜索标题" />
            <n-button v-bind="themeStore.buttonThemeAttr" type="default" :size="commonStore.buttonSize"
                @click="handleSearchClear">清空</n-button>
        </n-flex>

        <!-- 主题列表 -->
        <ThreadList :threads-list-data="threadsDataLoading ? [] : threadsData.threads_data.data"
            :new-window-to-post="newWindowToPost" :show-this="!threadsDataLoading" />
        <!-- 分页导航 -->
        <Pagination v-model:page="pageSelected" :last-page="threadsDataLoading ? 1 : threadsData.threads_data.lastPage"
            style="margin-left: auto;" />
        <!-- 页面底部留空白 -->
        <div style="height: 50px;"></div>

        <!-- 发送到TopBar的版面标题 -->
        <Teleport to="#topbar-nav">
            <router-link to="/">
                >{{ forumsStore.forumData(forumId)?.name }}
                <n-tag round :size="commonStore.buttonSize" class="forum-tag">{{ forumId }}</n-tag>
            </router-link>
        </Teleport>
    </n-flex>
</template>

<script setup lang="ts">
import { threadsDataGetter } from '@/api/methods/threads'
import { useLocalStorageToRef } from '@/js/func/localStorageToRef'
import { useTopbarNavControl } from '@/js/func/topbarNav'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { usethemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { useDebounce } from '@/js/func/debounce'
import Pagination from '@/vue/Forum/Pagination.vue'
import ThreadList from '@/vue/Forum/ThreadList.vue'
import { FilterOutline as FilterIcon, OptionsOutline as FuncIcon, SearchOutline as SearchIcon } from '@vicons/ionicons5'
import { useWatcher, useFetcher } from 'alova'
import { NButton, NCarousel, NCheckbox, NDropdown, NFlex, NIcon, NInput, NSkeleton, NTag, NCheckboxGroup } from 'naive-ui'
import { h, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const themeStore = usethemeStore()
const router = useRouter()

//用teleport组件替代掉topbar的“小火锅”
useTopbarNavControl()


//组件props
interface Props {
    forumId: number //来自路由
    page: number //来自路由
    search?: string,//来自路由
}
const props = withDefaults(defineProps<Props>(), {

})


//隐藏版头
const hideBanner = useLocalStorageToRef<boolean>('banner_hiden', false)

//新窗口打开(
const newWindowToPost = useLocalStorageToRef<boolean>('new_window_to_post', false)

//功能选项下拉框
function renderFuncOptions() {
    return h(
        NFlex,
        {
            style: 'padding:6px 8px',
            vertical: true,
        },
        () => [
            h(NCheckbox, {
                checked: hideBanner.value,
                'onUpdate:checked': (value: boolean) => hideBanner.value = value,
                size: commonStore.checkBoxSize,
                label: "隐藏版头"
            }),
            h(NCheckbox, {
                checked: newWindowToPost.value,
                'onUpdate:checked': (value: boolean) => newWindowToPost.value = value,
                size: commonStore.checkBoxSize,
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
const subtitles = ["[公告]", "[闲聊]", "[专楼]", "[刷刷]", "[私密]"]
const subtitlesIncluded = useLocalStorageToRef<(string | number)[]>('subtitles_included', subtitles)
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
                        return h(NCheckbox, { value: subtitleItem, label: subtitleItem })
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
            name: "forum", params: { forumId: props.forumId, page: props.page },
            query: { search: searchTitle || undefined }//如果是空字符串''，则返回undefined避免请求中发送一个空的searchTitle
        })
    )
    pushRoute()
})
function handleSearchClear() {
    searchTitleInput.value = undefined
    showSearchInput.value = false

}

//侦听分页器跳转路由
const pageSelected = ref<number>(props.page)
watch(pageSelected,
    (toPage) => {
        router.push({ name: "forum", params: { forumId: props.forumId, page: toPage }, query: { search: props.search } })
    }
)

//useWathcer和useFetcher共用的主题列表数据请求参数
const threadsDataRequestParams = computed(() => {
    return {
        forumId: props.forumId,
        binggan: userStore.binggan!,
        page: props.page,
        threadsPerPage: 50,
        subtitlesExcluded: subtitlesExcluded.value,
        searchTitle: props.search
    }
})

//获取主题列表数据（监听props变更）
const { loading: threadsDataLoading, data: threadsData } = useWatcher(
    () => threadsDataGetter(threadsDataRequestParams.value),
    [() => props.forumId, () => props.page, () => props.search, subtitlesExcluded],
    { initialData: [], immediate: true, }
);

//刷新主题列表数据
const { fetching: threadsDataFetching, onSuccess: fetchThreadsDataOnSucess, fetch: fetchThreadsData } = useFetcher();
function handleFetchThreadsData() {
    fetchThreadsData(threadsDataGetter(threadsDataRequestParams.value))
}
fetchThreadsDataOnSucess(() => { window.$message.success('已刷新数据') })

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