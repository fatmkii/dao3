<template>
    <n-flex vertical style="max-width: 450px; margin-top: 8px;">
        <!-- 日期和标题 -->
        <n-input-group>
            <f-input-group-label style="width: 5.2rem;">投票标题</f-input-group-label>
            <f-input v-model:value="title" placeholder="必填" />
        </n-input-group>
        <n-input-group>
            <f-input-group-label style="width: 5.2rem;">结束日期</f-input-group-label>
            <n-date-picker v-model:formatted-value="endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                :is-date-disabled="dateDisabled" />
        </n-input-group>
        <span>最长投票时间是1个月</span>
        <!-- 选项 -->
        <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;" />
        <n-input-group v-for="n in messageNum">
            <f-input-group-label style="width: 5.2rem;">{{ `选项#${n}` }}</f-input-group-label>
            <f-input v-model:value="options[n - 1]" :maxlength="255" />
        </n-input-group>
        <!-- 动态的选项数量增减按钮 -->
        <n-flex size="small" :align="'center'">
            <n-text :depth="3">选项数量</n-text>
            <n-button size="tiny" circle :disabled="messageNum === 20" @click="messageNumChange(1)">
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
        <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;" />
        <n-checkbox v-model:checked="multiple" label="开启多选" />
        <n-input-group v-if="multiple">
            <f-input-group-label style="width: 5.2rem;">最多选择</f-input-group-label>
            <n-input-number v-model:value="maxChoices" :max="messageNum" :min="1" :step="1" />
        </n-input-group>
    </n-flex>
</template>

<script setup lang="ts">
import { FInput, FInputGroupLabel } from '@custom'
import { Minus, Plus } from '@vicons/fa'
import dayjs from 'dayjs'
import { NButton, NCheckbox, NDatePicker, NDivider, NFlex, NIcon, NInputGroup, NInputNumber, NText } from 'naive-ui'
import { computed, ref } from 'vue'


//输入数据
const multiple = ref<boolean>(false)
const maxChoices = ref<number>(1)
const title = ref<string>()
const options = ref<string[]>([])
const endTime = ref<string>(dayjs().add(7, 'day').format('YYYY-MM-DD 00:00:00'))

//控制选项数量
const messageNum = ref<number>(3)
function messageNumChange(value: 1 | -1) {
    if (value === 1 && messageNum.value < 20) {
        messageNum.value += 1;
    }
    if (value === -1 && messageNum.value > 1) {
        options.value.splice(messageNum.value - 1, 1)
        messageNum.value -= 1;
    }
}

//控制日历的可选时间（1天到1个月）
function dateDisabled(timestamp: number) {
    return dayjs().isAfter(timestamp) || dayjs().add(1, 'month').isBefore(dayjs(timestamp))
}

//汇总输入数据返回给父组件
const voteParams = computed(() => ({
    multiple: multiple.value,
    max_choices: multiple ? maxChoices.value : 1,
    title: title.value,
    options: options.value,
    end_time: endTime.value,
}))
defineExpose({ voteParams })

</script>