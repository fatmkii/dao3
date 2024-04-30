<template>
    <n-card title="一般设定" size="small">
        <template #header-extra>
            <n-text :depth="3">这些设定保存在本设备，不跟随饼干</n-text>
        </template>
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
                        <n-input-number v-model:value="userInput.quoteMax" placeholder="3" :max="6" :min="1"
                            :step="1" />
                    </n-form-item>
                    <n-form-item label="字体大小" path="fontRemSize">
                        <n-input-number v-model:value="userInput.fontRemSize" placeholder="16" :max="20" :min="12"
                            :step="0.5" />
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
                    <n-form-item label="自动涮锅时页面不动" path="holdPageWhenListening">
                        <n-switch v-model:value="userInput.holdPageWhenListening" />
                    </n-form-item>
                    <n-form-item label="减少弹出提示" path="lessToast">
                        <n-switch v-model:value="userInput.lessToast" />
                    </n-form-item>
                </n-gi>
            </n-grid>
        </n-form>
    </n-card>

</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores/common'
import { NDivider, NForm, NFormItem, NGi, NGrid, NInputNumber, NSelect, NSwitch, NText, NCard } from 'naive-ui'

//基础数据
const commonStore = useCommonStore()


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