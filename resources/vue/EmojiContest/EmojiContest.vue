<template>
    <n-flex vertical :size="[12, 12]">
        <!-- 版头图 -->
        <n-carousel show-arrow :trigger="commonStore.isMobile ? 'click' : 'hover'" autoplay :interval=10000>
            <img :src="banner" v-for="banner in bannersShuffled" class="carousel-img">
        </n-carousel>
        <!-- 提示 -->
        <n-alert :show-icon="false" :type="'warning'">
            <span>（new!）本次活动新增版头应援活动喔！</span>
            <router-link :to="'/thread/153992'">点击这里参与</router-link>
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
const startTime = dayjs.tz('2025-6-18 20:00')
const endTime = dayjs.tz('2025-6-22 20:00')
const emojiGroupIdList = [1, 2, 3, 5, 6, 9, 10, 11, 16, 17] //可以用来过滤不参与的表情包。但出道萌是全数参赛的。
const emojiGroupIndex = {
    1: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ad2bca02d05.png", "name": "AC娘" },
    2: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ab7d8f0753f.gif", "name": "鹦鹉鸡" },
    3: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ab6a329cadc.gif", "name": "咪子鱼" },
    5: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ad3601c5eef.png", "name": "麻将脸" },
    6: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ad38710da48.jpg", "name": "小恐龙" },
    9: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ad3dc22bbe8.png", "name": "小企鹅" },
    10: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ad3e55cf286.png", "name": "小黄脸" },
    11: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ad4141eae00.gif", "name": "FUFU" },
    16: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ad4a651928d.gif", "name": "药水哥" },
    17: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ad4b806cb12.gif", "name": "吉伊卡哇" },
} as {
    [key: number]: {
        emojiUrl: string
        name: string,
    }
}
//应援版头
const bannersShuffled = computed(() => {
    const banners = [
        'https://wmimg.com/i/1547/2025/06/6846dbf60cbe7.png',
        "https://wmimg.com/i/1547/2025/06/684bfbe7b431e.png",
        "https://wmimg.com/i/1547/2025/06/684bfbe7b7345.png",
        "https://wmimg.com/i/1547/2025/06/684bfbe7b63bd.png",
        "https://wmimg.com/i/1547/2025/06/684bfbe7b7345.png",
        "https://wmimg.com/i/1547/2025/06/684ed1e7bb22c.png",
        "https://wmimg.com/i/1547/2025/06/684ed1e80632a.png",
        "https://wmimg.com/i/1547/2025/06/684ed1e836f2a.png",
        "https://wmimg.com/i/1547/2025/06/684ed1e84c426.png",
        "https://wmimg.com/i/1547/2025/06/684ed1e8b0e52.png",
        "https://wmimg.com/i/1547/2025/06/6851648dcb6d2.png",
        "https://wmimg.com/i/1547/2025/06/6851648e13773.png",
        "https://wmimg.com/i/1547/2025/06/6851648e3bcbc.png",
        "https://wmimg.com/i/1547/2025/06/6851648e625d2.png",
        "https://wmimg.com/i/1547/2025/06/6851648eb0d26.png",
        "https://wmimg.com/i/1547/2025/06/6851648e8dc8a.png",
        "https://wmimg.com/i/1547/2025/06/6851648f30ffd.png",
        "https://wmimg.com/i/1547/2025/06/6851648f7d3e4.png",
        "https://wmimg.com/i/1547/2025/06/6851648fc2c42.png",
        "https://wmimg.com/i/1547/2025/06/685164901f2e1.png",
        "https://wmimg.com/i/1547/2025/06/685164908d7c0.png",
        "https://wmimg.com/i/1547/2025/06/6851649219afa.png",
        "https://wmimg.com/i/1547/2025/06/68529871267f8.png",
        "https://wmimg.com/i/1547/2025/06/68529871e2f82.png",
        "https://wmimg.com/i/1547/2025/06/68529872d9dfe.png",
        "https://wmimg.com/i/1547/2025/06/68529874985d7.png",
        "https://wmimg.com/i/1547/2025/06/6853f4c7241a9.png",
        "https://wmimg.com/i/1547/2025/06/6853f4c7398bf.png",
        "https://wmimg.com/i/1547/2025/06/6853f4c879f68.png",
        "https://wmimg.com/i/1547/2025/06/6853f4c8a79e7.png",
        "https://wmimg.com/i/1547/2025/06/6853f4c8a1cff.png",
        "https://wmimg.com/i/1547/2025/06/6853f4c90044e.png",
        "https://wmimg.com/i/1547/2025/06/6853f4c922153.png",
        "https://wmimg.com/i/1547/2025/06/6853f4c9554d3.png",
        "https://wmimg.com/i/1547/2025/06/6853f4c980080.png",
        "https://wmimg.com/i/1547/2025/06/6853f4c9915bc.png",
        "https://wmimg.com/i/1547/2025/06/6853f4c9a9560.png",
        "https://wmimg.com/i/1547/2025/06/6853f4ca6a226.png",
        "https://wmimg.com/i/1547/2025/06/6853f4cac866b.png",
        "https://wmimg.com/i/1547/2025/06/6853f4cba2151.png",
        "https://wmimg.com/i/1547/2025/06/6853f4cca2d7b.png",
        "https://wmimg.com/i/1547/2025/06/6853f4cd69b2a.png",
        "https://wmimg.com/i/1547/2025/06/68553c704951c.jpg",
        "https://wmimg.com/i/1547/2025/06/68553c705161e.jpg",
        "https://wmimg.com/i/1547/2025/06/68553c707937a.png",
        "https://wmimg.com/i/1547/2025/06/68553c707ccc9.jpg",
        "https://wmimg.com/i/1547/2025/06/68553c706d0f2.jpg",
        "https://wmimg.com/i/1547/2025/06/68553c7074599.png",
        "https://wmimg.com/i/1547/2025/06/68553c708ac17.png",
        "https://wmimg.com/i/1547/2025/06/68553c70c30b6.png",
        "https://wmimg.com/i/1547/2025/06/68553c70882ce.jpg",
        "https://wmimg.com/i/1547/2025/06/68553c708b3da.png",
        "https://wmimg.com/i/1547/2025/06/68553c7108d3f.png",
        "https://wmimg.com/i/1547/2025/06/68553c70dd7e9.png",
        "https://wmimg.com/i/1547/2025/06/68553c70b8e98.png",
        "https://wmimg.com/i/1547/2025/06/68553c70d740c.png",
        "https://wmimg.com/i/1547/2025/06/68553c709272c.jpg",
        "https://wmimg.com/i/1547/2025/06/68553c706a0ae.jpg",
    ]
    return shuffleArray(banners)
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