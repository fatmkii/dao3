import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCommonStore = defineStore('commonStore', () => {

    const unauthModalShow = ref<boolean>(false) //控制弹出未登录modal的
    const requestErrorCode = ref<number>(0)  //request错误代码（有时候需要组件外使用）

    //根据屏幕显示尺寸确定是否手机版
    const isMobile = ref<boolean>(document.body.clientWidth < 1200)
    const checkMobile = () => isMobile.value = document.body.clientWidth < 1200
    window.addEventListener('resize', checkMobile)

    //按钮尺寸
    const buttonSize = computed<'tiny' | 'small' | 'medium' | 'large'>(() => isMobile.value ? 'small' : 'medium')

    //分页导航尺寸
    const paginateSize = computed<'small' | 'medium' | 'large'>(() => isMobile.value ? 'small' : 'medium')


    //是否显示topbar的“小火锅”
    const showTopbarNav = ref<boolean>(true)

    //版头高度计算
    function getBannerHeight() {
        const rootContainer = document.getElementById('app');
        const rootContainerWidth = rootContainer!.offsetWidth - 24;//24是两边的padding
        return Math.ceil(rootContainerWidth * 250 / 920) + 'px'//小火锅版头尺寸是920*250
    }
    const bannerHeight = ref(getBannerHeight())
    window.addEventListener('resize', () => bannerHeight.value = getBannerHeight())


    return { unauthModalShow, requestErrorCode, isMobile, buttonSize, showTopbarNav, bannerHeight, paginateSize }

})

