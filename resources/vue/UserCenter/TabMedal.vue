<template>
    <n-flex vertical>
        <!-- 开关 -->

        <n-spin :show="getMedalsDataLoading">
            <n-card title="成就徽章" size="small">
                <!-- 隐藏成就的徽章（电脑版，flex布局，图片尺寸100px） -->
                <n-flex :size="[4, 0]" v-if="!(commonStore.isMobile) && medalsDataHidden.length > 0">
                    <n-flex v-for="medalData in medalsDataHidden" vertical :align="'center'" class="medal-box"
                        @click="showModal(medalData)">
                        <img :src="medalData.img" class="medal-img">
                        <n-text class="medal-text">
                            {{ medalData.name }}
                        </n-text>
                    </n-flex>
                </n-flex>
                <!-- 隐藏成就的徽章（手机版，grid布局，每行5个） -->
                <n-grid x-gap="4" :cols="5" v-if="commonStore.isMobile && medalsDataHidden.length > 0">
                    <n-gi v-for="medalData in medalsDataHidden" :align="'center'" class="medal-box-mobile"
                        @click="showModal(medalData)">
                        <img :src="medalData.img" class="medal-img-mobile">
                        <n-text class="medal-text">
                            {{ medalData.name }}
                        </n-text>
                    </n-gi>
                </n-grid>

                <!-- 一般成就的徽章（电脑版，flex布局，图片尺寸100px） -->
                <n-flex :size="[4, 0]" v-if="!commonStore.isMobile">
                    <n-flex v-for="medalData in medalsDataNormal" vertical :align="'center'" class="medal-box"
                        @click="showModal(medalData)">
                        <img :src="medalData.img" class="medal-img">
                        <n-text class="medal-text">
                            {{ medalData.name }}
                        </n-text>
                    </n-flex>
                </n-flex>
                <!-- 一般成就的徽章（手机版，grid布局，每行5个） -->
                <n-grid x-gap="4" :cols="5" v-if="commonStore.isMobile">
                    <n-gi v-for="medalData in medalsDataNormal" :align="'center'" class="medal-box-mobile"
                        @click="showModal(medalData)">
                        <img :src="medalData.img" class="medal-img-mobile">
                        <n-text class="medal-text">
                            {{ medalData.name }}
                        </n-text>
                    </n-gi>
                </n-grid>

                <!-- 开关 -->
                <template #header-extra>
                    <n-switch v-model:value="showAllMedals" />
                    <n-text style="margin-left: 6px;">显示未获得的成就 </n-text>
                </template>
            </n-card>
        </n-spin>

        <!-- 徽章进度的弹出modal -->
        <n-modal v-model:show="showMedalModal" display-directive="if">
            <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" closable @close="showMedalModal = false"
                size="small">
                <n-flex vertical :align="'center'" class="medal-box-modal">
                    <img :src="showMedalModalData?.img" style="max-width: 100%;">
                    <n-text style="font-size: 1rem;">
                        {{ showMedalModalData?.name }}
                    </n-text>
                    <n-text style="font-size: 1rem;">
                        {{ showMedalModalData?.describe }}
                    </n-text>
                    <n-spin :show="getMedalProgressLoading">
                        <template v-if="medalProgresData !== undefined || !getMedalProgressLoading">
                            <n-text style="font-size: 1rem;" v-if="medalProgresData.medal_created_at !== null">
                                {{ medalProgresData.medal_created_at }}
                            </n-text>
                            <n-text style="font-size: 1rem;"
                                v-if="medalProgresData.medal_created_at === null && medalProgresData.progress !== null">
                                {{ medalProgresData.progress }} / {{ medalProgresData.threshold }}
                            </n-text>
                        </template>
                    </n-spin>
                </n-flex>
            </n-card>
        </n-modal>

    </n-flex>
</template>

<script setup lang="ts">

import { getMedalProgressPoster, getMedalsDataPoster, type getMedalProgressParams, type getMedalsDataParams } from '@/api/methods/user'
import { medalsHidden, medalsNormal, } from '@/data/medalData'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { useRequest } from 'alova'
import { NCard, NFlex, NGi, NGrid, NModal, NSpin, NSwitch, NText } from 'naive-ui'
import { computed, ref } from 'vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const showMedalModal = ref<boolean>(false)
const showMedalModalData = ref<medalData>()

//是否显示所有成就的开关
const showAllMedals = ref<boolean>(false)

//下面css用的变量
const medalTextSize = commonStore.isMobile ? '0.70rem' : '0.875rem'


//（模板显示用的）成就数据的接口
interface medalData {
    id: number,
    hasMedal?: boolean,
    name: string,
    describe: string,
    threshold: number | null,
    img: string,
}

//一般成就的数据（非隐藏的）
const medalsDataNormal = computed<medalData[]>(() => {
    if (!medalsDataArray.value) {
        return []
    }
    const array = []
    for (const key in medalsNormal) {
        const hasMedal = medalsDataArray.value.includes(Number(key))
        if (showAllMedals.value || hasMedal) {
            array.push({
                ...medalsNormal[key],
                id: Number(key),
                hasMedal: hasMedal,
                img: hasMedal ? medalsNormal[key].img : 'https://wmimg.com/i/1547/2025/02/67adf16c41bd5.png',
            })
        }
    }
    return array
})
//隐藏成就的数据
const medalsDataHidden = computed<medalData[]>(() => {
    if (!medalsDataArray.value) {
        return []
    }
    const array = []
    for (const key in medalsHidden) {
        const hasMedal = medalsDataArray.value.includes(Number(key))
        if (hasMedal) {
            array.push({
                ...medalsHidden[key],
                id: Number(key),
                hasMedal: hasMedal,
            })
        }
    }
    return array
})

//点击成就图片弹出modal
function showModal(medalData: medalData) {
    showMedalModalData.value = medalData
    showMedalModal.value = true
    const params: getMedalProgressParams = {
        binggan: userStore.binggan!,
        medal_id: medalData.id
    }
    getMedalProgressSend(params)
}


//获得成就数据
const { loading: getMedalsDataLoading,
    data: medalsDataArray,
    send: getMedalsDataSend } = useRequest(
        (params: getMedalsDataParams) => getMedalsDataPoster(params), { immediate: false, initialData: [] }
    );
if (userStore.binggan !== null) {
    getMedalsDataSend({ binggan: userStore.binggan })
}

//查询成就进度
const { loading: getMedalProgressLoading,
    data: medalProgresData,
    send: getMedalProgressSend } = useRequest(
        (params: getMedalProgressParams) => getMedalProgressPoster(params), { immediate: false }
    );



</script>

<style lang="scss">
.medal-box {
    cursor: pointer;
    width: 100px;
}

.medal-box-modal {
    max-width: 100%;
}

.medal-img {
    width: 100px;
    height: 100px;
}

.medal-img-mobile {
    width: 100%;
    aspect-ratio: 1 / 1;
    /* 宽高比为1:1，即高度等于宽度 */
    object-fit: cover;
    /* 确保图片覆盖整个容器 */
}


.medal-text {
    font-size: v-bind(medalTextSize);
}
</style>