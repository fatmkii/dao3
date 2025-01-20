<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="大喇叭列表" closable @close="showThis = false"
            size="small">
            <n-flex vertical :size="[0, 12]" class="loudspeaker-content" style="max-height:75vh;overflow-y:auto;">
                <!-- 大喇叭本体 -->
                <component v-for="(loudspeaker, index) in loudspeakerData" :key="loudspeaker.id"
                    :is="loudspeaker.thread_id ? 'router-link' : 'span'"
                    :style="{ color: commonStore.userCustom.monochromeMode ? themeVars.textColor1 : loudspeaker.color }"
                    style="white-space: pre-wrap;"
                    :to="loudspeaker.thread_id !== null ? `/thread/${loudspeaker.thread_id}/1` : undefined">
                    {{ index }}. {{ loudspeaker.content }}
                </component>
            </n-flex>

            <template #action>
                <n-flex justify="end">
                    <f-button type="primary" @click="pushHandle">去发大喇叭</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { type loudspeakerData } from '@/api/methods/loudspeaker';
import { useCommonStore } from '@/stores/common';
import { FButton } from '@custom';
import { NCard, NFlex, NModal, useThemeVars } from 'naive-ui';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

//基础数据
const commonStore = useCommonStore()
const themeVars = useThemeVars()
const router = useRouter()

//组件props
interface Props {
    loudspeakerData: loudspeakerData[]
}
const props = withDefaults(defineProps<Props>(), {

})

//来自父组件的唤醒emit和传递的payload
const showThis = ref<boolean>(false)
function show() {
    showThis.value = true
}
defineExpose({ show })

//去发大喇叭按钮
function pushHandle() {
    router.push('/loudspeaker')
    showThis.value = false
}

</script>

<style scoped lang="scss">
a {
    color: v-bind('themeVars.textColor1');
}
</style>