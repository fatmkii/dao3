import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'

export type imgHostType = 'mjj' | 'imgbb' | 'freeimage'

export const useCommonStore = defineStore('commonStore', () => {

    const unauthModalShow = ref<boolean>(false) //控制弹出未登录modal的
    const requestErrorCode = ref<number>(0)  //request错误代码（有时候需要组件外使用）

    //一些根据屏幕宽度的响应式变量
    const clientWidth = ref<number>(document.body.clientWidth)  //响应式的屏幕宽度
    const isMobile = ref<boolean>(document.body.clientWidth < 1200)  //根据屏幕显示尺寸确定是否手机版
    const modalMaxWidth = computed(() =>
        //计算modal最大宽度（手机版时候两侧各留16px的空位）
        clientWidth.value >= 500 + 16 + 16 ?
            '500px' :
            clientWidth.value - 32 + 'px'
    )
    window.addEventListener('resize', () => {
        isMobile.value = document.body.clientWidth < 1200
        clientWidth.value = document.body.clientWidth
    })

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

    //是否双十一的flag
    const isDouble11 = computed<boolean>(() => {
        const double11 = new Date("2023-11-11");
        const now = new Date(Date.now());
        return now.toLocaleDateString() === double11.toLocaleDateString();
    })

    //用户的一般设定（在个人中心设置的）
    interface userCustomType {
        loudspeakerPosition: 'top' | 'center' | 'bottom'
        imgHost: imgHostType
        sidebarLeft: boolean
        hongbaoThenStop: boolean
        // holdPageWhenListening: boolean
        monochromeMode: boolean
        quoteMax: number
        fontRemSize: number
        hidePingbiciFloor: boolean,
        pingbiciIngnoreCase: boolean
    }
    const userCustom = useStorage<userCustomType>('user_custom', {
        loudspeakerPosition: 'bottom',//TODO
        imgHost: 'mjj',//图床选择
        sidebarLeft: false, //TODO侧边栏放在左侧
        hongbaoThenStop: false, //TODO自动涮锅时遇到红包停止
        // holdPageWhenListening: false,//TODO自动涮锅时页面保持不动
        monochromeMode: false,//TODO单色模式
        quoteMax: 3,//TODO最大引用层数
        fontRemSize: 32,//TODO字体大小
        hidePingbiciFloor: false, //完全隐藏屏蔽词楼层
        pingbiciIngnoreCase: false, //屏蔽词忽略大小写
    }, localStorage, { mergeDefaults: true })

    return { unauthModalShow, requestErrorCode, isMobile, clientWidth, showTopbarNav, bannerHeight, isDouble11, userCustom, modalMaxWidth }

})

