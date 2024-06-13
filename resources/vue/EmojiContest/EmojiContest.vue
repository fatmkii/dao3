<template>
    <n-flex vertical :size="[12, 12]">
        <!-- 版头图 -->
        <img src="https://www.freeimg.cn/i/2024/06/13/666af8740a938.png" style="width: 100%;" />
        <!-- 提示 -->
        <n-alert :show-icon="false" :type="'default'">{{ bannerText }} </n-alert>
        <!-- 本体Tabs -->
        <n-tabs type="line" animated :placement="'left'" :size="commonStore.isMobile ? 'small' : 'large'"
            v-model:value="emojiGroupIdSelected" @update:value="getMoeData">
            <!-- 我的本命页 -->
            <n-tab-pane :key="0" :name="0" tab="我的本命">
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
            <n-tab-pane v-for="(emojiGroupData, key, index) in emojiGroupsData" :key="key + 1" :name="emojiGroupData.id"
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
import emojiDataRaw from '@/data/emojiData'
import { ref, computed } from 'vue';
import { useRequest } from 'alova';
import { NFlex, NTabs, NTabPane, NAlert, NSpin } from 'naive-ui';
import { type moeUserVoteData as moeUserVoteDataInterface, type moeData as moeDataInterface, type moeUserVoteParams, moeDataGetter, moeUserVoteDataGetter, moeUserVotePoster } from '@/api/methods/emojiContest';
import VoteModal from './VoteModal.vue'
import { FButton } from '@custom';
import dayjs from 'dayjs'

// 表情包萌活动的基础数据
const startTime = dayjs('2024-06-18 20:00')
const endTime = dayjs('2024-06-21 20:00')
const emojiGroupIdList = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 16] //活动的表情包组不包括咒岛专属等，不包括上次冠军8小豆泥，包括16是药水哥
const emojiGroupIndex = {
    1: { emojiUrl: 'https://www.freeimg.cn/i/2024/05/14/6643615d5fdc9.png', name: 'AC娘' },
    2: { emojiUrl: 'https://www.freeimg.cn/i/2024/05/14/664363e93d3cf.gif', name: '鹦鹉鸡' },
    3: { emojiUrl: 'https://www.freeimg.cn/i/2024/05/14/664366659ab29.gif', name: '咪子鱼' },
    4: { emojiUrl: 'https://www.freeimg.cn/i/2024/05/14/664368477446c.gif', name: '小黑猫' },
    5: { emojiUrl: 'https://www.freeimg.cn/i/2024/05/14/664369af63190.png', name: '麻将脸' },
    6: { emojiUrl: 'https://www.freeimg.cn/i/2024/05/14/66436b99dd1ea.jpg', name: '小恐龙' },
    7: { emojiUrl: 'https://www.freeimg.cn/i/2024/05/14/66436cb41e3e3.gif', name: 'TD猫' },
    9: { emojiUrl: 'https://www.freeimg.cn/i/2024/05/14/66436fa983d7f.jpg', name: '小企鹅' },
    10: { emojiUrl: 'https://www.freeimg.cn/i/2024/05/14/664371e81e84c.png', name: '小黄脸' },
    11: { emojiUrl: 'https://www.freeimg.cn/i/2024/05/14/66437362aba46.gif', name: 'FUFU' },
    16: { emojiUrl: 'https://www.freeimg.cn/i/2024/05/14/66437b01d45b7.gif', name: '药水哥' },
} as {
    [key: number]: {
        emojiUrl: string
        name: string,
    }
}
//活动开始与结束文字
const bannerText = computed<string>(() => {
    const now = dayjs()
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
    const now = dayjs()
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
    const now = dayjs()
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
</style>