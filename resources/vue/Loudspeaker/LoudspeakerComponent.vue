<template>
    <n-flex :wrap="false" style="margin-top: 8px;">
        <!-- 题图 -->
        <img style="height: 2.5rem;cursor: pointer;" src="https://oss.cpttmm.com/xhg_other/miku_loudspeaker.png"
            @click="LoudspeakerModalCom?.show()" />
        <!-- 提示 -->
        <n-spin v-if="loudspeakerDataLoading" size="small" />
        <div v-if="noData">
            <router-link to="/loudspeaker">
                目前没有大喇叭，要发一个吗？
            </router-link>
        </div>
        <div v-if="!noData" class="loudspeaker-container">
            <n-flex vertical :size="[0, 4]" class="loudspeaker-content">
                <!-- 大喇叭本体 -->
                <component v-for="(loudspeaker, index) in loudspeakerData" :key="index"
                    :is="loudspeaker.thread_id ? 'router-link' : 'span'"
                    :style="{ color: commonStore.userCustom.monochromeMode ? themeVars.textColor1 : loudspeaker.color }"
                    :to="loudspeaker.thread_id !== null ? `/thread/${loudspeaker.thread_id}/1` : undefined">
                    {{ loudspeaker.content }}
                </component>
                <!-- 多复制一份 -->
                <component v-for="(loudspeaker, index) in loudspeakerData" :key="index + loudspeakerData.length"
                    :is="loudspeaker.thread_id ? 'router-link' : 'span'"
                    :style="{ color: commonStore.userCustom.monochromeMode ? themeVars.textColor1 : loudspeaker.color }"
                    :to="loudspeaker.thread_id !== null ? `/thread/${loudspeaker.thread_id}/1` : undefined">
                    {{ loudspeaker.content }}
                </component>
            </n-flex>
        </div>
        <!-- 显示全部大喇叭的modal -->
        <LoudspeakerModal :loudspeaker-data="loudspeakerData" ref="LoudspeakerModalCom" />
    </n-flex>
</template>

<script setup lang="ts">

import { loudspeakerDataGetter, type loudspeakerDataParams } from '@/api/methods/user'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { useRequest } from 'alova'
import { NFlex, NSpin, useThemeVars } from 'naive-ui'
import { computed, nextTick, onUnmounted, ref } from 'vue'
import LoudspeakerModal from './LoudspeakerModal.vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const LoudspeakerModalCom = ref<InstanceType<typeof LoudspeakerModal> | null>()
const themeVars = useThemeVars()

//获取大喇叭数据
const noData = computed<boolean>(() => !loudspeakerDataLoading && loudspeakerData.value.length === 0)
const params: loudspeakerDataParams = {
    binggan: userStore.binggan!,
    mode: 'effective'
}
const { loading: loudspeakerDataLoading,
    data: loudspeakerData,
    send: loudspeakerDataSend,
    onSuccess: loudspeakerDataOnSuccess } = useRequest(
        (params: loudspeakerDataParams) => loudspeakerDataGetter(params), { immediate: false, initialData: [] }
    );
if (userStore.binggan) {
    loudspeakerDataSend(params)
}
loudspeakerDataOnSuccess(() => {
    nextTick(() => {
        setTimeout(() => addKeyFrames(), 1000)
    })
})

//追加动画效果
function addKeyFrames() {
    //因为loudspeaker_content的高度会根据内容改变，所以要动态调整keyframe的移动速度和高度
    const container = document.getElementsByClassName("loudspeaker-content")[0] as HTMLDivElement
    const containerHeight = container.offsetHeight

    const style = document.createElement('style')
    style.id = "loudspeaker-keyframe"
    const keyFrames =
        `@keyframes loudspeaker-move {
                /* 原理 height值的变化 移动一个容器的高度 */
                from {
                    top: 0;
                }
                to {
                    top: -DOM_HEIGHTpx;
                }
            }
            @-webkit-keyframes loudspeaker-move {
                /* 原理 height值的变化 移动一个容器的高度 */
                from {
                    top: 0;
                }
                to {
                    top: -DOM_HEIGHTpx;
                }
            }

            .loudspeaker-content {
                animation: SPEEDs loudspeaker-move infinite linear;
                -webkit-animation: SPEEDs loudspeaker-move infinite linear;
            }`
    style.innerHTML = keyFrames
        .replace(/DOM_HEIGHT/g, String(Math.floor(containerHeight / 2)))
        .replace(/SPEED/g, String(Math.floor(containerHeight / 20)))
    document.getElementsByTagName('head')[0].appendChild(style)
}

//避免重复追加多个style
onUnmounted(() => {
    document.getElementById("loudspeaker-keyframe")?.remove()
})

</script>

<style lang="scss">
.loudspeaker-container {
    height: 2.5rem;
    overflow-y: hidden;
    position: relative;
    width: 100%;

    .loudspeaker-content {
        position: absolute;
        top: 0;
        left: 0;

        :hover .loudspeaker-content {
            animation-play-state: paused;
            -webkit-animation-play-state: paused;
        }
    }
}

.loudspeaker-container:hover .loudspeaker-content {
    animation-play-state: paused;
    -webkit-animation-play-state: paused;
}
</style>