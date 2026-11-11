<template>
    <n-flex vertical :size="[12, 12]">
        <!-- 版头图 -->
        <n-carousel show-arrow :trigger="commonStore.isMobile ? 'click' : 'hover'" autoplay :interval=10000>
            <img :src="banner" v-for="banner in bannersShuffled" class="carousel-img">
        </n-carousel>
        <!-- 提示 -->
        <n-alert :show-icon="false" :type="'warning'">
            <span>（old!）本次活动同样有版头应援活动喔！</span>
            <router-link :to="'/thread/206131'">点击这里投稿</router-link>
        </n-alert>
        <!-- 提示 -->
        <n-alert :show-icon="false" :type="'default'">
            <n-text>{{ bannerText }}</n-text>
        </n-alert>
        <!-- 实时排名 -->
        <EmojiContestRanking :items="rankingItems" :loading="rankingLoading" :refreshing="pageRefreshing"
            :logged-in="userStore.userLoginStatus" :error="rankingError" :image-background="emojiBackGroundColor"
            @select="selectRankingGroup" @refresh="refreshPage" />
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
                    <!-- 票数总计 -->
                    <n-flex style="margin-top: 12px; " :align="'center'">
                        <span>{{ emojiGroupData.name }}
                            总票数：
                            {{ getMoeDataSum(moeData) }}
                        </span>
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
import { ref, shallowRef, computed, onBeforeUnmount } from 'vue';
import { NFlex, NTabs, NTabPane, NAlert, NSpin, NCarousel, NText } from 'naive-ui';
import { type moeUserVoteData as moeUserVoteDataInterface, type moeData as moeDataInterface, type moeRankingData, moeRankingGetter, moeDataGetter, moeUserVoteDataGetter } from '@/api/methods/emojiContest';
import VoteModal from './VoteModal.vue'
import EmojiContestRanking from './EmojiContestRanking.vue'
import dayjs from 'dayjs'
import { shuffleArray } from '@/js/func/shuffle'

// 表情包萌活动的基础数据
const startTime = dayjs.tz('2026-11-11 20:00')
const endTime = dayjs.tz('2026-11-14 20:00')
const emojiGroupIdList = [1, 2, 3, 4, 5, 6, 7, 8, 9] //可以用来过滤不参与的表情包。但出道萌是全数参赛的。
const emojiGroupIndex = {
    // 这里的序号记得也要改
    1: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6910c488ea284.jpg", "name": "比格多栋" },
    2: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6910c525855a3.jpg", "name": "四荤一素" },
    3: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6911cf46a80a4.gif", "name": "姆明" },
    4: { "emojiUrl": "https://wmimg.com/i/1547/2026/11/6aedb4297f792.gif", "name": "棉球猫" },
    5: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6910c0f1d78ed.gif", "name": "假飞鼠" },
    6: { "emojiUrl": "https://wmimg.com/i/1547/2026/11/6aedb46240c52.gif", "name": "呆猫八条" },
    7: { "emojiUrl": "https://wmimg.com/i/1547/2026/11/6aedb48ad41c0.webp", "name": "艾露猫" },
    8: { "emojiUrl": "https://wmimg.com/i/1547/2025/02/67ad3601c5eef.png", "name": "麻将脸" },
    9: { "emojiUrl": "https://wmimg.com/i/1547/2025/11/6910c2d3e4ff1.gif", "name": "奶龙" },
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
        "https://i.lefuha.top/v2/upload/2026-11-10/584ec897-261d-4bfe-9bb4-640cf6275df8.gif"
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
const emojiGroupIdSelected = shallowRef(0)
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

// 各请求只应用最新响应，投票后不复用提交前的在途请求。
const ranking = ref<moeRankingData[]>([])
const rankingLoading = shallowRef(false)
const rankingError = shallowRef('')
const pageRefreshing = shallowRef(false)
const moeData = ref<moeDataInterface[]>([])
const moeDataLoading = shallowRef(false)
const moeUserVoteData = ref<moeUserVoteDataInterface[]>([])
const moeUserVoteDataLoading = shallowRef(false)
let rankingRequest = 0
let groupRequest = 0
let userRequest = 0
let loadedGroupId: number | undefined
let disposed = false
onBeforeUnmount(() => { disposed = true })

const rankingItems = computed(() => ranking.value
    .filter(item => emojiGroupIdList.includes(item.emoji_group_id))
    .map(item => ({ ...item, ...emojiGroupIndex[item.emoji_group_id] })))

async function refreshRanking() {
    const request = ++rankingRequest
    rankingLoading.value = true
    rankingError.value = ''
    try {
        const data = await moeRankingGetter().send()
        if (!disposed && request === rankingRequest) ranking.value = data
    } catch {
        if (!disposed && request === rankingRequest) {
            rankingError.value = ranking.value.length ? '刷新失败，显示上次结果。' : '加载失败，请点击刷新重试。'
        }
    } finally {
        if (!disposed && request === rankingRequest) rankingLoading.value = false
    }
}

async function refreshUserVotes() {
    const request = ++userRequest
    moeUserVoteDataLoading.value = true
    try {
        const method = moeUserVoteDataGetter()
        method.config.shareRequest = false
        const data = await method.send()
        if (!disposed && request === userRequest) moeUserVoteData.value = data
    } catch {
        // 错误由公共 API 拦截器提示，保留已有数据。
    } finally {
        if (!disposed && request === userRequest) moeUserVoteDataLoading.value = false
    }
}

async function getMoeData(emojiGroupId: number) {
    if (!userStore.userLoginStatus) return
    const request = ++groupRequest
    if (emojiGroupId === 0) {
        moeDataLoading.value = false
        return refreshUserVotes()
    }
    if (loadedGroupId !== emojiGroupId) moeData.value = []
    loadedGroupId = emojiGroupId
    moeDataLoading.value = true
    try {
        const method = moeDataGetter(emojiGroupId)
        method.config.shareRequest = false
        const data = await method.send()
        if (!disposed && request === groupRequest && emojiGroupIdSelected.value === emojiGroupId) {
            moeData.value = data
        }
    } catch {
        // 同组刷新失败时保留已有数据。
    } finally {
        if (!disposed && request === groupRequest) moeDataLoading.value = false
    }
}

function selectRankingGroup(id: number) {
    emojiGroupIdSelected.value = id
    void getMoeData(id)
}

async function refreshPage() {
    if (!userStore.userLoginStatus || pageRefreshing.value) return
    pageRefreshing.value = true
    try {
        await Promise.allSettled([refreshRanking(), getMoeData(emojiGroupIdSelected.value)])
    } finally {
        if (!disposed) pageRefreshing.value = false
    }
}

if (userStore.userLoginStatus) void refreshPage()

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
    void refreshRanking()
    void refreshUserVotes()
    if (emojiGroupIdSelected.value === emojiGroupId) void getMoeData(emojiGroupId)
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
