import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCommonStore = defineStore('commonStore', () => {

    const unauthModalShow = ref<boolean>(false) //控制弹出未登录modal的
    const requestErrorCode = ref<number>(0)  //request错误代码（有时候需要组件外使用）

    //根据屏幕显示尺寸确定是否手机版
    const isMobile = ref<boolean>(document.body.clientWidth < 1200)
    const onResize = () => isMobile.value = document.body.clientWidth < 1200
    window.addEventListener('resize', onResize)

    //按钮尺寸
    const buttonSize = computed<'tiny' | 'small' | 'medium' | 'large'>(() => isMobile.value ? 'small' : 'medium')

    //是否显示topbar的“小火锅”
    const showTopbarNav = ref<boolean>(true)

    return { unauthModalShow, requestErrorCode, isMobile, buttonSize, showTopbarNav }

})

