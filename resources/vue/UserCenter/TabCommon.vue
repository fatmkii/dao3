<template>
    <n-flex vertical>
        这是TabCommon
        <div>
            {{ commonStore.userCustom.loudspeakerPosition }}
        </div>
        <n-form ref="formRef" :model="userInput" label-placement="left" label-width="auto"
            :size="commonStore.isMobile ? 'small' : 'medium'">
            <n-form-item label="大喇叭位置" path="subtitle">
                <n-select v-model:value="userInput.loudspeakerPosition" :options="loudspeakerPositionOptions"
                    :menu-props="{ style: { borderRadius: '10px' } }" />
            </n-form-item>
        </n-form>
    </n-flex>
</template>

<script setup lang="ts">

import { useTopbarNavControl } from '@/js/func/topbarNav'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { FButton, FCheckbox, FInput } from '@custom'
import { SearchOutline as SearchIcon } from '@vicons/ionicons5'
import { useFetcher, useRequest, useWatcher } from 'alova'
import { NForm, NFormItem, NSelect, NEllipsis, NFlex, NIcon, NSkeleton, NSwitch, NTag, NAlert, NText, useThemeVars } from 'naive-ui'
import { computed, h, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const route = useRoute()
const router = useRouter()
const themeVars = useThemeVars()

//收集表单的输入数据， 最后返回给父组件
const userInput = commonStore.userCustom

//大喇叭放置位置选项
const loudspeakerPositionOptions = [
    { value: 'top', label: '放在顶部' },
    { value: 'center', label: '放在中间' },
    { value: 'bottom', label: '放在底部' },
]

</script>