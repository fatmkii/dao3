import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import dayjs from 'dayjs'

export type imgHostType = 'mjj' | 'imgbb' | 'freeimage' | 'picgo' | 'tutu' | 'imge' | 'imgtbl' | 'imgimg' | 'helloimg' | 'picui' | 'imgwang'

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
        const festivalDays = [ //TODO 各个活动节日的时间（618和双十一）
            { month: 6, date: 18 },
            { month: 11, date: 11 },
            { month: 2, date: 16 },//临时的，春节用
            { month: 2, date: 17 },//临时的，春节用
        ]
        const now = dayjs.tz() //tz()才是获得UTC+8的时间
        let isDouble11 = false

        festivalDays.forEach(festivalDay => {
            if (now.month() + 1 === festivalDay.month && now.date() === festivalDay.date) {
                // 留意month是从0开始的，所以要+1
                isDouble11 = true
            }
        });
        return isDouble11
    })

    //是否国庆节的flag
    const isOctober1st = computed<boolean>(() => {
        const festivalDays = [
            { month: 10, date: 1 }, //25年做国庆节0税率用
        ]
        const now = dayjs.tz() //tz()才是获得UTC+8的时间
        let isOctober1st = false

        festivalDays.forEach(festivalDay => {
            if (now.month() + 1 === festivalDay.month && now.date() === festivalDay.date) {
                // 留意month是从0开始的，所以要+1
                isOctober1st = true
            }
        });
        return isOctober1st
    })

    //计算是否需要小国旗的flag
    const isOctober = computed<boolean>(() => {
        const now = dayjs.tz() //tz()才是获得UTC+8的时间
        return now.month() === 9 //0是一月，9是十月
    })


    //用户的一般设定（在个人中心设置的）
    interface userCustomType {
        version: number, //版本号，方便日后做重置

        // 功能选项
        imgHost: imgHostType,//图床选择
        hongbaoThenStop: boolean, //自动涮锅时遇到红包停止
        holdPageWhenListening: boolean,//自动涮锅时页面保持不动
        lessToast: boolean,  //减少弹出提示

        // 外观选项
        postLegacyMode: boolean, //传统式回复框（相对于卡片式)
        monochromeMode: boolean, //单色模式（大喇叭和主题）
        sidebarLeft: boolean, //侧边栏放在左侧
        loudspeakerPosition: 'top' | 'center' | 'bottom', //大喇叭位置选择
        quoteMax: number,//最大引用层数
        foldMaxLine: number,//回复行数限高
        emojiWhiteBack: boolean,//表情包背景色
        // fontRemSize: 16,//字体大小
        lineHeightPost: number, //回复内容行距
        fontSizePost: number, //回复主要内容字体大小
        fontSizeQuote: number, //引用字体大小 
        fontSizeFooter: number, //楼层号的字体大小
        fontSizeThreadList: number, //主题列表的字体大小
        fontSizeThreadListFooter: number, //主题列表Footer的字体大小
        fontSizeInput: number, //回复输入框的字体大小
        threadListInnerMargin: number,//ThreadList内部的元素的margin（控制主题标题正文和Footer的margin-top）
        threadListCardPadding: number,//主题列表Card的上下左右padding
        postCardPadding: number,//postItem Card的上下左右padding
        postInnerMargin: number,//PostItem内部的元素的margin（控制回复正文和Footer的margin-top）

        // 其他选项
        hidePingbiciFloor: boolean, //完全隐藏屏蔽词楼层
        pingbiciIngnoreCase: boolean, //屏蔽词忽略大小写
    }

    const userCustom = useStorage<userCustomType>('user_custom', {
        version: 240505, //版本号，方便日后做重置
        // 功能选项
        imgHost: 'imgbb',//图床选择
        hongbaoThenStop: false, //自动涮锅时遇到红包停止
        holdPageWhenListening: false,//自动涮锅时页面保持不动
        lessToast: false,  //减少弹出提示

        // 外观选项
        postLegacyMode: false, //传统式回复框（相对于卡片式)
        monochromeMode: false, //单色模式（大喇叭和主题）
        sidebarLeft: false, //侧边栏放在左侧
        loudspeakerPosition: 'bottom' as 'top' | 'center' | 'bottom', //大喇叭位置选择
        quoteMax: 3,//最大引用层数
        foldMaxLine: 16,//回复行数限高
        emojiWhiteBack: false,//表情包背景色
        // fontRemSize: 16,//字体大小
        lineHeightPost: 28, //回复内容行距
        fontSizePost: 16, //回复主要内容字体大小
        fontSizeQuote: 16, //引用字体大小 
        fontSizeFooter: 14, //楼层号的字体大小
        fontSizeThreadList: 16, //主题列表的字体大小
        fontSizeThreadListFooter: 14, //主题列表Footer的字体大小
        fontSizeInput: 16, //回复输入框的字体大小
        threadListCardPadding: 12,//主题列表Card的上下左右padding
        threadListInnerMargin: 6,//ThreadList内部的元素的margin（控制主题标题正文和Footer的margin-top）
        postCardPadding: 12,//postItem Card的上下左右padding
        postInnerMargin: 12,//PostItem内部的元素的margin（控制回复正文和Footer的margin-top）

        // 其他选项
        hidePingbiciFloor: false, //完全隐藏屏蔽词楼层
        pingbiciIngnoreCase: false, //屏蔽词忽略大小写
    }, localStorage, { mergeDefaults: true })


    //重置userCustom
    function userCustomReset() {
        const dialogArgs = {
            title: '重置设定',
            closable: false,
            content: `确定要重置所有一般设定吗？`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => {
                //不知道为何直接赋值会失去响应性？
                userCustom.value.quoteMax = 3
                userCustom.value.foldMaxLine = 16
                userCustom.value.lineHeightPost = 28
                userCustom.value.fontSizePost = 16
                userCustom.value.fontSizeQuote = 16
                userCustom.value.fontSizeFooter = 14
                userCustom.value.fontSizeThreadList = 16
                userCustom.value.fontSizeThreadListFooter = 14
                userCustom.value.fontSizeInput = 16
                userCustom.value.threadListCardPadding = 12
                userCustom.value.threadListInnerMargin = 6
                userCustom.value.postCardPadding = 12
                userCustom.value.postInnerMargin = 12
                userCustom.value.emojiWhiteBack = false
            },
        }
        window.$dialog.warning(dialogArgs)

    }

    return { unauthModalShow, requestErrorCode, isMobile, clientWidth, showTopbarNav, bannerHeight, isDouble11, isOctober, isOctober1st, userCustom, modalMaxWidth, userCustomReset }

})

