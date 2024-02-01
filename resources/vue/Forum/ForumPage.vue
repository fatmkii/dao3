<template>
    <div class="carousel-box">
        <div class="carousel-box" v-if="forumsStore.forumsDataLoading">
            <n-skeleton class="carousel-skeleton" sharp />
        </div>
        <n-carousel show-arrow trigger="hover" autoplay :interval="10000" v-if="!forumsStore.forumsDataLoading">
            <img :src="banner" v-for="banner in forumsStore.forumBanners(forum_id)" class="carousel-img">
        </n-carousel>
    </div>
    <n-flex vertical v-if="!threadsDataLoading">

        <n-flex justify="end" style="margin-top:8px ;">
            <Pagination v-model:page="pageSelected" :last-page="threadsListData.threads_data.lastPage" />
        </n-flex>

        <ThreadList :threads-list-data="threadsListData.threads_data.data"></ThreadList>
        <Teleport to="#topbar-nav"><router-link to="/">
                >{{ threadsListData.forum_data.name }}
                <n-tag round :size="commonStore.buttonSize" class="forum-tag">{{ threadsListData.forum_data.id
                }}</n-tag>
            </router-link>
        </Teleport>
    </n-flex>
    <n-flex vertical v-if="threadsDataLoading">

    </n-flex>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWatcher } from 'alova'
import { NFlex, NTag, NCarousel, NSkeleton } from 'naive-ui'
import { getThreadsDataParams } from '@/api/methods/threads'
import { useUserStore } from '@/stores/user'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useTopbarNavControl } from '@/js/func/topbarNav'
import { threadsDataGetter } from '@/api/methods/threads';
import ThreadList from '@/vue/Forum/ThreadList.vue'
import Pagination from '@/vue/Forum/Pagination.vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const router = useRouter()

//用teleport组件替代掉topbar的“小火锅”
useTopbarNavControl()


//组件props
interface Props {
    forum_id: number //来自路由
    page: number //来自路由
}
const props = withDefaults(defineProps<Props>(), {

})


//侦听分页器跳转路由
const pageSelected = ref<number>(props.page)
watch(pageSelected,
    (toPage) => {
        router.push({ name: "forum", params: { forum_id: props.forum_id, page: toPage } })
    }
)

//获取主题列表数据
const { loading: threadsDataLoading, data: threadsListData } = useWatcher(
    () => threadsDataGetter({
        forumId: props.forum_id,
        binggan: userStore.binggan!,
        page: props.page,
        threadsPerPage: 50,
        subtitlesExcluded: [],
        searchTitle: ''
    }),
    [pageSelected],
    { initialData: [], immediate: true }
);

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
    border-radius: 8px;
    object-fit: cover;
}
</style>