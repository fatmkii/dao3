<template>

    <n-form ref="formRef" :model="userInput" label-placement="left" label-width="auto"
        :size="commonStore.isMobile ? 'small' : 'medium'">
        <n-grid cols="1 600:2" :x-gap="12">
            <n-gi style="max-width: 18rem;">
                <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;">
                    <n-text depth="3" style="font-size: 0.875rem;">外观选项 </n-text>
                </n-divider>
                <n-form-item label="大喇叭位置" path="loudspeakerPosition">
                    <n-select v-model:value="userInput.loudspeakerPosition" :options="loudspeakerPositionOptions"
                        :menu-props="{ style: { borderRadius: '10px' } }" />
                </n-form-item>
                <n-form-item label="单色模式" path="monochromeMode">
                    <n-switch v-model:value="userInput.monochromeMode" />
                </n-form-item>
                <n-form-item label="侧边栏放左边" path="sidebarLeft">
                    <n-switch v-model:value="userInput.sidebarLeft" />
                </n-form-item>
                <n-form-item label="最大引用层数" path="quoteMax">
                    <n-input-number v-model:value="userInput.quoteMax" :max="6" :min="1" :step="1" />
                </n-form-item>
                <n-form-item label="字体大小" path="fontRemSize">
                    <n-input-number v-model:value="userInput.fontRemSize" :max="24" :min="10" :step="1" />
                </n-form-item>

            </n-gi>
            <n-gi style="max-width: 18rem;">
                <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;">
                    <n-text depth="3" style="font-size: 0.875rem;">功能选项 </n-text>
                </n-divider>
                <n-form-item label="图床选择" path="loudspeakerPosition">
                    <n-select v-model:value="userInput.imgHost" :options="imgHostOptions"
                        :menu-props="{ style: { borderRadius: '10px' } }" />
                </n-form-item>
                <n-form-item label="自动涮锅时遇红包停止" path="hongbaoThenStop">
                    <n-switch v-model:value="userInput.hongbaoThenStop" />
                </n-form-item>

            </n-gi>
        </n-grid>
    </n-form>

</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { FButton, FCheckbox, FInput } from '@custom'
import { SearchOutline as SearchIcon } from '@vicons/ionicons5'
import { useFetcher, useRequest, useWatcher } from 'alova'
import { NForm, NFormItem, NSelect, NDivider, NGrid, NGi, NInputNumber, NSwitch, NTag, NAlert, NText, useThemeVars } from 'naive-ui'
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
//图床选项
const imgHostOptions = [
    { value: 'mjj', label: 'mjj' },
    { value: 'imgbb', label: 'imgbb' },
    { value: 'freeimage', label: 'freeimage' },
]

</script>