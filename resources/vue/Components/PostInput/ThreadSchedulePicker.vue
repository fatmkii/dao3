<script setup lang="ts">
import { isThreadScheduleDateValid, threadScheduleLabel, threadScheduleRange } from '@/js/func/threadSchedule'
import { FButton } from '@custom'
import dayjs from 'dayjs'
import { NDatePicker, NPopover } from 'naive-ui'
import { ref } from 'vue'

defineProps<{ disabled: boolean }>()
const date = defineModel<string | null>({ required: true })
const show = ref(false)
const calendarStart = ref<number>()

function open(value: boolean) {
    if (value) {
        // Calendar timestamps represent browser-local dates; scheduling uses Beijing dates.
        calendarStart.value = dayjs(date.value ?? threadScheduleRange().first).valueOf()
    }
    show.value = value
}

function select(value: string | null) {
    if (value && !isThreadScheduleDateValid(value)) {
        window.$message.error('预约日期已失效，请重新选择')
        open(true)
        return
    }
    date.value = value
    show.value = false
}
</script>

<template>
    <n-popover :show="show && !disabled" trigger="click" placement="bottom-end" :show-arrow="false"
        :content-style="{ padding: '0' }" @update:show="open">
        <template #trigger>
            <f-button :disabled="disabled">{{ date ? threadScheduleLabel(date) : '预约发送' }}</f-button>
        </template>
        <n-date-picker v-if="show" panel type="date" :formatted-value="date" value-format="yyyy-MM-dd"
            :default-calendar-start-time="calendarStart" :actions="[]"
            :is-date-disabled="timestamp => !isThreadScheduleDateValid(dayjs(timestamp).format('YYYY-MM-DD'))"
            @update:formatted-value="select">
            <template #footer>
                <f-button @click="select(null)">取消预约</f-button>
            </template>
        </n-date-picker>
    </n-popover>
</template>
