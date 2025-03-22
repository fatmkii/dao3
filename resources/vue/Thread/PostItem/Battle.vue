<template>
    <n-card size="small" :bordered="true" embedded class="battle-card">
        <n-spin :show="battleDataLoading || battleDataFetching">
            <n-flex vertical size="small" v-if="battleData !== undefined">
                <!-- 大乱斗的语句 -->
                <n-flex v-for="battleMessage in battleMessageStyled" :align="'center'" :wrap="false"
                    :style="messageStyle[battleMessage.message_type]">
                    <img class="emoji-img" :src="battleMessage.chara_url">
                    <span v-html="battleMessage.message" v-if="battleMessage.message_type !== 0">
                    </span>
                    <n-tag v-else round> {{ battleMessage.message }}</n-tag>
                </n-flex>
                <!-- 提示信息 -->
                <n-flex :style="messageStyle[0]">
                    <n-tag v-if="battleData.battle.progress === 0" round>正在等待挑战者</n-tag>
                    <n-tag v-if="battleData.battle.progress === 2 && isRelative" round>{{ battleResultMessage
                    }}</n-tag>
                </n-flex>
                <!-- 下方挑战按钮 -->
                <n-flex v-if="battleData.battle.progress === 0 && battleData.battle.is_your_battle === false"
                    size="small" :wrap="false" :align="'center'" :justify="'center'" style="margin-top: 6px;">
                    <n-input-group style="max-width: 15.2rem;">
                        <f-input-group-label style="width: 3.2rem;">角色</f-input-group-label>
                        <n-select v-model:value="charaInput" :options="charaOptions" />
                    </n-input-group>
                    <f-button type="primary" @click="battleRollHandle" :disabled="battleRollLoading"
                        :loading="battleRollLoading">挑战</f-button>
                </n-flex>
            </n-flex>
        </n-spin>
    </n-card>
</template>

<script setup lang="ts">
import { battleChanllengerRollPoster, battleDataGetter, type battleChanllengerRollParams } from '@/api/methods/battle'
import { charaIndex } from '@/data/battleData'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { FButton, FInputGroupLabel } from '@/vue/Custom'
import { invalidateCache, useFetcher, useRequest } from 'alova'
import { match } from 'assert'
import { NCard, NFlex, NInputGroup, NSelect, NSpin, NTag, NText, useThemeVars } from 'naive-ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const router = useRouter()
const themeVars = useThemeVars()

//组件props
interface Props {
    battleId: number,
}
const props = withDefaults(defineProps<Props>(), {
})

//由message_type获得class名的列表
//message_type //0=系统文字；1=发起者说；2=挑战者说；
const messageStyle = [
    { 'flex-direction': 'row', 'justify-content': 'center' },
    { 'flex-direction': 'row', 'justify-content': 'start' },
    { 'flex-direction': 'row-reverse', 'justify-content': 'end' },
]

//处理一下BattleMessage，为数字加上颜色
const battleMessageStyled = computed(() => {
    return battleData.value.battle_messages.map((item, index) => {
        //仅对第一条信息进行操作(这里仍然用map，方便日后其他处理)
        if (index === 0) {
            return {
                ...item,
                message: item.message.replace(/\d+(,\d+)*/g,
                    (match) => {
                        const num = +match.replace(/,/g, ''); //转化为数值
                        if (num >= 10000) {
                            //大于等于10000设置为红色（主题皮肤中的错误色）
                            return `<span class="big-number-2">${match}</span>`
                        }
                        if (num >= 1000) {
                            //大于等于1000设置为黄色（主题皮肤中的警告色）
                            return `<span class="big-number-1">${match}</span>`
                        }
                        //其余直接返回
                        return match
                    }
                )
            }
        } else {
            return item
        }
    })
})

//Nselect选项
const charaOptions = computed(() => {
    const options = charaIndex[battleData.value.battle.chara_group] //根据battleData的头像组显示相应的角色选项
    if (battleData.value.battle.chara_group === 0) {
        //在共通头像组后面加入自定义角色
        const myBattleChara = userStore.userData.my_battle_chara
            .filter((item) => !item.not_use)
            .map((item, index) => ({ value: index + 240, label: item.name }))//自定义表情包从240开始
        return options.concat(myBattleChara)
    } else {
        return options
    }
})

//确定此大乱斗是否跟该用户有关系
const isRelative = computed(() => battleData.value.battle.is_your_battle || battleData.value.battle.you_are_challenger)

//大乱斗结果的文字
const battleResultMessage = computed<string>(() => {
    const battle = battleData.value.battle
    if (!isRelative.value) {
        //确定此大乱斗是否跟该用户有关系
        return ""
    }
    const isWin = //确认此用户是否胜利
        (battle.result === 1 && battle.is_your_battle === true) ||
        (battle.result === 2 && battle.you_are_challenger === true) ||
        battle.result === 3

    const taxRate = commonStore.isDouble11 ? 1.98 : 1.96
    const olo = Math.floor(isWin ? battle.battle_olo * taxRate : battle.battle_olo).toLocaleString('en-us')
    const text = isWin ? '赢得' : '输掉'
    return `你${text}了${olo}个奥利奥`
})


//用户输入
const charaInput = ref<number>(8)

//获取大乱斗数据
const { data: battleData,
    loading: battleDataLoading,
    onSuccess: battleDataOnSuccess } = useRequest(battleDataGetter(props.battleId))
battleDataOnSuccess((event) => {
    if (event.data.battle.progress === 0) {
        //如果大乱斗处于未结束状态，则马上失效其缓存。
        invalidateCache(`battleDataGetter-${event.data.battle.id}`)
    }
    if (event.data.battle.chara_group > 0) {
        //如果是特别的乱斗主题group_id>0，则默认选择第一个角色
        //如果是特别的共通主题group_id=0，则不改变默认选择（8，小豆泥）
        charaInput.value = charaIndex[event.data.battle.chara_group][0].value
    }
})
//刷新大乱斗数据
const { fetch: battleDataFetch, fetching: battleDataFetching, onSuccess: battleDataFetchSuccess } = useFetcher();
function refreshBattleDataHandle() {
    battleDataFetch(battleDataGetter(props.battleId))
}
battleDataFetchSuccess((event) => {
    if (event.data.battle.progress === 0) {
        //如果大乱斗处于未结束状态，则马上失效其缓存。
        invalidateCache(`battleDataGetter-${event.data.battle.id}`)
    }
})

//暴露刷新大乱斗数据的方法，当ThreadPage组件刷新回复列表的时候调用
defineExpose({ refreshBattleDataHandle })


//挑战大乱斗提交
const {
    loading: battleRollLoading,
    onSuccess: battleRollOnSuccess,
    onError: battleRollOnError,
    send: battleRollSend } =
    useRequest((params: battleChanllengerRollParams) => battleChanllengerRollPoster(params), { immediate: false })
battleRollOnSuccess(() => {
    refreshBattleDataHandle()
})
battleRollOnError(() => {
    refreshBattleDataHandle()
})
function battleRollHandle() {
    const dialogArgs = {
        title: '加入战斗！',
        closable: false,
        content: `将押注：${battleData.value.battle.battle_olo.toLocaleString('en-us')}个奥利奥`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            const params: battleChanllengerRollParams = {
                binggan: userStore.binggan!,
                battle_id: props.battleId,
                chara_id: charaInput.value >= 240 ? charaInput.value - 240 : charaInput.value,//前端中自定义角色从240开始，减去240让后端从0开始计数,
                is_custom_chara: charaInput.value >= 240,
            }
            battleRollSend(params)
        },
    }
    window.$dialog.warning(dialogArgs)
}

</script>

<style>
.battle-card {
    max-width: 600px;
}

.big-number-1 {
    color: v-bind("themeVars.warningColor");
    font-size: 1rem;
}

.big-number-2 {
    color: v-bind("themeVars.errorColor");
    font-size: 1.125rem;
}
</style>