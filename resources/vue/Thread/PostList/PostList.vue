<template>
    <n-flex vertical :size="2" v-if="showThis">

        <n-card v-for="(postData, postDataIndex) in postsData" :key="postData.id" size="small" :bordered="true">
            <n-collapse :default-expanded-names="postFolded[postDataIndex] ? [] : ['default']"
                :trigger-areas="postFolded[postDataIndex] ? ['main'] : []">
                <n-collapse-item name="default">
                    <!-- 正文内容 -->
                    <span v-html="postData.content" class="post-span"></span>
                    <!-- 正文下面的footer，楼号等 -->
                    <n-flex class="post-footer" size="small" @click="console.log('//TODO回复引用')">
                        <n-text :depth="3" class="post-footer-text">№{{ postData.floor }}</n-text>
                        <n-text class="post-nick-name">
                            {{ postData.nickname }}
                        </n-text>
                        <n-text class="post-created-at">{{ postData.created_at }}</n-text>

                        <n-text v-if="antiJingfen" class="post-anti-jingfen">
                            →{{ postData.created_binggan_hash?.slice(0, 5) }}
                        </n-text>
                    </n-flex>
                    <!-- 默认的箭头，把它设为空的div -->
                    <template #arrow>
                        <div></div>
                    </template>
                    <!-- header，用来放头像和折叠提示 -->
                    <template #header>
                        <div class="random-head-container" v-if="!noHeadMode">
                            <img :src="randomHeadsData[randomHeadGroupIndex - 1].random_heads[postData.random_head]"
                                :class="'head_' + postData.random_head" />
                        </div>
                        <span>{{ postFoldedMessage[postDataIndex] }}</span>
                    </template>
                    <!-- header-extra 放下拉菜单 -->
                    <template #header-extra>
                        <n-dropdown trigger="click" :options="themeOptions"
                            :size="commonStore.isMobile ? 'medium' : 'large'">
                            <n-icon :size="24" style="cursor: pointer;">
                                <Dropdown />
                            </n-icon>
                        </n-dropdown>
                    </template>

                </n-collapse-item>
            </n-collapse>
        </n-card>
    </n-flex>
    <n-flex vertical :size="2" v-else>
        <n-skeleton class="posts-card-skeleton" v-for="  n   in   10  " />
    </n-flex>
</template>

<script setup lang="ts">
import { NFlex, NSkeleton, NCard, NCollapse, NCollapseItem, NIcon, NDropdown, NText } from 'naive-ui'
import { FButton, FCheckbox, FInput } from '@custom'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import type { postData } from '@/api/methods/posts'
import { renderIcon } from '@/js/func/renderIcon'
import randomHeadsData from '@/data/randomHeads'
import { useRouter } from 'vue-router'
import { ref, computed, watch, h } from 'vue'
import { EllipsisHorizontal as Dropdown, GiftOutline as Gift, ChatbubbleEllipsesOutline as Quote } from '@vicons/ionicons5'


//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const router = useRouter()

//组件props
interface Props {
    showThis: boolean,
    postsDataRaw: postData[] | [],
    randomHeadGroupIndex: number,
    antiJingfen?: boolean,
    noImageMode?: boolean,
    noEmojiMode?: boolean,
    noCustomEmojiMode?: boolean,
    noHeadMode?: boolean,
    noVideoMode?: boolean,
    noBattleMode?: boolean,
    noRollMode?: boolean,
    noRewardMode?: boolean,
    noHongbaoMode?: boolean,
}
const props = withDefaults(defineProps<Props>(), {
    postsListData: () => [],
    randomHeadGroupIndex: 1,
    antiJingfen: false,
    noImageMode: false,
    noEmojiMode: false,
    noCustomEmojiMode: false,
    noHeadMode: false,
    noVideoMode: false,
    noBattleMode: false,
    noRollMode: false,
    noRewardMode: false,
    noHongbaoMode: false,
})

//打赏回复及管理员选项的下拉框
const themeOptions = [
    { label: '打赏', key: 'gift', icon: renderIcon(Gift, { size: '1.5rem' }) },
    { label: '回复', key: 'quote', icon: renderIcon(Quote, { size: '1.5rem' }) },
]

//回复数据处理（各种屏蔽等）
const postFolded = ref<boolean[]>([])//是否被折叠的状态
const postFoldedMessage = ref<string[]>([])//折叠回复后的提示词

function imgReplacer(match: string) {//用于屏蔽表情包或者其他图片的回调函数
    if (match.search(/class='emoji_img'/g) != -1) {
        //判断是否表情包
        return props.noEmojiMode ? "" : match

    } else if (match.search(/class='custom_emoji_img'/g) != -1) {
        //判断是否自定义表情包
        return props.noCustomEmojiMode ? "" : match
    } else {
        if (props.noImageMode) {
            //no_image_mode:无图模式
            return match
                .replace(/src/, "data-src")
                .replace("<img ", '<img src="/img_svg.svg" class="img_svg"');
        } else {
            return match;
        }
    }
}
const postsData = computed(() => {
    let postsData: postData[]

    //第一种屏蔽类型：直接过滤掉整个postData元素的（大乱斗/roll点等）
    postsData = props.postsDataRaw.filter((post) => {
        if (props.noBattleMode === true && post.battle_id !== null) { return false }
        if (props.noRollMode === true && post.created_by_admin === 2 && post.nickname === 'Roll点系统') { return false }
        if (props.noRewardMode === true && post.created_by_admin === 2 && post.nickname === '奥利奥打赏系统' && !post.is_your_post) { return false }
        if (props.noHongbaoMode === true) {
            //红包结果屏蔽条件
            const condition1 =
                post.created_by_admin == 2 &&
                post.nickname == "红包结果" &&
                !post.is_your_post;
            //抢红包的口令屏蔽条件
            const condition2 = /^--红包口令: /.test(post.content) && !post.is_your_post;
            if (condition1 || condition2) {
                return false;
            }
        }
        return true
    })
    //第二种屏蔽类型：文本元素的替换（图片和表情包等）
    postsData = postsData.map(postData => {
        return {
            ...postData,
            content: postData.content.replace(/<img[^>]*>/g, imgReplacer)
                .replace(/<script/g, "<**禁止使用script**")
                .replace(/\n/g, "<br>")
        }
    })
    //第三种屏蔽类型：不变更postData，仅进行折叠
    if (userStore.userData?.binggan.use_pingbici) {
        //处理内容屏蔽词
        const pingbiciContent = userStore.userData.pingbici?.content_pingbici
        postsData.forEach((postData, postDataIndex) => {
            pingbiciContent?.forEach(pingbici => {
                const reg = new RegExp(pingbici, 'g')
                if (reg.test(postData.content)) {
                    postFolded.value[postDataIndex] = true
                    postFoldedMessage.value[postDataIndex] = '屏蔽词折叠（可点击展开）'
                }
            })
        });
    }
    if (props.antiJingfen === true && userStore.userData.pingbici?.fjf_pingbici !== null) {
        //处理fjf屏蔽词
        const pingbiciFjf = userStore.userData.pingbici?.fjf_pingbici
        postsData.forEach((postData, postDataIndex) => {
            pingbiciFjf?.forEach(pingbici => {
                const reg = new RegExp(pingbici, 'g')
                if (reg.test(postData.created_binggan_hash!.slice(0, 5)!)) {
                    postFolded.value[postDataIndex] = true
                    postFoldedMessage.value[postDataIndex] = '小尾巴黑名单（可点击展开）'
                }
            })
        });
    }

    //处理折叠音视频模式
    if (props.noVideoMode) {
        const reg = new RegExp(/<video|<audio|<embed|<iframe/, "g");
        postsData.forEach((postData, postDataIndex) => {
            if (reg.test(postData.content)) {
                postFolded.value[postDataIndex] = true
                postFoldedMessage.value[postDataIndex] = '音视频折叠（可点击展开）'
            }
        });
    }

    return postsData
})




</script>

<style scoped>
.posts-card-skeleton {
    border-radius: 10px;
    height: 100px;
    width: 100%;
}

.post-footer {
    font-size: v-bind('commonStore.isMobile ? "0.75rem" : "0.875rem"');

    span {
        font-size: v-bind('commonStore.isMobile ? "0.75rem" : "0.875rem"')
    }
}
</style>