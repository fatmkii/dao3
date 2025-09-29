<template>
    <n-flex vertical style="max-width: 450px; margin-top: 8px;">
        <!-- 提示 -->
        <div>
            <n-text :depth="3">温馨提示：</n-text>
            <n-text v-if="!commonStore.isOctober1st">
                在红包总额以外，会追加扣除7%手续费。</n-text>
            <n-text v-else>
                <del>在红包总额以外，会追加扣除7%手续费。</del>
                <br />
                10月1日“红包个数”在20个及以上时，手续费<n-text type="error">0%!!</n-text>
            </n-text>
        </div>
        <div>
            <n-text :depth="3">总共扣除：</n-text>
            <n-text type="warning">{{ olo_total }}</n-text>个奥利奥
        </div>
        <!-- 各种输入数据 -->
        <n-input-group>
            <f-input-group-label style="width: 5.2rem;">olo类型</f-input-group-label>
            <n-select v-model:value="hongbaoType" :options="hongbaoTypeOptions" />
        </n-input-group>
        <n-input-group>
            <f-input-group-label style="width: 5.2rem;">红包个数</f-input-group-label>
            <n-input-number v-model:value="num" :max="600" :min="10" :step="10" />
        </n-input-group>
        <n-input-group>
            <f-input-group-label style="width: 5.2rem;">olo总额</f-input-group-label>
            <n-input-number v-model:value="olo" :max="2000000" :min="20000" :step="10000" :parse="inputNumberParse"
                :format="inputNumberFormat" />
        </n-input-group>
        <n-input-group>
            <f-input-group-label style="width: 5.2rem;">红包口令</f-input-group-label>
            <f-input v-model:value="keyword" placeholder="必填" />
        </n-input-group>
        <n-input-group>
            <f-input-group-label style="width: 5.2rem;">红包封面</f-input-group-label>
            <f-input v-model:value="picUrl" placeholder="（可选）填写图片的完整网址" />
        </n-input-group>
        <n-input-group v-for="n in messageNum">
            <f-input-group-label style="width: 5.2rem;">回复留言</f-input-group-label>
            <f-input v-model:value="hongbaoMessage[n - 1]" :placeholder="`#${n}（可选） 多个留言时随机抽取一个`" :maxlength="255" />
        </n-input-group>
        <!-- 动态的回复留言数量增减按钮 -->
        <n-flex size="small" :align="'center'">
            <n-text :depth="3">留言数量</n-text>
            <n-button size="tiny" circle :disabled="messageNum === 5" @click="messageNumChange(1)">
                <template #icon>
                    <n-icon>
                        <Plus />
                    </n-icon>
                </template>
            </n-button>
            <n-button size="tiny" circle :disabled="messageNum === 1" @click="messageNumChange(-1);">

                <template #icon>
                    <n-icon>
                        <Minus />
                    </n-icon>
                </template>
            </n-button>
        </n-flex>
        <!-- 选项 -->
        <n-flex size="small" :align="'center'" :justify="'end'">
            <n-checkbox v-model:checked="withLoudspeaker" label="附带发出大喇叭" />
            <n-checkbox v-model:checked="hideOlo" label="隐藏olo总额" />
        </n-flex>
    </n-flex>
</template>

<script setup lang="ts">
import { inputNumberFormat, inputNumberParse } from '@/js/func/inputNumberFormat'
import { useCommonStore } from '@/stores/common'
import { FInput, FInputGroupLabel } from '@custom'
import { Minus, Plus } from '@vicons/fa'
import { NButton, NCheckbox, NFlex, NIcon, NInputGroup, NInputNumber, NSelect, NText } from 'naive-ui'
import { computed, ref } from 'vue'

//基础数据
const commonStore = useCommonStore()

//输入数据
const olo = ref<number>(20000)
const num = ref<number>(10)
const hongbaoType = ref<1 | 2>(1) //1=定额红包 2=随机红包
const keyword = ref<string>()
const hongbaoMessage = ref<string[]>([])
const hideOlo = ref<boolean>(false)
const withLoudspeaker = ref<boolean>(false)
const picUrl = ref<string | null>(null)

//加上手续费之后的所需olo数值显示
const olo_total = computed<number>(() => {
    if (commonStore.isDouble11) {
        //双十一是2%税率
        return Math.ceil(olo.value * 1.02)
    }
    if (commonStore.isOctober1st) {
        //国庆0税率（红包个数20及以上时候）
        if (num.value >= 20) {
            return olo.value
        }
        else {
            return Math.ceil(olo.value * 1.07)
        }
    }
    //一般情况7%税率
    return Math.ceil(olo.value * 1.07)
})

//控制留言数量
const messageNum = ref<number>(1)
function messageNumChange(value: 1 | -1) {
    if (value === 1 && messageNum.value < 5) {
        messageNum.value += 1;
    }
    if (value === -1 && messageNum.value > 1) {
        hongbaoMessage.value.splice(messageNum.value - 1, 1)
        messageNum.value -= 1;
    }
}

//NSelect选项
const hongbaoTypeOptions = [
    { value: 1, label: "随机olo" },
    { value: 2, label: "定额olo" },
]

//汇总输入数据返回给父组件
const hongbaoParams = computed(() => ({
    olo: olo.value,
    num: num.value,
    type: hongbaoType.value,
    keyword: keyword.value,
    message: hongbaoMessage.value,
    olo_hide: hideOlo.value,
    loudspeaker: withLoudspeaker.value,
    pic_url: picUrl.value,
}))
defineExpose({ hongbaoParams })

</script>