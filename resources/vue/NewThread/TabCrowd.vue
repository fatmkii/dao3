<template>
    <n-flex vertical style="max-width: 450px; margin-top: 8px;">
        <n-input-group>
            <f-input-group-label style="width: 5.2rem;">众筹项目</f-input-group-label>
            <f-input v-model:value="title" placeholder="必填" />
        </n-input-group>
        <n-input-group>
            <f-input-group-label style="width: 5.2rem;">目标金额</f-input-group-label>
            <n-input-number v-model:value="oloTarget" :max="10000000" :min="100000" :step="100000"
                :parse="inputNumberParse" :format="inputNumberFormat" />
        </n-input-group>
        <n-input-group>
            <f-input-group-label style="width: 5.2rem;">结束日期</f-input-group-label>
            <n-date-picker v-model:formatted-value="endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                :is-date-disabled="dateDisabled" />
        </n-input-group>
    </n-flex>
</template>

<script setup lang="ts">
import { inputNumberFormat, inputNumberParse } from '@/js/func/inputNumberFormat'
import { FInput, FInputGroupLabel } from '@custom'
import dayjs from 'dayjs'
import { NDatePicker, NFlex, NInputGroup, NInputNumber } from 'naive-ui'
import { computed, ref } from 'vue'


//输入数据
const title = ref<string>()
const endTime = ref<string>(dayjs.tz().add(7, 'day').format('YYYY-MM-DD 00:00:00'))
const oloTarget = ref<number>(1000000)

//控制日历的可选时间（1天到1个月）
function dateDisabled(timestamp: number) {
    return dayjs().subtract(1, 'day').isAfter(timestamp) || dayjs().add(1, 'month').isBefore(dayjs(timestamp))
}

//汇总输入数据返回给父组件
const crowdParams = computed(() => ({
    title: title.value,
    olo_target: oloTarget.value,
    end_time: endTime.value,
}))
defineExpose({ crowdParams })

</script>