
<template>
    <n-flex justify="center" vertical>
        <n-skeleton class="carousel-img" :sharp="false" v-if="homeBannersLoading" />
        <n-carousel show-arrow trigger="hover" autoplay v-if="!homeBannersLoading">
            <img :src="banner" v-for="banner in homeBannersDataSorted" class="carousel-img">
        </n-carousel>
        <n-card title="小火锅公告" size="small">
            <div>这里个人论坛“小火锅”，欢迎来玩~</div>
            <div>QQ小火锅避难群：<n-text type="info">156840110</n-text></div>
            <div>目前小火锅有5个网址：<n-text type="info">cpttmm.com, www.cpttmm.com, cpttmm.love, www.cpttmm.love,
                    v2.cpttmm.com</n-text>(v2尽量不要用)</div>
            <div><n-text>请务必遵守<router-link :to="'/thread/13351'"
                        style="text-decoration: underline;">小火锅版规</router-link>喔！</n-text></div>
        </n-card>

    </n-flex>
</template>

<script setup lang="ts">
import { NFlex, NCarousel, NSkeleton, NCard, NText } from 'naive-ui'
import { useRequest } from 'alova'
import { homeBannersGetter } from '@/api/methods/globalSetting'
import { useForumsStore } from '@/stores/forums'
import { computed } from 'vue';

//各版数据的store
const forumsStore = useForumsStore()

//主页banner数据
const { loading: homeBannersLoading, data: homeBannersData } = useRequest(homeBannersGetter)
const homeBannersDataSorted = computed(() => homeBannersData.value.sort(() => 0.5 - Math.random()))


</script>

<style scoped>
.carousel-img {
    width: 100%;
    max-height: 240px;
    object-fit: cover;
}
</style>