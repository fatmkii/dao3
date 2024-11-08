<template>
    <n-flex vertical style="max-width: 450px; margin-top: 8px;">
        <!-- 日期和标题 -->
        <n-input-group>
            <f-input-group-label style="width: 5.2rem;">菠菜标题</f-input-group-label>
            <f-input v-model:value="title" placeholder="必填" />
        </n-input-group>
        <n-input-group>
            <f-input-group-label style="width: 5.2rem;">结束日期</f-input-group-label>
            <n-date-picker v-model:formatted-value="endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                :is-date-disabled="dateDisabled" />
        </n-input-group>
        <span>最长菠菜时间是1个月</span>
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
        <span>菠菜开奖时只能开一个选项（没有多选，因为赔率不会算……）</span>
    </n-flex>
</template>

<script setup lang="ts">
import { FInput, FInputGroupLabel } from '@custom'
import { Minus, Plus } from '@vicons/fa'
import dayjs from 'dayjs'
import { NButton, NDatePicker, NDivider, NFlex, NIcon, NInputGroup, NText } from 'naive-ui'
import { computed, ref } from 'vue'


//输入数据
const title = ref<string>()
const options = ref<string[]>([])
const endTime = ref<string>(dayjs.tz().add(7, 'day').format('YYYY-MM-DD 00:00:00'))

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
    return dayjs().subtract(1, 'day').isAfter(timestamp) || dayjs().add(1, 'month').isBefore(dayjs(timestamp))
}

//汇总输入数据返回给父组件
const gambleParams = computed(() => ({
    title: title.value,
    options: options.value,
    end_time: endTime.value,
}))
defineExpose({ gambleParams })

</script>