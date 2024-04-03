<template>
    <n-alert type="success" closable v-if="showThis && !isSearch" style="border-radius: 10px;">
        你上次已经浏览到{{ browseLogger.get(threadId)!.floor }}楼，
        <router-link @click="showThis = false"
            :to="{ name: 'thread', params: { threadId: threadId, page: Math.ceil((browseLogger.get(threadId)!.floor + 1) / 200) } }">
            点击这里
        </router-link>
        跳转
    </n-alert>
</template>

<script setup lang="ts">
import { nextTick, h, onMounted, ref, watch } from 'vue'
import { NAlert } from 'naive-ui'
import { useDebounce } from '@/js/func/debounce'
import { useRoute } from 'vue-router';
import { useBrowseLogger } from '@/js/func/browseLogger'

//组件props
interface Props {
    postsListLoading: boolean,
    disableScroll: boolean,
    isSearch: boolean,
    threadId: number
    page: number
}
const props = withDefaults(defineProps<Props>(), {
    disableScroll: false,
})

//基础数据
const showThis = ref<boolean>(false)
const route = useRoute()

//记录浏览进度的功能
const browseLogger = useBrowseLogger({}) //用于记录浏览进度的类
browseLogger.initThread(props.threadId)
function scrollWatch() { //监控并记录浏览激怒的
    function getFloorDom() {//获取当前屏幕中心的元素
        const X = window.innerWidth / 2
        const Y = 100
        const ele = document.elementsFromPoint(X, Y)
        return ele
    }
    const watcher = useDebounce(
        () => {
            const elementsInPoint = getFloorDom()
            const threadBrowseLog = browseLogger.get(props.threadId)!
            elementsInPoint.forEach(ele => {
                const floorNum = Number(ele.getAttribute('floor'))
                if (floorNum && floorNum > threadBrowseLog.floor) {
                    browseLogger.log(props.threadId, floorNum)
                }
            })
        }, 100
    )
    watcher()
}
function scrollToLastTime() {
    if (!route.hash) {//如果有to_hash，则停止使用上次阅读进度的滚动
        if (browseLogger.get(props.threadId)) {
            const threadBrowseLog = browseLogger.get(props.threadId)!
            const pageLastTime = Math.ceil((threadBrowseLog.floor + 1) / 200)
            if (pageLastTime === props.page) {
                //如果在上次浏览就在当前页，则滚动到对应的楼层
                const elementTarget = document.getElementById('f_' + threadBrowseLog.floor)
                if (elementTarget !== null) {
                    elementTarget.scrollIntoView({ behavior: "auto", block: "center" })
                    window.$message.success(`已自动滚到上次浏览进度${threadBrowseLog.floor}楼`)
                }
            }
            if (pageLastTime > props.page) {
                showThis.value = true
            }
        }
    }
}
watch(() => props.postsListLoading, (newValue) => {
    if (newValue === false && !props.disableScroll) {
        nextTick(() => scrollToLastTime())
    }
})

onMounted(() => {
    window.addEventListener("scroll", scrollWatch)
})

</script>