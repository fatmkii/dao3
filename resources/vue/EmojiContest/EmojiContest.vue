<template>
    <n-flex vertical :size="[12, 12]">
        <!-- 版头图 -->
        <n-carousel show-arrow :trigger="commonStore.isMobile ? 'click' : 'hover'" autoplay :interval=10000>
            <img :src="banner" v-for="banner in bannersShuffled" class="carousel-img">
        </n-carousel>
        <!-- 提示 -->
        <n-alert :show-icon="false" :type="'warning'">
            <span>（new!）本次活动同样有版头应援活动喔！</span>
            <router-link :to="'/thread/192451'">点击这里投稿</router-link>
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
const startTime = dayjs.tz('2026-6-18 20:00')
const endTime = dayjs.tz('2026-6-22 20:00')
const emojiGroupIdList = [1, 2, 3, 5, 6, 9, 16, 17, 18] //可以用来过滤不参与的表情包。但出道萌是全数参赛的。
const emojiGroupIndex = {
    // 这里的序号记得也要改
    1: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ad2d6530f41.gif", "name": "AC娘" },
    2: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ad2f8780322.png", "name": "鹦鹉鸡" },
    3: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ab6a329cadc.gif", "name": "咪子鱼" },
    5: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ad3601c5eef.png", "name": "麻将脸" },
    6: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ad3845d3839.jpg", "name": "小恐龙" },
    9: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ad3d2be5311.jpg", "name": "小企鹅" },
    16: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ab79a86a0cb.gif", "name": "药水哥" },
    17: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ad4b806cb12.gif", "name": "吉伊卡哇" },
    18: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6910bf4fb0954.gif", "name": "领结猫" },
} as {
    [key: number]: {
        emojiUrl: string
        name: string,
    }
}
//应援版头
const bannersShuffled = computed(() => {
    const banners = [
        "https://wmimg.com/i/1547/2025/06/6846dbf60cbe7.png",
        "https://wmimg.com/i/1547/2026/06/6a37be3289498.png",
        "https://wmimg.com/i/1547/2026/06/6a37be32c83ec.png",
        "https://wmimg.com/i/1547/2026/06/6a37be32d83fd.png",
        "https://wmimg.com/i/1547/2026/06/6a37be330324f.png",
        "https://wmimg.com/i/1547/2026/06/6a37be3302e52.png",
        "https://wmimg.com/i/1547/2026/06/6a37be33203ca.png",
        "https://wmimg.com/i/1547/2026/06/6a37be331bdb6.png",
        "https://wmimg.com/i/1547/2026/06/6a37be332a60c.png",
        "https://wmimg.com/i/1547/2026/06/6a37be3334183.png",
        "https://wmimg.com/i/1547/2026/06/6a37be331fecd.png",
        "https://wmimg.com/i/1547/2026/06/6a37be3328b40.png",
        "https://wmimg.com/i/1547/2026/06/6a37be333e31e.png",
        "https://wmimg.com/i/1547/2026/06/6a37be337d305.png",
        "https://wmimg.com/i/1547/2026/06/6a37be3345ff7.jpg",
        "https://wmimg.com/i/1547/2026/06/6a37be335d782.png",
        "https://wmimg.com/i/1547/2026/06/6a37be331605a.png",
        "https://wmimg.com/i/1547/2026/06/6a37be333c3c8.png",
        "https://wmimg.com/i/1547/2026/06/6a37be33557ce.png",
        "https://wmimg.com/i/1547/2026/06/6a37be3416f30.png",
        "https://wmimg.com/i/1547/2026/06/6a37be3329ada.png",
        "https://wmimg.com/i/1547/2026/06/6a37be34470eb.png",
        "https://wmimg.com/i/1547/2026/06/6a37be333c3d1.gif",
        "https://wmimg.com/i/1547/2026/06/6a37be34b3043.png",
        "https://wmimg.com/i/1547/2026/06/6a37be34d2a3b.png",
        "https://wmimg.com/i/1547/2026/06/6a37be348e457.png",
        "https://wmimg.com/i/1547/2026/06/6a37be34d5b91.png",
        "https://wmimg.com/i/1547/2026/06/6a37be353cae2.png",
        "https://wmimg.com/i/1547/2026/06/6a37be35269a7.png",
        "https://wmimg.com/i/1547/2026/06/6a37be3520799.png",
        "https://wmimg.com/i/1547/2026/06/6a37be35569a1.png",
        "https://wmimg.com/i/1547/2026/06/6a37be35ae875.png",
        "https://wmimg.com/i/1547/2026/06/6a37be3544ffb.png",
        "https://wmimg.com/i/1547/2026/06/6a37be35ab984.png",
        "https://wmimg.com/i/1547/2026/06/6a37be359c707.png",
        "https://wmimg.com/i/1547/2026/06/6a37be35748bc.gif",
        "https://wmimg.com/i/1547/2026/06/6a37be3570bad.jpg",
        "https://wmimg.com/i/1547/2026/06/6a38002d66d0b.png",
        "https://wmimg.com/i/1547/2026/06/6a38002d78829.png",
        "https://wmimg.com/i/1547/2026/06/6a38002d7ed38.png",
        "https://wmimg.com/i/1547/2026/06/6a38002d8af56.png",
        "https://wmimg.com/i/1547/2026/06/6a38002defe8e.png",
        "https://wmimg.com/i/1547/2026/06/6a38002e1000d.png",
        "https://wmimg.com/i/1547/2026/06/6a38002e0ab5d.png",
        "https://wmimg.com/i/1547/2026/06/6a38002e17f49.png",
        "https://wmimg.com/i/1547/2026/06/6a38002e17fbf.png",
        "https://wmimg.com/i/1547/2026/06/6a38002decf9a.gif",
        "https://wmimg.com/i/1547/2026/06/6a38002e153cf.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d1a91b9.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d1b0e68.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d1b5c69.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d1c26be.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d221de0.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d20b7ce.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d23253b.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d269b0e.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d26baa9.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d2742a5.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d278862.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d2807bb.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d249092.jpg",
        "https://wmimg.com/i/1547/2026/06/6a3911d292f52.png",
        "https://wmimg.com/i/1547/2026/06/6a38002d66d0b.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d2b0651.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d2a04a3.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d31f244.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d2aec82.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d2bd05f.gif",
        "https://wmimg.com/i/1547/2026/06/6a3911d365abe.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d36d31d.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d385d9f.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d3ae3b8.jpg",
        "https://wmimg.com/i/1547/2026/06/6a3911d3a9816.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d3e512d.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d3c47f7.jpg",
        "https://wmimg.com/i/1547/2026/06/6a38002e1000d.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d425b54.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d433918.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d40ae3f.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d47065c.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d45da29.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d48a7e2.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d507d5b.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d53c8f8.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d52a366.png",
        "https://wmimg.com/i/1547/2026/06/6a38002defe8e.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d57a0f0.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d578858.png",
        "https://wmimg.com/i/1547/2026/06/6a3911d59b77a.gif",
        "https://wmimg.com/i/1547/2026/06/6a3911d2bd078.png",
        "https://wmimg.com/i/1547/2026/06/6a3911e8f3153.png",
        "https://wmimg.com/i/1547/2026/06/6a3911e936226.png",
        "https://wmimg.com/i/1547/2026/06/6a3911e949e55.jpg",
        "https://wmimg.com/i/1547/2026/06/6a3911e95b45a.jpg",
        "https://wmimg.com/i/1547/2026/06/6a3911e968779.png",
        "https://wmimg.com/i/1547/2026/06/6a3911e9a172a.png",
        "https://wmimg.com/i/1547/2026/06/6a3911e999e9b.png",
        "https://wmimg.com/i/1547/2026/06/6a3911ea288b5.jpg",
        "https://wmimg.com/i/1547/2026/06/6a3911ea5d484.jpg",
        "https://wmimg.com/i/1547/2026/06/6a3911ea726e0.png",
        "https://wmimg.com/i/1547/2026/06/6a3911eac874b.png",
        "https://wmimg.com/i/1547/2026/06/6a3911eaa1f84.png",
        "https://wmimg.com/i/1547/2026/06/6a3911eb1931f.png",
        "https://wmimg.com/i/1547/2026/06/6a3911eb0c131.png",
        "https://wmimg.com/i/1547/2026/06/6a3911ec42252.png",
        "https://wmimg.com/i/1547/2026/06/6a3911ec8f3d9.jpg",
        "https://wmimg.com/i/1547/2026/06/6a3911ec6783e.png",
        "https://wmimg.com/i/1547/2026/06/6a3911ec72f7c.png",
        "https://wmimg.com/i/1547/2026/06/6a3911ecbd6db.png",
        "https://wmimg.com/i/1547/2026/06/6a3911ecdc633.png",
        "https://wmimg.com/i/1547/2026/06/6a3911ecbbb71.png",
        "https://wmimg.com/i/1547/2026/06/6a3911eccee99.png",
        "https://wmimg.com/i/1547/2026/06/6a38002e0ab5d.png",
        "https://wmimg.com/i/1547/2026/06/6a3911ed21a4d.png",
        "https://wmimg.com/i/1547/2026/06/6a3911ed2dc29.gif",
        "https://wmimg.com/i/1547/2026/06/6a3911ecda723.png",
        "https://wmimg.com/i/1547/2026/06/6a3911ed2f1c1.png",
        "https://wmimg.com/i/1547/2026/06/6a3911ed1411c.png",
        "https://wmimg.com/i/1547/2026/06/6a3916484e037.jpg",
        "https://wmimg.com/i/1547/2026/06/6a3916485fce5.jpg",
        "https://wmimg.com/i/1547/2026/06/6a391648608ca.png",
        "https://wmimg.com/i/1547/2026/06/6a3916486d8bf.png",
        "https://wmimg.com/i/1547/2026/06/6a39164888fc3.png",
        "https://wmimg.com/i/1547/2026/06/6a39164898e53.png",
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
