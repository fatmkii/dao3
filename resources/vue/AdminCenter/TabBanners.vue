<template>
    <n-flex vertical>
        <n-card title="待追加的版头" size="small" class="dash-line" v-if="showAppendBanners">
            <template #header-extra>
                <n-flex size="small">
                    <f-button type="primary" @click="appendBannersHandle">追加</f-button>
                    <f-button type="default"
                        @click="showAppendBanners = false; appendBannersInput = undefined">关闭</f-button>
                </n-flex>
            </template>
            <n-flex size="small">
                <div class="banner-box-sm" v-for="( emojiSrc, key, index ) in appendEmojiInputArray">
                    <img :src="emojiSrc" style="width: 100%;">
                </div>
            </n-flex>
            <n-input type="textarea" v-model:value="appendBannersInput" placeholder="在这里贴网址追加版头。可以一次多个，每行一个。"
                style="border-radius: 10px; margin-top: 6px; " :autosize="{ minRows: 3, maxRows: 5 }" />
        </n-card>

        <n-card title="版头设定" size="small">
            <!-- 右上角按钮和选择 -->
            <template #header-extra>
                <n-flex size="small" :align="'center'" :wrap="true">
                    <n-text :depth="3">选择小岛</n-text>
                    <n-select v-model:value="forumIdSelected" :options="adminForumsOptions"
                        :consistent-menu-width="false" style="width: 100px" />
                    <f-button type="primary" @click="showAppendBanners = true" v-if="!showAppendBanners">追加</f-button>
                </n-flex>
            </template>
            <n-text :depth="3">点击图片移除</n-text>
            <!-- 各个版头图片 -->
            <n-flex :wrap="true" :size="[4, 4]">
                <div v-for="(bannerSrc, index) in bannersArray" :key="index + (forumIdSelected ?? 0) * 1000"
                    class="banner-box">
                    <img :src="bannerSrc" class="banner-img" @click="removeBanner(index)">
                </div>
            </n-flex>
        </n-card>
        <!-- 提交按钮和其他显示 -->
        <n-flex :align="'center'" :justify="'end'">
            <n-text :depth="3" style="font-size: 0.875rem;">各个小岛的变更要分别提交喔</n-text>
            <f-button type="primary" :loading="setBannersHandling" :disable="setBannersHandling"
                @click="setBannersHandle">提交</f-button>
        </n-flex>
    </n-flex>
</template>

<script setup lang="ts">

import { setBannersPoster, type setBannersParams } from '@/api/methods/admin'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { FButton } from '@custom'
import { useRequest } from 'alova'
import { NCard, NFlex, NInput, NSelect, NText, useThemeVars } from 'naive-ui'
import { computed, onMounted, ref, watch } from 'vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const themeVars = useThemeVars()

//输入的数据
const forumIdSelected = ref<number>(0)
onMounted(() => {
    // 页面加载时候选择一个默认的板块
    if (adminForumsOptions.value.length > 0) {
        forumIdSelected.value = adminForumsOptions.value[0].value
    }
})

//管理的板块options
const adminForumsOptions = computed<{ value: number, label: string, forumId: number }[]>(() => {
    if (userStore.binggan === null || userStore.userData.binggan.admin_forums === undefined) {
        return []
    }
    return forumsStore.forumsData.reduce((accumulator, currentItem) => {
        if (userStore.checkAdminForums(currentItem.id)) {
            accumulator.push({ value: currentItem.id, label: currentItem.name, forumId: currentItem.id })
        }
        return accumulator
    }, [] as { value: number, label: string, forumId: number }[])
})

//已选择板块的版头
const bannersArray = ref<string[]>([])
watch(forumIdSelected, (newValue) => {
    if (newValue === undefined) {
        bannersArray.value = []
    } else {
        bannersArray.value = [...forumsStore.forumData(newValue)?.banners ?? []]
    }
})

//追加版头功能
const showAppendBanners = ref<boolean>(false)
const appendBannersInput = ref<string>()
const appendEmojiInputArray = computed(() => {
    //1）换行、英文或者中文逗号都可以分割。2）并且去掉多余空行。
    return appendBannersInput.value?.split(/[\n,，]+/).filter(item => item != '') ?? []
})
function appendBannersHandle() {
    showAppendBanners.value = false
    bannersArray.value = bannersArray.value.concat(appendEmojiInputArray.value)
    appendBannersInput.value = undefined
    setBannersHandle() //追加后直接提交一次
}

//移除一个版头
function removeBanner(index: number) {
    bannersArray.value?.splice(index, 1)
}

// 提交版头变更
const { loading: setBannersHandling,
    send: setBannersPosterSend,
    onSuccess: setBannersOnSuccess } = useRequest((params: setBannersParams) => setBannersPoster(params), { immediate: false })
setBannersOnSuccess(() => {
    forumsStore.getForumsData()
})
function setBannersHandle() {
    const params: setBannersParams = {
        binggan: userStore.binggan!,
        forum_id: forumIdSelected.value,
        banners: bannersArray.value
    }
    setBannersPosterSend(params)
}



</script>

<style lang="scss" scoped>
.banner-box {
    max-width: 550px;
}

.banner-box-sm {
    max-width: 100px;
}


.banner-img {
    width: 100%;
    cursor: pointer;
    transition: opacity 0.3s;

    &:hover {
        opacity: 0.7;
    }
}

.delete-icon {
    position: relative;
    top: 10%;
    left: 10%;
}

.dash-line {
    border: 1px dashed;
    border-color: v-bind('themeVars.textColor1');
}
</style>