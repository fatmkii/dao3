<template>
    <n-flex vertical :size="[12, 12]">
        <!-- 版头图 -->
        <n-carousel show-arrow :trigger="commonStore.isMobile ? 'click' : 'hover'" autoplay :interval=10000>
            <img :src="banner" v-for="banner in bannersShuffled" class="carousel-img">
        </n-carousel>
        <!-- 提示 -->
        <n-alert :show-icon="false" :type="'warning'">
            <span>（new!）本次活动同样有版头应援活动喔！</span>
            <router-link :to="'/thread/10054'">点击这里投稿</router-link>
        </n-alert>
        <!-- 提示 -->
        <n-alert :show-icon="false" :type="'default'">{{ bannerText }} </n-alert>
        <!-- 本体Tabs -->
        <n-tabs type="line" animated :placement="'left'" :size="commonStore.isMobile ? 'small' : 'large'"
            v-model:value="emojiGroupIdSelected" @update:value="getMoeData">
            <!-- 我的本命页 -->
            <n-tab-pane :key=0 :name=0 tab="我的本命">
                <div>
                    <n-alert :show-icon="false" :type="'default'">
                        自己票数最多的“角色”为“⭐我的本命”，如该角色夺冠将获得特殊成就哦！
                        <br>注：这里的表情包图片只是用来代表该角色，不是你投票最多的图片。
                    </n-alert>
                </div>
                <!-- 用户投票记录 -->
                <n-spin :show="moeUserVoteDataLoading" style="height: 120px;">
                    <n-flex :wrap="true" :size="[4, 4]" style="margin-top: 12px;">
                        <n-flex v-for="(voteData, key) in moeUserVoteData" :key="key" style="width:72px;height: 120px;"
                            vertical :align="'center'" :justify="'end'" :size="[0, 4]">
                            <img :src="emojiGroupIndex[voteData.emoji_group_id].emojiUrl" style="max-width: 100%;"
                                class="emoji-moe-img">
                            <span>{{ key == 0 ? '⭐' : '' }} {{ emojiGroupIndex[voteData.emoji_group_id].name }}</span>
                            <span> {{ voteData.votes_num_total || '' }}</span>
                        </n-flex>
                        <span v-if="moeUserVoteData.length === 0">你的投票记录将会显示在这里。</span>
                    </n-flex>
                </n-spin>
            </n-tab-pane>
            <!-- 各个表情包组 -->
            <n-tab-pane v-for="(emojiGroupData, key) in emojiGroupsData" :key="key + 1" :name="emojiGroupData.id"
                :tab="emojiGroupData.name">
                <n-spin :show="moeDataLoading" style="height: 400px;">
                    <!-- 票数总计和刷新按钮 -->
                    <n-flex style="margin-top: 12px; " :align="'center'">
                        <span>{{ emojiGroupData.name }}
                            总票数：
                            {{ getMoeDataSum(moeData) }}
                        </span>
                        <f-button type="primary" style="margin-left: auto;"
                            @click="getMoeData(emojiGroupData.id)">刷新</f-button>
                    </n-flex>
                    <n-flex :wrap="true" :size="[8, 4]" style="margin-top: 12px;">
                        <!-- 各个表情包列表 -->
                        <n-flex v-for="(voteData, key) in moeData" :key="emojiGroupData.id * 1000 + voteData.emoji_id"
                            class="emoji-moe-box" vertical :align="'center'" :size="[0, 4]"
                            @click="showVoteModalCom(emojiGroupData, voteData)">
                            <img :src="emojiGroupData.emojis[voteData.emoji_id]"
                                style="max-width: 100%;max-height: 100%;" class="emoji-moe-img">
                            <span>{{ voteData.votes_num_total || '' }}</span>
                        </n-flex>
                    </n-flex>
                </n-spin>

            </n-tab-pane>
        </n-tabs>
        <VoteModal ref="VoteModalCom" @refresh-moe-data="refreshMoeData" />
    </n-flex>
</template>


<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useCommonStore } from '@/stores/common'
import emojiDataRaw from '@/data/emojiContestData' //这里根据需要换成出道萌或者表情包萌 
import { ref, computed } from 'vue';
import { useRequest } from 'alova';
import { NFlex, NTabs, NTabPane, NAlert, NSpin, NCarousel } from 'naive-ui';
import { type moeUserVoteData as moeUserVoteDataInterface, type moeData as moeDataInterface, type moeUserVoteParams, moeDataGetter, moeUserVoteDataGetter, moeUserVotePoster } from '@/api/methods/emojiContest';
import VoteModal from './VoteModal.vue'
import { FButton } from '@custom';
import dayjs from 'dayjs'
import { shuffleArray } from '@/js/func/shuffle'

// 表情包萌活动的基础数据
const startTime = dayjs.tz('2025-11-11 20:00')
const endTime = dayjs.tz('2025-11-14 20:00')
const emojiGroupIdList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] //可以用来过滤不参与的表情包。但出道萌是全数参赛的。
const emojiGroupIndex = {
    // 这里的序号记得也要改
    1: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6910bf6742408.webp", "name": "领结猫" },
    2: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6910c019b2a92.gif", "name": "宝可梦" },
    3: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6910c11e4aaed.gif", "name": "假飞鼠" },
    4: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6910c1a7bad16.gif", "name": "猫猫虫" },
    5: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6910c29cbda8f.gif", "name": "小甲鱼" },
    6: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6910c2d3e4ff1.gif", "name": "奶龙" },
    7: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6911cf46a80a4.gif", "name": "姆明" },
    8: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6910c44cb2227.gif", "name": "青蛙波仔" },
    9: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6910c48d98a26.jpg", "name": "四荤一素" },
    10: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6910c559db1b4.gif", "name": "谷歌布丁" },
} as {
    [key: number]: {
        emojiUrl: string
        name: string,
    }
}
//应援版头
const bannersShuffled = computed(() => {
    const banners = [
        'https://wmimg.com/i/1547/2025/11/691097b73d035.png',
    ]
    return shuffleArray(banners).slice(0, 5)
})


//活动开始与结束文字
const bannerText = computed<string>(() => {
    const now = dayjs.tz()
    if (now < startTime) {
        return `活动将于 ${startTime.format('M月D日H点')} 开始`
    }
    if (now > endTime) {
        return `投票已经结束！`
    }

    return `投票正在进行！将于${endTime.format('M月D日H点')}结束。（${endText.value}）`

})

//显示剩余时间用
const endText = computed<string>(() => {
    const now = dayjs.tz()
    const hoursDiff = endTime.diff(now, 'hour')
    const minutesDiff = endTime.diff(now, 'minute') - 60 * hoursDiff
    return `剩余${hoursDiff}小时${minutesDiff}分钟`
})

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const emojiGroupIdSelected = ref<number>()
const emojiGroupsData = computed<emojiGroupData[]>(() =>
    emojiDataRaw.filter(data => emojiGroupIdList.includes(data.id))
)
interface emojiGroupData {
    id: number
    headsId: number
    name: string
    emojis: string[]
}
const VoteModalCom = ref<InstanceType<typeof VoteModal> | null>(null)


//表情包背景色
const emojiBackGroundColor = computed(() =>
    commonStore.userCustom.emojiWhiteBack ? '#FFFFFF' : undefined,
)

// 切换分组时候，读取表情包组的投票结果数据
function getMoeData(emojiGroupId: number) {
    if (emojiGroupId === 0) {
        // id=0是“我的本命”页
        moeUserVoteDataSend()
    } else {
        moeData.value = [] as moeDataInterface[]
        moeDataGetterSend(emojiGroupId)
    }
}

// 获取当前已选择表情包组的投票结果数据
const { loading: moeDataLoading, data: moeData, send: moeDataGetterSend, onSuccess: moeDataOnSuccess } =
    useRequest((emoji_group_id: number) => moeDataGetter(emoji_group_id),
        { immediate: false, initialData: [] }
    );

// 获取用户参与投票数据
const { loading: moeUserVoteDataLoading, data: moeUserVoteData, send: moeUserVoteDataSend }
    = useRequest(moeUserVoteDataGetter, { immediate: false, initialData: [] });
if (userStore.binggan) {
    moeUserVoteDataSend()
}

// 计算总票数
function getMoeDataSum(moeData: moeDataInterface[]) {
    return moeData.reduce((acc, item) => {
        acc += item.votes_num_total
        return acc
    }, 0)
}

// 打开投票框modal
function showVoteModalCom(emojiGroupData: emojiGroupData, voteData: moeDataInterface) {
    let endFlag = 0
    const now = dayjs.tz()
    if (now > startTime) {
        endFlag = 1
    }
    if (now > endTime) {
        endFlag = 2
    }
    VoteModalCom?.value?.show({
        emojiUrl: emojiGroupData.emojis[voteData.emoji_id],
        emojiGroupId: emojiGroupData.id,
        emojiId: voteData.emoji_id,
        voteNum: voteData.votes_num_total,
        endFlag: endFlag,
    })
}

//投票后刷新数据
function refreshMoeData(emojiGroupId: number) {
    moeUserVoteDataSend()
    getMoeData(emojiGroupId)
}

</script>

<style scoped lang="scss">
.emoji-moe-box {
    @media all and (min-width: 1200px) {
        width: 60px;
        height: auto;
    }

    @media not all and (min-width: 1200px) {
        width: 48px;
        height: auto;
    }

}

.emoji-moe-img {
    background-color: v-bind(emojiBackGroundColor);

}

.carousel-img {
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
}
</style>