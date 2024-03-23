<template>
    <n-flex vertical :size="[0, 16]" class="sidebar" :align="'center'">
        <!-- 到顶部 -->
        <Transition name="slide-fade">
            <n-icon v-if="showButtons" :size="buttonSize + 2" class="icon" @click="scrollHandle('up')"
                :color="themeStore.themeColor.sidebarColor">
                <Up />
            </n-icon>
        </Transition>
        <!-- 新主题 -->
        <Transition name="slide-fade">
            <n-icon v-if="showButtons && mode == 'forum'" :size="buttonSize" class="icon" @click="emit('newThread')"
                :color="themeStore.themeColor.sidebarColor">
                <svg viewBox="0 0 16 16">
                    <path
                        d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                </svg>
            </n-icon>
        </Transition>
        <!-- 刷新 -->
        <Transition name="slide-fade">
            <n-icon v-if="showButtons" :size="buttonSize" class="icon" @click="emit('refresh')"
                :color="themeStore.themeColor.sidebarColor">
                <svg viewBox="0 0 512 512">
                    <path
                        d="M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z">
                    </path>
                </svg>
            </n-icon>
        </Transition>
        <!-- 跳楼机 -->
        <Transition name="slide-fade">
            <n-icon v-if="showButtons && mode == 'thread'" :size="buttonSize" class="icon"
                :color="themeStore.themeColor.sidebarColor" @click="emit('showJumpModal')">
                <Forward />
            </n-icon>
        </Transition>
        <!-- 到底部 -->
        <Transition name="slide-fade">
            <n-icon v-if="showButtons" :size="buttonSize + 2" class="icon" @click="scrollHandle('down')"
                :color="themeStore.themeColor.sidebarColor">
                <Down />
            </n-icon>
        </Transition>
        <n-icon :size="buttonSize" class="icon" @click="showButtons = !showButtons" style="margin-top: 6px;"
            :color="themeStore.themeColor.sidebarColor">
            <Layer />
        </n-icon>
    </n-flex>
</template>

<script lang="ts" setup>
import { NFlex, NIcon, useThemeVars } from 'naive-ui'
import { LayerGroup as Layer, ArrowUp as Up, ArrowDown as Down, Forward as Forward } from '@vicons/fa'
import { ChatbubbleEllipses as NewThread } from '@vicons/ionicons5'
import { usethemeStore } from '@/stores/theme'
import { useDrag } from 'vue3-dnd'
import { toRefs } from '@vueuse/core'
import { computed, ref } from 'vue'

//基础数据
const themeStore = usethemeStore()
const themeVars = useThemeVars()
const showButtons = ref<boolean>(false)//显示按钮
const buttonSize = ref<number>(24)

//组件props
interface Props {
    mode: 'thread' | 'forum'
}
const props = withDefaults(defineProps<Props>(), {
})

//定义事件
const emit = defineEmits<{
    refresh: [],
    showJumpModal: [],
    newThread: [],
}>()

function scrollHandle(to: 'up' | 'down') {
    if (to === 'up') { window.scrollTo(0, 0) }
    if (to === 'down') { window.scrollTo(0, document.body.scrollHeight) }
}

</script>

<style lang="scss" scoped>
.sidebar {
    color: v-bind('themeVars.primaryColor');
    position: fixed;
    z-index: 9;
    bottom: 40%;

    //电脑屏幕大于1200px时，不要走到最右边
    @media all and (min-width: 1240px) {
        right: calc(50% - 600px);
    }

    @media not all and (min-width: 1240px) {
        right: 16px;
    }

    .icon {
        cursor: pointer;
    }
}


.slide-fade-enter-active {
    transition: all 0.3s ease;
}

.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
}
</style>