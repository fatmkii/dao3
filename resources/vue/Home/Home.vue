<template>
    <n-flex justify="center" vertical>
        <!-- 版头图片 -->
        <div class="carousel-box" v-if="!hideBanner">
            <n-skeleton class="carousel-skeleton" sharp v-if="homeBannersLoading" />
            <n-carousel show-arrow :trigger="commonStore.isMobile ? 'click' : 'hover'" autoplay v-if="!homeBannersLoading" :interval="10000">
                <img :src="banner" v-for="banner in homeBannersDataSorted" class="carousel-img">
            </n-carousel>
        </div>
        <!-- 公告栏 -->
        <n-card title="小火锅公告" size="small">
            <div>这里个人论坛“小火锅”，欢迎来玩~</div>
            <div>QQ小火锅避难群：<n-text type="info">156840110</n-text></div>
            <div>目前小火锅有5个网址：<n-text type="info">cpttmm.com, www.cpttmm.com, cpttmm.love, www.cpttmm.love,
                    v2.cpttmm.com</n-text>(v2尽量不要用)</div>
            <div><n-text>请务必遵守<router-link :to="'/thread/13351'"
                        style="text-decoration: underline;">小火锅版规</router-link>喔！</n-text></div>
        </n-card>
        <!-- 板块列表 -->
        <n-flex justify="center" vertical :size="1">
            <n-card v-for="forumData in forumsDataSorted" size="small" :bordered="true" :key="forumData.id"
                class="forum-cards" :header-style="forumCardsHeaderStyle" :content-style="forumCardsContentStyle"
                hoverable @click="forumClick(forumData.id, $event)">
                <template #header><n-flex>
                        <ForumsStar :is-favorite="forumFavorites.includes(forumData.id)" :forum-id="forumData.id"
                            @favorite-add="favoriteAdd" @favorite-cancel="favoriteCancel" />
                        {{ forumData.name }}
                    </n-flex>
                </template>
                <n-text>{{ forumData.description }}</n-text>
                <template #header-extra> <n-tag round>{{ forumData.id }}</n-tag> </template>
            </n-card>
        </n-flex>
    </n-flex>
</template>

<script setup lang="ts">
import { homeBannersGetter } from '@/api/methods/globalSetting';
import { useCommonStore } from '@/stores/common';
import { useForumsStore } from '@/stores/forums';
import ForumsStar from '@/vue/Home/ForumsStar.vue';
import { useStorage } from '@vueuse/core';
import { useRequest } from 'alova';
import { NCard, NCarousel, NFlex, NSkeleton, NTag, NText, useThemeVars } from 'naive-ui';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


//基础数据
const forumsStore = useForumsStore()//各版数据的store
const themeVars = useThemeVars()
const commonStore = useCommonStore()
const router = useRouter()

//主页banner数据
const { loading: homeBannersLoading, data: homeBannersData } = useRequest(homeBannersGetter)
const homeBannersDataSorted = computed(() => homeBannersData.value.sort(() => 0.5 - Math.random()))

//设置浏览器标题
document.title = '小火锅'

//隐藏版头
const hideBanner = useStorage<boolean>('banner_hiden', false)


//外观调整
const forumCardsHeaderStyle = computed(() => {
    return {
        paddingBottom: commonStore.isMobile ? '6px' : '',
        paddingTop: commonStore.isMobile ? '6px' : ''
    }
})
const forumCardsContentStyle = computed(() => {
    return {
        paddingBottom: commonStore.isMobile ? '6px' : '',
    }
})

//收藏板块功能
const forumFavorites = ref<number[]>([]);
onMounted(() => {
    if (localStorage.forums_favorites === undefined) {
        localStorage.forums_favorites = JSON.stringify([]);
    } else {
        forumFavorites.value = JSON.parse(localStorage.forums_favorites);
    }
})
const forumsDataSorted = computed(() => {
    const favorite = forumsStore.forumsData.filter((forumData) => forumFavorites.value.includes(forumData.id))
    const unfavorite = forumsStore.forumsData.filter((forumData) => !forumFavorites.value.includes(forumData.id))
    const result = favorite.concat(unfavorite)
    return result
})
function favoriteAdd(forumId: number) {
    if (!forumFavorites.value.includes(forumId)) {
        forumFavorites.value.push(forumId);
        localStorage.forums_favorites = JSON.stringify(forumFavorites.value);
    }
}
function favoriteCancel(forumId: number) {
    const index = forumFavorites.value.indexOf(forumId);
    if (index != -1) {
        forumFavorites.value.splice(index, 1);
        localStorage.forums_favorites = JSON.stringify(forumFavorites.value);
    }
}

//调整板块
function forumClick(forumId: number, event: PointerEvent) {
    const eventTarget = event.target as Element //因为ts认为eventTarget不是element类型，但实际上点击事件必然发生在dom上，所以这里as element
    if (["path", "svg"].includes(eventTarget.nodeName)) {
        return; //选中收藏星星就取消进入板块的动作
    } else {
        router.push({ name: "forum", params: { forumId: forumId } })
    }
}


</script>

<style lang="scss" scoped>
.forum-cards {
    cursor: pointer;

    &:hover {
        background-color: v-bind('themeVars.hoverColor');
    }
}

// .carousel-box {
//     height: v-bind('commonStore.bannerHeight');
// }

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