<template>
    <!-- 回复card -->
    <n-card size="small" :bordered="true" class="post-card" :id="'f_' + postData.floor" :floor="postData.floor">
        <n-collapse :expanded-names="postIsFolded ? [] : ['default']" :trigger-areas="postIsFolded ? ['main'] : []">
            <n-collapse-item name="default">
                <!-- 正文内容 -->
                <div class="post-content-container" ref="postContentContainerDom" :style="postContentContainerStyle">
                    <span v-html="postContent" class="post-content" ref="postContentDom"
                        :style="postContentStyle"></span>
                </div>
                <!-- 红包组件 -->
                <HongbaoPost v-if="postData.hongbao_data !== null" :hongbao-data="postData.hongbao_data"
                    :forum-id="forumId" :thread-id="postData.thread_id"
                    @refresh-posts-list="emit('refreshPostsList')" />
                <!-- 正文下面的footer，楼号等 -->
                <div style="display: flex; gap: 4px;" class="post-footer" ref="postFooterDom"
                    :class="{ 'system-post': postData.created_by_admin === 2, 'admin-post': postData.created_by_admin === 1 }"
                    size="small">
                    <n-text :depth="3" class="post-footer-text" @click="quoteClick" style="cursor: pointer;">№
                        {{ postData.floor }}
                    </n-text>
                    <n-text class="post-nick-name" @click="quoteClick" style="cursor: pointer;">
                        {{ postData.nickname }}
                    </n-text>
                    <n-text class="post-created-at">{{ postData.created_at }}</n-text>
                    <n-text v-if="antiJingfen" class="post-anti-jingfen">
                        →{{ postData.created_binggan_hash?.slice(0, 5) }}
                    </n-text>
                    <!-- <n-text v-if="isHeightLimited" class="unfold-height" @click="unfoldContent"> *展开高度限制*</n-text> -->
                    <f-button v-if="isHeightLimited" size="tiny" @click="unfoldContent">展开限高</f-button>
                </div>
                <!-- 默认的箭头，把它设为空的div -->
                <template #arrow>
                    <div></div>
                </template>
                <!-- header，用来放头像和折叠提示 -->
                <template #header>
                    <n-flex class="post-header" size="small" :align="'center'" style="cursor: pointer;"
                        @click="postIsFolded = !postIsFolded">
                        <div class="random-head-container" v-if="!noHeadMode">
                            <img :src="randomHeadsData[randomHeadGroupIndex - 1].random_heads[postData.random_head]"
                                :class="'head_' + postData.random_head" />
                        </div>
                        <span>{{ postFoldedMessage }}</span>
                    </n-flex>
                </template>
                <!-- header-extra 放下拉菜单和删除按钮 -->
                <template #header-extra>
                    <n-flex size="small">
                        <n-icon :size="commonStore.isMobile ? 20 : 24"
                            v-if="postData.is_your_post && postData.is_deleted === 0" style="cursor: pointer;"
                            @click="deletePostHandle">
                            <Delete />
                        </n-icon>
                        <n-icon :size="commonStore.isMobile ? 20 : 24"
                            v-if="postData.is_your_post && postData.is_deleted === 1" style="cursor: pointer;"
                            @click="recoverPostHandle">
                            <Recover />
                        </n-icon>
                        <n-dropdown trigger="click" :options="funcOptions" @select="dropdownSelect"
                            :size="commonStore.isMobile ? 'medium' : 'large'">
                            <n-icon :size="commonStore.isMobile ? 20 : 24" style="cursor: pointer;">
                                <Dropdown />
                            </n-icon>
                        </n-dropdown>
                    </n-flex>
                </template>

            </n-collapse-item>
        </n-collapse>
    </n-card>
</template>

<script setup lang="ts">
import type { deletePostParams, postData, recoverPostParams } from '@/api/methods/posts'
import { deletePostDeleter, recoverPostPutter } from '@/api/methods/posts'
import { myEmojisAddPoster, type myEmojisAddParams } from '@/api/methods/user'
import randomHeadsData from '@/data/randomHeads'
import { renderIcon } from '@/js/func/renderIcon'
import showDialog from '@/js/func/showDialog'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { FButton } from '@/vue/Custom'
import type { rewardModalPayload } from '@/vue/Thread/PostList/RewardModal.vue'
import { Delete } from '@vicons/carbon'
import { EllipsisHorizontal as Dropdown, GiftOutline as Gift, ChatbubbleEllipsesOutline as Quote, ReloadOutline as Recover } from '@vicons/ionicons5'
import type { MessageRenderMessage } from 'naive-ui'
import { NAlert, NCard, NCollapse, NCollapseItem, NDropdown, NFlex, NIcon, NText, useThemeVars } from 'naive-ui'
import { computed, h, onMounted, ref, } from 'vue'
import { useRouter } from 'vue-router'
import HongbaoPost from './HongbaoPost.vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const router = useRouter()
const themeVars = useThemeVars()
const postContentDom = ref<HTMLSpanElement | null>(null)//回复内容组件的ref
const postContentContainerDom = ref<HTMLSpanElement | null>(null)//回复内容的外层包裹容器的ref
const postFooterDom = ref<HTMLDivElement | null>(null)//回复footer组件的ref

//组件props
interface Props {
    forumId: number,
    postData: postData,
    yourPostsList: number[] | [],
    randomHeadGroupIndex: number,
    antiJingfen?: boolean,
    noImageMode?: boolean,
    noEmojiMode?: boolean,
    noCustomEmojiMode?: boolean,
    noHeadMode?: boolean,
    noVideoMode?: boolean,
}
const props = withDefaults(defineProps<Props>(), {
    randomHeadGroupIndex: 1,
    antiJingfen: false,
    noImageMode: false,
    noEmojiMode: false,
    noCustomEmojiMode: false,
    noHeadMode: false,
    noVideoMode: false,
})

//回复内容的style，用来折叠高度等
const postContentContainerStyle = computed(() => ({
    maxHeight: postContentContainerMaxHeight.value === undefined ? undefined : postContentContainerMaxHeight.value + 'px',
}))
const postContentStyle = computed(() => ({
    top: postContentTopOffset.value === undefined ? undefined : postContentTopOffset.value + 'px',
}))


//注册事件
const emit = defineEmits<{
    showRewardModal: [payload: rewardModalPayload],
    quoteClick: [content: string],
    refreshPostsList: [],
}>()

//打赏回复及管理员选项的下拉菜单
const funcOptions = computed(() => {
    const options = [{ label: '回复', key: 'quote', icon: renderIcon(Quote, { size: '1.5rem' }) }]
    if (!props.postData.is_your_post) {
        //不是自己回复的时候才追加打赏按钮
        options.unshift({ label: '打赏', key: 'gift', icon: renderIcon(Gift, { size: '1.5rem' }) })
    }
    // if (userStore.checkAdminForums(1)) //TODO管理员功能
    return options
})

//打赏功能
function rewardHandle() {
    emit('showRewardModal', {
        floor: props.postData.floor,
        forumId: props.forumId,
        threadId: props.postData.thread_id,
        postId: props.postData.id,
        postFloorMessage: postFooterDom.value!.innerText,
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
type dropdownNames = 'quote' | 'gift'
function dropdownSelect(name: dropdownNames) {
    switch (name) {
        case 'gift'://打赏
            rewardHandle()
            break;
        case 'quote'://引用
            quoteClick()
            break;
        default:
            break;
    }
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
                .replace(/src/, "origin-src")
                .replace("<img ", '<img src="/img_svg.svg" class="img-svg"');
        } else {
            return match;
        }
    }
}
const postContent = computed(() => {//数据处理
    let postContent: string
    //第二种屏蔽类型：文本元素的替换（图片和表情包等）
    postContent = props.postData.content.replace(/<img[^>]*>/g, imgReplacer)
        .replace(/<script/g, "<**禁止使用script**")
        .replace(/\n/g, "<br>")


    //第三种屏蔽类型：不变更postData，仅进行折叠
    if (userStore.userData?.binggan.use_pingbici) {
        //处理内容屏蔽词
        const pingbiciContent = userStore.userData.pingbici?.content_pingbici

        pingbiciContent?.forEach(pingbici => {
            const reg = new RegExp(pingbici, 'g')
            if (reg.test(postContent)) {
                postIsFolded.value = true
                postFoldedMessage.value = '屏蔽词折叠（点击展开）'
            }
        })

    }
    if (props.antiJingfen === true && userStore.userData.pingbici?.fjf_pingbici !== null) {
        //处理fjf屏蔽词
        const pingbiciFjf = userStore.userData.pingbici?.fjf_pingbici
        pingbiciFjf?.forEach(pingbici => {
            const reg = new RegExp(pingbici, 'g')
            if (reg.test(props.postData.created_binggan_hash!.slice(0, 5)!)) {
                postIsFolded.value = true
                postFoldedMessage.value = '小尾巴黑名单（点击展开）'
            }
        })
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
    if (props.yourPostsList) {
        props.yourPostsList.forEach((floorNum) => {
            const str = `@№${floorNum}(?![0-9])`
            const reg = new RegExp(str, "g");
            postContent = postContent.replace(reg, (match) => {
                return `<span class="highlight">${match}</span>`
            })
        })
    }

    return postContent
})


//点击引用的处理
function quoteClick() {
    const maxQuote = 3; //最大可引用的层数

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
        '@' + postFooterDom.value!.innerText.replace(/\n/g, ' ') +
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
    if (myEmojis.includes(newEmojiSrc!)) {
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

</script>

<style scoped lang="scss">
.post-content {
    font-size: v-bind('commonStore.isMobile ? "0.875rem" : "1.0rem"');

    span {
        font-size: v-bind('commonStore.isMobile ? "0.875rem" : "1.0rem"')
    }
}

.post-content-container {
    overflow-x: hidden;
    overflow-y: hidden;
}

.post-footer {
    margin-top: 0.2rem;
    font-size: v-bind('commonStore.isMobile ? "0.75rem" : "0.875rem"');

    span {
        font-size: v-bind('commonStore.isMobile ? "0.75rem" : "0.875rem"')
    }
}

.post-footer {
    &.system-post .post-nick-name {
        color: v-bind('themeVars.primaryColor')
    }

    &.admin-post .post-nick-name {
        color: v-bind('themeVars.errorColor')
    }
}

.unfold-height {
    cursor: pointer;
}
</style>