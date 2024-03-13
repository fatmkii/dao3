<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: maxWidth }" title="表情包大乱斗！" closable @close="showThis = false" size="small">
            <n-flex vertical>
                <n-text>小斗怡情，大斗伤身，强斗奥飞湮灭</n-text>
                <n-input-group>
                    <f-input-group-label style="width: 3.2rem;">主题</f-input-group-label>
                    <n-select v-model:value="charaGroupInput" :options="charaGroupOptions" />
                </n-input-group>
                <n-input-group>
                    <f-input-group-label style="width: 3.2rem;">角色</f-input-group-label>
                    <n-select v-model:value="charaInput" :options="charaOptions" />
                </n-input-group>
                <n-input-group>
                    <f-input-group-label style="width: 3.2rem;">下注</f-input-group-label>
                    <n-input-number v-model:value="olo" :max="1000000" :min="100" :step="100" :parse="inputNumberParse"
                        :format="inputNumberFormat" @keyup.enter="battleCreateHandle" />
                </n-input-group>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <f-button type="primary" @click="battleCreateHandle" :loading="battleCreateLoading">提交</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { battleCreatePoster, type battleCreateParams } from '@/api/methods/battle';
import { charaGroupIndex, charaIndex } from '@/data/battleData';
import getNewPostKey from '@/js/func/getNewPostKey';
import { inputNumberFormat, inputNumberParse } from '@/js/func/inputNumberFormat';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton, FInputGroupLabel } from '@custom';
import { useRequest } from 'alova';
import { NCard, NFlex, NInputGroup, NInputNumber, NModal, NSelect, NText } from 'naive-ui';
import { computed, ref, watch } from 'vue';

//基础数据
const commonStore = useCommonStore()
const userStore = useUserStore()

//组件props
interface Props {
    threadId: number,
    forumId: number,
    randomHeadsGroup: number,
}
const props = withDefaults(defineProps<Props>(), {
})

//计算modal最大宽度（手机版时候两侧各留16px的空位）
const maxWidth = computed<string>(() => {
    const screenWidth = window.innerWidth
    if (screenWidth >= 500 + 16 + 16) {
        return '500px'
    } else {
        return screenWidth - 32 + 'px'
    }
})

//NSelect选项
const charaGroupOptions = computed(() => {
    const options = [{ value: 1, label: "共通", available: true }]
    charaGroupIndex.forEach((item) => {
        if (item.value === props.randomHeadsGroup) {
            options.push(item)
        }
    })
    return options
})
const charaOptions = computed(() => {
    const options = charaIndex[charaGroupInput.value - 1] //根据上面选择的charaGroupInput显示相应的角色选项
    if (charaGroupInput.value === 1) {
        //在共通头像组后面加入自定义角色
        const myBattleChara = userStore.userData.my_battle_chara
            .filter((item) => !item.not_use)
            .map((item, index) => ({ value: index + 240, label: item.name })) //自定义表情包从240开始
        return options.concat(myBattleChara)
    } else {
        return options
    }
})

//输入数据
const charaInput = ref<number>(1)
const charaGroupInput = ref<number>(props.randomHeadsGroup)
const olo = ref<number>(100)


//选择角色组时(charaGroupInput)，自动变化角色选择(charaInput)
watch(charaGroupInput, (newValue) => {
    if (newValue === 1) {
        //如果是共通组，选择第八个（小豆泥）
        charaInput.value = charaIndex[newValue - 1][8].value
    } else {
        //其他角色组，选择第一个
        charaInput.value = charaIndex[newValue - 1][0].value
    }
}, { immediate: true })

//提交发起红包
const { loading: battleCreateLoading, send: battleCreateSend, onSuccess: battleCreateOnsuccess } = useRequest(
    (params: battleCreateParams) => battleCreatePoster(params),
    { immediate: false }
)
function battleCreateHandle(event: MouseEvent | KeyboardEvent) {
    const { timestamp, newPostKey } = getNewPostKey(event.isTrusted, props.threadId, userStore.binggan!)
    const params: battleCreateParams = {
        binggan: userStore.binggan!,
        forum_id: props.forumId,
        thread_id: props.threadId,
        battle_olo: olo.value,
        chara_id: charaInput.value >= 240 ? charaInput.value - 240 : charaInput.value,//前端中自定义角色从240开始，减去240让后端从0开始计数,
        is_custom_chara: charaInput.value >= 240,
        chara_group: charaGroupInput.value - 1, //2.0的时候，数据库的储存是从0开始的，这里只能减一以兼容
        new_post_key: newPostKey,
        timestamp: timestamp,
    }
    battleCreateSend(params)
}
battleCreateOnsuccess(() => {
    emit('refreshPostsList')
    showThis.value = false
})


//来自父组件的唤醒emit
const showThis = ref<boolean>(false)
function show() {
    showThis.value = true
}
defineExpose({ show })

//各种emit
const emit = defineEmits<{
    refreshPostsList: [],
}>()

</script>
