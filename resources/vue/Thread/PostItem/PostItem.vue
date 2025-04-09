<template>
    <!-- 回复card -->
    <component :is="commonStore.userCustom.postLegacyMode ? 'div' : NCard"
        :class="{ card: !commonStore.userCustom.postLegacyMode }" class="post-item" :id="'f_' + postData.floor"
        :floor="postData.floor" :style="postItemStyle" :content-style="postItemCardStyle">
        <!-- header -->
        <n-flex size="small" :style="postHeaderStyle">
            <!-- 左边是头像和折叠提示 -->
            <div class="random-head-container" v-if="!noHeadMode">
                <img :src="randomHeadsData[randomHeadGroupIndex - 1].random_heads[postData.random_head]"
                    :class="'head_' + postData.random_head" />
            </div>
            <n-button text v-if="postFoldedMessage !== undefined" @click="postIsFolded = !postIsFolded">
                {{ postFoldedMessage }}
            </n-button>
            <!-- 右边是删除按钮和下拉菜单（预览模式时无需加载） -->
            <template v-if="!previewMode">
                <div style="margin-left: auto;"></div>
                <!-- 删除按钮 -->
                <n-icon :size="24" v-if="postData.is_your_post && postData.is_deleted === 0" style="cursor: pointer;"
                    @click="deletePostHandle">
                    <Delete />
                </n-icon>
                <!-- 恢复按钮 -->
                <n-icon :size="24" v-if="postData.is_your_post && postData.is_deleted === 1" style="cursor: pointer;"
                    @click="recoverPostHandle">
                    <Recover />
                </n-icon>
                <!-- 打赏按钮 -->
                <n-icon :size="24" v-if="!postData.is_your_post" style="cursor: pointer;" @click="rewardHandle">
                    <Gift />
                </n-icon>
                <!-- 回复按钮 -->
                <n-icon :size="24" style="cursor: pointer;" @click="quoteClick">
                    <Quote />
                </n-icon>
                <!-- 下拉菜单，这里做了延后加载 -->
                <n-icon v-if="!renderDropdown && userStore.checkAdminForums(props.forumId)" :size="24"
                    style="cursor: pointer;" @click="renderDropdown = true">
                    <Dropdown />
                </n-icon>
                <n-dropdown v-if="renderDropdown && userStore.checkAdminForums(props.forumId)" trigger="click"
                    :options="funcOptions" @select="dropdownSelect" :show="renderDropdown"
                    :size="commonStore.isMobile ? 'medium' : 'large'" @clickoutside="renderDropdown = false">
                    <n-icon :size="24" style="cursor: pointer;">
                        <Dropdown />
                    </n-icon>
                </n-dropdown>
            </template>
            <template v-else>
                <div style="margin-left: auto;"></div>
                <!-- 打赏按钮 -->
                <n-icon :size="24" style="cursor: pointer;">
                    <Gift />
                </n-icon>
                <!-- 回复按钮 -->
                <n-icon :size="24" style="cursor: pointer;">
                    <Quote />
                </n-icon>
            </template>
        </n-flex>

        <!-- 隐藏时候需要被折叠的内容 -->
        <template v-if="!postIsFolded">
            <!-- 正文内容 -->
            <div class="post-content" ref="postContentContainerDom" :style="postContentContainerStyle">
                <span v-html="postContent" class="post-span" ref="postContentDom" :style="postContentStyle"></span>
            </div>

            <!-- 红包组件 -->
            <HongbaoPost v-if="postData.hongbao_data !== null" :hongbao-data="postData.hongbao_data" :forum-id="forumId"
                :thread-id="postData.thread_id" @refresh-posts-list="emit('refreshPostsList')" />
            <!-- 大乱斗组件 -->
            <Battle v-if="postData.battle_id !== null" :battle-id="postData.battle_id" ref="BattleCom" />

            <!-- 正文下面的footer，楼号等 -->
            <n-flex :size="[4, 0]" class="post-footer" :style="postFooterStyle"
                :class="{ 'system-post': postData.created_by_admin === 2, 'admin-post': postData.created_by_admin === 1 }">

                <span :depth="3" class="post-footer-text" @click="quoteClick" style="cursor: pointer;">
                    {{ '№' + postData.floor }}
                </span>
                <span class="post-nick-name" @click="quoteClick" style="cursor: pointer;">
                    {{ postData.nickname }} {{ commonStore.isOctober ? "🇨🇳" : "" }}
                </span>
                <span class="post-created-at">{{ postData.created_at }}</span>
                <span v-if="antiJingfen" class="post-anti-jingfen">
                    →{{ postData.created_binggan_hash?.slice(0, 5) }}
                </span>
                <span v-if="superAdminMode">
                    {{ postData.created_binggan }}
                </span>
                <f-button v-if="isHeightLimited" size="tiny" @click="unfoldContent">展开限高</f-button>
            </n-flex>
        </template>
    </component>
</template>

<script setup lang="ts">
import type { deletePostParams, postData, recoverPostParams } from '@/api/methods/posts'
import { deletePostDeleter, recoverPostPutter } from '@/api/methods/posts'
import { myEmojisAddPoster, type myEmojisAddParams } from '@/api/methods/user'
import randomHeadsData from '@/data/randomHeads'
import { renderIcon } from '@/js/func/renderIcon'
import showDialog from '@/js/func/showDialog'
import { useCommonStore } from '@/stores/common'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { FButton } from '@/vue/Custom'
import type { rewardModalPayload } from '@/vue/Thread/PostItem/RewardModal.vue'
import { Delete } from '@vicons/carbon'
import { Question as Hint } from '@vicons/fa'
import { LockClosed12Regular as Lock } from '@vicons/fluent'
import { CardGiftcardFilled as Gift } from '@vicons/material'
import { Ban, EllipsisHorizontal as Dropdown, ChatbubbleEllipsesOutline as Quote, ReloadOutline as Recover } from '@vicons/ionicons5'
import type { MessageRenderMessage } from 'naive-ui'
import { NAlert, NButton, NCard, NDropdown, NFlex, NIcon, type DropdownOption } from 'naive-ui'
import { computed, h, onMounted, ref } from 'vue'
import Battle from './Battle.vue'
import HongbaoPost from './HongbaoPost.vue'

//延后加载Dropdown，提高显示速度（200个PostItem大约能改善120ms）
const renderDropdown = ref<boolean>(false)

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const themeStore = useThemeStore()
const postContentDom = ref<HTMLSpanElement | null>(null)//回复内容组件的ref
const postContentContainerDom = ref<HTMLSpanElement | null>(null)//回复内容的外层包裹容器的ref
const BattleCom = ref<InstanceType<typeof Battle> | null>(null)

//组件props
interface Props {
    forumId: number,
    postData: postData,
    yourPostsList?: number[],
    randomHeadGroupIndex?: number,
    antiJingfen?: boolean,
    noImageMode?: boolean,
    noEmojiMode?: boolean,
    noCustomEmojiMode?: boolean,
    noHeadMode?: boolean,
    noVideoMode?: boolean,
    noMentionMode?: boolean,
    useUrlMode?: boolean,
    previewMode?: boolean,
    superAdminMode?: boolean,
    adminMode?: boolean,
}
const props = withDefaults(defineProps<Props>(), {
    yourPostsList: () => [],
    randomHeadGroupIndex: 1,
    antiJingfen: false,
    noImageMode: false,
    noEmojiMode: false,
    noCustomEmojiMode: false,
    noHeadMode: false,
    noVideoMode: false,
    noMentionMode: false,
    useUrlMode: false,
    previewMode: false,
    superAdminMode: false,
    adminMode: false,
})

//回复框本体的style(传统模式时)
const postItemStyle = computed(() =>
    commonStore.userCustom.postLegacyMode ?
        {
            paddingTop: '6px',
            paddingBottom: '6px',
            borderBottom: '1px solid',
            borderColor: themeStore.themeColor.postItemBorderColor,
        } : undefined
)

//回复框本体的style(Card模式时)
const postItemCardStyle = computed(() =>
    !commonStore.userCustom.postLegacyMode ?
        {
            padding: commonStore.userCustom.postCardPadding + 'px'
        } : undefined
)

//回复header的style（主要是右侧padding配置）
const postHeaderStyle = computed(() => {
    // 这是给侧边栏的padding,避免阻挡文字内容。
    let paddingRight = 0
    if (commonStore.isMobile && !commonStore.userCustom.sidebarLeft) { //电脑版和侧边栏在左侧时候不需要padding
        //传统模式要比卡片模式要多padding一些
        paddingRight = commonStore.userCustom.postLegacyMode ? 20 : 20 - commonStore.userCustom.postCardPadding
    }
    return {
        paddingRight: paddingRight + 'px',
    }
})


//回复内容的style，用来折叠高度、自定义式样等
const postContentContainerStyle = computed(() => {
    // 这是给侧边栏的padding,避免阻挡文字内容。
    let paddingLeft = 0
    let paddingRight = 0
    if (commonStore.isMobile) { //电脑版不需要padding
        if (commonStore.userCustom.sidebarLeft) {
            //传统模式要比卡片模式要多padding一些
            paddingLeft = commonStore.userCustom.postLegacyMode ? 20 : 20 - commonStore.userCustom.postCardPadding
        } else {
            paddingRight = commonStore.userCustom.postLegacyMode ? 20 : 20 - commonStore.userCustom.postCardPadding
        }
    }
    return {
        maxHeight: postContentContainerMaxHeight.value === undefined ? undefined : postContentContainerMaxHeight.value + 'px',
        marginTop: commonStore.userCustom.postInnerMargin + 'px',
        lineHeight: commonStore.userCustom.lineHeightPost + 'px',
        paddingLeft: paddingLeft + 'px',
        paddingRight: paddingRight + 'px',
    }
})
const postContentStyle = computed(() => ({
    top: postContentTopOffset.value === undefined ? undefined : postContentTopOffset.value + 'px',
    fontSize: commonStore.userCustom.fontSizePost + 'px'
}))

//回复Footer的style，用来自定义式样
const postFooterStyle = computed(() => ({
    marginTop: commonStore.userCustom.postInnerMargin + 'px',
    fontSize: commonStore.userCustom.fontSizeFooter + 'px',
    lineHeight: commonStore.userCustom.fontSizeFooter + 'px',
}))

//注册事件
const emit = defineEmits<{
    showRewardModal: [payload: rewardModalPayload],
    quoteClick: [content: string],
    refreshPostsList: [],
    adminHandle: [{ action: 'hint' | 'ban' | 'lock' | 'deleteAll' | 'delete' | 'recovery', postId: number }],
}>()

//管理员选项的下拉菜单
const funcOptions = computed(() => {
    const options: DropdownOption[] = [
        { label: '提示', key: 'hint', icon: renderIcon(Hint, { size: '1.5rem' }) },
        { label: '碎饼', key: 'ban', icon: renderIcon(Ban, { size: '1.5rem' }) },
        { label: '封禁', key: 'lock', icon: renderIcon(Lock, { size: '1.5rem' }) },
        { label: '删全', key: 'deleteAll', icon: renderIcon(Delete, { size: '1.5rem' }) },
    ]
    if (props.postData.is_deleted === 0) {
        options.push({ label: '删帖', key: 'delete', icon: renderIcon(Delete, { size: '1.5rem' }) })
    } else {
        options.push({ label: '恢复', key: 'recovery', icon: renderIcon(Recover, { size: '1.5rem' }) })
    }
    return options
})

//打赏功能
function rewardHandle() {
    emit('showRewardModal', {
        floor: props.postData.floor,
        forumId: props.forumId,
        threadId: props.postData.thread_id,
        postId: props.postData.id,
        postFloorMessage: postFooterText.value,
    })
}

//用户删除回复的功能
function deletePostHandle() {
    function handle() {
        const params: deletePostParams = {
            binggan: userStore.binggan!,
            thread_id: props.postData.thread_id,
            post_id: props.postData.id,
        }
        deletePostDeleter(params).then(() => emit('refreshPostsList'))
    }
    showDialog({
        title: "要删除这个回复吗？",
        content: "会消费300olo喔",
        onPositiveClick: () => {
            if (props.postData.hongbao_id !== null) {
                showDialog({
                    title: "注意",
                    content: "这个回帖有红包。删除后红包将消失，并且olo不退回。是否确认？",
                    onPositiveClick: () => {
                        handle()
                    }
                })
            } else {
                handle()
            }
        }
    })
}

//用户恢复已删除的功能
function recoverPostHandle() {
    function handle() {
        const params: recoverPostParams = {
            binggan: userStore.binggan!,
            thread_id: props.postData.thread_id,
            post_id: props.postData.id,
        }
        recoverPostPutter(params).then(() => emit('refreshPostsList'))
    }
    showDialog({
        title: "要恢复这个已删除的回复吗？",
        content: "会消费300olo喔",
        onPositiveClick: () => {
            handle()
        }
    })
}

//下拉菜单的统一入口
type dropdownNames = 'hint' | 'ban' | 'lock' | 'deleteAll' | 'delete' | 'recovery'
function dropdownSelect(name: dropdownNames) {
    emit('adminHandle', { action: name, postId: props.postData.id })
}

//回复数据处理（各种屏蔽等）
const postIsFolded = ref<boolean>(false)//是否被折叠的状态
const postFoldedMessage = ref<string>()//折叠回复后的提示词
function imgReplacer(match: string) {//用于屏蔽表情包或者其他图片的回调函数
    if (match.search(/class='emoji[-_]img'/g) != -1) {//旧2.0代码使用下划线，现3.0使用横杠-，这里要匹配两种
        //判断是否表情包
        return props.noEmojiMode ? "" : match

    } else if (match.search(/class='custom[-_]emoji[-_]img'/g) != -1) {//旧2.0代码使用下划线，现3.0使用横杠-，这里要匹配两种
        //判断是否自定义表情包
        return props.noCustomEmojiMode ? "" : match
    } else {
        if (props.noImageMode) {
            //no_image_mode:无图模式
            return match
                .replace(/src/i, "origin-src")
                .replace(/<img /i, '<img src="/img_svg.svg" class="img-svg"');
        } else {
            return match;
        }
    }
}
const postContent = computed(() => {//数据处理
    let postContent: string
    //第二种屏蔽类型：文本元素的替换（图片和表情包等）
    postContent = props.postData.content.replace(/<img[^>]*>/gi, imgReplacer)
        .replace(/<script/gi, "<**禁止使用script**")
        .replace(/<base/gi, "<**禁止使用base标签**")
        .replace(/\n/g, "<br>")

    if (props.superAdminMode || props.adminMode) {
        postContent = postContent.replace(/<style/gi, "<**停止解析style")
    }

    //第三种屏蔽类型：不变更postData，仅进行折叠
    if (userStore.userData?.binggan.use_pingbici) {
        const regMode = commonStore.userCustom.pingbiciIngnoreCase ? "gi" : "g"
        if (!commonStore.userCustom.hidePingbiciFloor) {//如果选择了“完全隐藏楼层”，则ThreadPage已经过滤过数据，这里就不用处理了
            //处理内容屏蔽词
            const pingbiciContent = userStore.userData.pingbici.content_pingbici
            pingbiciContent?.forEach(pingbici => {
                const reg = new RegExp(pingbici, regMode)
                if (reg.test(postContent)) {
                    postIsFolded.value = true
                    postFoldedMessage.value = '屏蔽词折叠（点击展开）'
                }
            })

        }
        if (props.antiJingfen && !commonStore.userCustom.hidePingbiciFloor) {//如果选择了“完全隐藏楼层”，则ThreadPage已经过滤过数据，这里就不用处理了
            //处理fjf屏蔽词
            const pingbiciFjf = userStore.userData.pingbici.fjf_pingbici
            pingbiciFjf?.forEach(pingbici => {
                const reg = new RegExp(pingbici, 'g') //这里不能用regMode（一定要区分大小写）
                if (reg.test(props.postData.created_binggan_hash!.slice(0, 5)!)) {
                    postIsFolded.value = true
                    postFoldedMessage.value = '小尾巴黑名单（点击展开）'
                }
            })
        }

        if (!commonStore.userCustom.hidePingbiciFloor) {//如果选择了“完全隐藏楼层”，则ThreadPage已经过滤过数据，这里就不用处理了
            //处理固马屏蔽词（复用了FJF屏蔽词）
            const pingbiciFjf = userStore.userData.pingbici.fjf_pingbici
            pingbiciFjf?.forEach(pingbici => {
                const reg = new RegExp(pingbici, regMode)
                if (reg.test(props.postData.nickname)) {
                    postIsFolded.value = true
                    postFoldedMessage.value = '固马黑名单（点击展开）'
                }
            })
        }
    }

    //处理折叠音视频模式
    if (props.noVideoMode) {
        const reg = new RegExp(/<video|<audio|<embed|<iframe/, "g");
        if (reg.test(postContent)) {
            postIsFolded.value = true
            postFoldedMessage.value = '音视频折叠（点击展开）'
        }

    }

    //根据yourPostsList标注自己被引用的回复
    if (props.yourPostsList.length > 0 && !props.noMentionMode) {
        postContent = postContent.replace(/@№[0-9]+/g, (match) => {
            const floorNum = Number(match.slice(2))
            if (props.yourPostsList.includes(floorNum)) {
                return `<span class="highlight">${match}</span>`
            } else {
                return match
            }
        })
    }

    //自动转换超链接
    if (props.useUrlMode) {
        function urlReplacer(match: string) {
            //判断是否是图片格式，如果非图片格式则转换为<a>标签
            const reg = new RegExp(/.*(png|jpe?g|webp|gif)$/, 'i')
            if (reg.test(match)) {
                return match
            } else {
                return `<a href="${match}" target="_blank">${match}</a>`
            }
        }
        const reg = new RegExp(/(https?:\/\/|www\.)[a-zA-Z_0-9\-@]+(\.\w[a-zA-Z_0-9\-:]+)+(\/[\(\)~#&\-=?\+\%/\:.\w]+)?/, 'gi')
        postContent = postContent.replace(reg, urlReplacer)
    }

    return postContent
})

//点击引用的处理
const postFooterText = computed<string>(() => {
    if (props.antiJingfen) {
        return `№${props.postData.floor} ${props.postData.nickname} ${props.postData.created_at} →${props.postData.created_binggan_hash?.slice(0, 5)}`
    } else {
        return `№${props.postData.floor} ${props.postData.nickname} ${props.postData.created_at}`
    }
})
function quoteClick() {
    const maxQuote = commonStore.userCustom.quoteMax; //最大可引用的层数

    // 折叠details标签的内容避免被引用;
    let elements_details = postContentDom.value!.getElementsByTagName("details");
    for (let dom of elements_details) {
        dom.open = false;
    }

    let postLines = postContentDom.value!.innerText.split("\n");
    let indexArray: number[] = [];

    //搜索引用的层数
    postLines.forEach((postLine, index) => {
        if (postLine.indexOf("@№") > -1) {
            indexArray.push(index);
        }
    });

    //如果层数过多，只截取部分回复引用
    if (indexArray.length >= maxQuote) {
        postLines = postLines.slice(
            indexArray[indexArray.length - maxQuote] + 1,
            postLines.length
        );
    }
    const quoteContent =
        "<span class='quote-content'>" +
        postLines.join("\n") +
        "\n" +
        '@' + postFooterText.value +
        "</span>" +
        "\n";

    emit("quoteClick", quoteContent);
}

//点击图片添加到表情包功能
const emojiSelected = ref<HTMLImageElement>()
function setImgOnClick() {
    const imgDom = postContentDom.value!.querySelectorAll('img')
    imgDom.forEach(element => {
        if (element.getAttribute('class') !== "img-svg") {//不处理屏蔽占位图
            element.addEventListener('click', (event) => {
                emojiSelected.value = element
                window.$message.success('要添加至自定义表情包吗？', {
                    render: renderMessage,
                    closable: true
                })
            })
        }
    });
}
const renderMessage: MessageRenderMessage = (props) => {
    const { type } = props
    return h(
        NAlert,
        {
            closable: false,
            type: type === 'loading' ? 'default' : type,
            showIcon: false,
            style: {
                boxShadow: 'var(--n-box-shadow)',
                maxWidth: 'calc(100vw - 64px)',
                width: '250px'
            }
        },
        () => [
            h('span', { innerText: props.content }),
            h(
                FButton,
                {
                    size: 'tiny',
                    type: 'success',
                    onClick: emojiAddHandle
                },
                {
                    default: () => '确定'
                }

            )
        ]
    )
}
function emojiAddHandle() {
    const myEmojis = userStore.userData.my_emoji
    const newEmojiSrc = emojiSelected.value?.getAttribute('src')
    if (myEmojis !== null && myEmojis.includes(newEmojiSrc!)) {
        window.$message.error('已经添加过该表情包了')
    } else {
        const params: myEmojisAddParams = {
            binggan: userStore.binggan!,
            my_emoji: newEmojiSrc!,
        }
        myEmojisAddPoster(params).then(() => userStore.refreshUserData())
    }

}
onMounted(() => {
    setImgOnClick()
})

//被屏蔽的图片重新展开功能
function setImgSvgOnClick() {
    const imgDom = postContentDom.value!.querySelectorAll('.img-svg')
    imgDom.forEach(element => {
        element.addEventListener("click", (event) => {
            const srcOld = element.getAttribute("src");
            element.setAttribute("src", "");//点击给让svg图标消失作为反馈
            element.setAttribute("src", element.getAttribute("origin-src")!);
            element.setAttribute("origin-src", srcOld!);
        });
    });
}
onMounted(() => {
    setImgSvgOnClick()
})


//确认post总行数，如果超过特定行数，则折叠（包括图片等高度）
const isHeightLimited = ref<boolean>(false)
const postContentContainerMaxHeight = ref<number>()
const postContentTopOffset = ref<number>()
function setMaxHeight() {
    const styles = window.getComputedStyle(postContentContainerDom.value!);
    const lineHeight = parseInt(styles.lineHeight);
    const height = parseInt(styles.height);
    const maxHeight = lineHeight * 16; //默认16行，后面增加自定义功能

    if (height > maxHeight) {
        isHeightLimited.value = true;
        postContentTopOffset.value = maxHeight - height;
        postContentContainerMaxHeight.value = maxHeight;
    }
}
function unfoldContent() {
    isHeightLimited.value = false;
    postContentTopOffset.value = undefined;
    postContentContainerMaxHeight.value = undefined;
}
onMounted(() => {
    if (props.postData.floor !== 0) {//首楼不折叠
        setMaxHeight()
    }
})

//刷新大乱斗数据
function refreshBattleData() {
    BattleCom.value?.refreshBattleDataHandle()
}
defineExpose({ refreshBattleData })

</script>