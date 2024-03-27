<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: maxWidth }" title="大喇叭列表" closable @close="showThis = false" size="small">
            <n-flex vertical :size="[0, 12]" class="loudspeaker-content" style="max-height:75vh;overflow-y:auto;">
                <!-- 大喇叭本体 -->
                <component v-for="(loudspeaker, index) in loudspeakerData" :key="loudspeaker.id"
                    :is="loudspeaker.thread_id ? 'router-link' : 'span'"
                    :style="{ color: commonStore.userCustom.monochromeMode ? themeVars.textColor1 : loudspeaker.color }"
                    :to="loudspeaker.thread_id !== null ? `/thread/${loudspeaker.thread_id}/1` : undefined">
                    {{ index }}. {{ loudspeaker.content }}
                </component>
            </n-flex>

            <template #action>
                <n-flex justify="end">
                    <f-button type="primary" @click="$router.push('/loudspeaker')">去发大喇叭</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { type loudspeakerData } from '@/api/methods/user';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton } from '@custom';
import { NCard, NFlex, NModal, useThemeVars, type FormInst } from 'naive-ui';
import { computed, ref } from 'vue';

//基础数据
const commonStore = useCommonStore()
const userStore = useUserStore()
const formRef = ref<FormInst | null>(null)
const themeVars = useThemeVars()

//组件props
interface Props {
    loudspeakerData: loudspeakerData[]
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

//来自父组件的唤醒emit和传递的payload
const showThis = ref<boolean>(false)
function show() {
    showThis.value = true
}
defineExpose({ show })

</script>
