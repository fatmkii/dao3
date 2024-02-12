<template>
    <n-flex vertical :size="2" v-if="showThis">

        <n-card v-for="postData in postsData" :key="postData.id" size="small" :bordered="true">
            <n-collapse :default-expanded-names="postFolded ? [] : ['default']" :trigger-areas="postFolded ? ['main'] : []">
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
                        <span>{{ postFoldedMessage }}</span>
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
})

//打赏回复及管理员选项的下拉框
const themeOptions = [
    { label: '打赏', key: 'gift', icon: renderIcon(Gift, { size: '1.5rem' }) },
    { label: '回复', key: 'quote', icon: renderIcon(Quote, { size: '1.5rem' }) },
]


//回复折叠相关
const postFolded = ref<boolean>()//是否被折叠的状态
const postFoldedMessage = ref<string>()//折叠回复后的提示词

//回复数据处理（各种屏蔽词等）
const postsData = computed(() => {

    return props.postsDataRaw
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