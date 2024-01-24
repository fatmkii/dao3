import { onMounted, onUnmounted } from 'vue'
import { useCommonStore } from '@/stores/common'

//当需要用teleport组件替代掉topbar的“小火锅”时，导入此组合函数
//例如forumPage和threadPage
function useTopbarNavControl() {

    const commonStore = useCommonStore()

    onMounted(() => {
        commonStore.showTopbarNav = false//使Topbar的“小火锅”隐藏
    })
    onUnmounted(() => {
        commonStore.showTopbarNav = true//使Topbar的“小火锅”显示
    })
}

export { useTopbarNavControl }