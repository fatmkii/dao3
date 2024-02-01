<template>
    <n-flex vertical>
        <div class="carousel-box">
            <n-skeleton class="carousel-skeleton" sharp v-if="threadsDataLoading" />
            <n-carousel show-arrow trigger="hover" autoplay v-if="!threadsDataLoading" :interval="10000">
                <img :src="banner" v-for="banner in threadsListData.forum_data.banners" class="carousel-img">
            </n-carousel>
        </div>
        <ThreadList :threads-list-data="threadsListData.threads_data.data" v-if="!threadsDataLoading"></ThreadList>
        <Teleport to="#topbar-nav"><router-link to="/" v-if="!threadsDataLoading">
                >{{ threadsListData.forum_data.name }}
                <n-tag round :size="commonStore.buttonSize" class="forum-tag">{{ threadsListData.forum_data.id
                }}</n-tag>
            </router-link>
        </Teleport>
    </n-flex>
</template>

<script setup lang="ts">
import { NFlex, NTag, NCarousel, NSkeleton, } from 'naive-ui'
import { useThreadsStore } from '@/stores/threads'
import { getThreadsDataParams } from '@/api/methods/threads'
import { useUserStore } from '@/stores/user'
import { useCommonStore } from '@/stores/common'
import { useTopbarNavControl } from '@/js/func/topbarNav'
import { threadsDataGetter } from '@/api/methods/threads';
import { useRequest } from 'alova'
import ThreadList from '@/vue/Forum/ThreadList.vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()

//用teleport组件替代掉topbar的“小火锅”
useTopbarNavControl()

//组件props
interface Props {
    forum_id: number //来自路由
    page: number //来自路由
}
const props = withDefaults(defineProps<Props>(), {

})

//获取主题列表数据
const params: getThreadsDataParams = {
    forumId: props.forum_id,
    binggan: userStore.binggan!,
    page: props.page,
    threadsPerPage: 50,
    subtitlesExcluded: [],
    searchTitle: ''
}
const { loading: threadsDataLoading, data: threadsListData } = useRequest(
    threadsDataGetter(params),
    { initialData: [] }
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