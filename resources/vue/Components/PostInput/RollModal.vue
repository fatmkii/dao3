<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="Roll点" closable @close="showThis = false"
            size="small">
            <n-flex vertical>
                <n-text>
                    输出参考：
                </n-text>
                <n-text>
                    {{ rollNameInput ? `「${rollNameInput}」，` : "" }}
                    {{ rollEventInput ? `「${rollEventInput}」的结果：` : "" }}
                    {{ `${rollNumInput} d ${rollRangeInput} = 「${rollSimulation}」` }}
                </n-text>
                <n-input-group>
                    <f-input-group-label style="width: 5.2rem;" class="round">Roll点昵称</f-input-group-label>
                    <f-input placeholder="可留空" :maxlength="100" v-model:value="rollNameInput" />
                </n-input-group>
                <n-input-group>
                    <f-input-group-label style="width: 5.2rem;" class="round">Roll点事件</f-input-group-label>
                    <f-input placeholder="可留空" :maxlength="100" v-model:value="rollEventInput" />
                </n-input-group>
                <n-input-group>
                    <f-input-group-label style="width: 5.2rem;" class="round">骰子数量</f-input-group-label>
                    <n-input-number :max="100" :min="1" placeholder="必须填写" v-model:value="rollNumInput" />
                </n-input-group>
                <n-input-group>
                    <f-input-group-label style="width: 5.2rem;" class="round">骰子大小</f-input-group-label>
                    <n-input-number :max="10000" :min="1" placeholder="必须填写" v-model:value="rollRangeInput" />
                </n-input-group>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <f-button type="primary" @click="rollHandle" :disabled="rollPostLoading">Roll it!</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { rollPostPoster, type rollPostParams } from '@/api/methods/posts';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton, FInput, FInputGroupLabel } from '@custom';
import { useRequest } from 'alova';
import { NCard, NFlex, NInputGroup, NInputNumber, NModal, NText } from 'naive-ui';
import { computed, ref } from 'vue';

//基础数据
const commonStore = useCommonStore()
const userStore = useUserStore()

//组件props
interface Props {
    threadId: number,
    forumId: number,
}
const props = withDefaults(defineProps<Props>(), {

})

//模板显示用（骰子模拟）
const rollSimulation = computed(() => {
    let rollSimulation = [];
    if (rollNumInput.value > 0 && rollRangeInput.value > 0) {
        for (var i = 0; i < rollNumInput.value; i++) {
            rollSimulation[i] = Math.floor(Math.random() * rollRangeInput.value) + 1;
        }
        return rollSimulation.join();
    } else {
        return null;
    }
})

//输入数据
const rollNameInput = ref<string>()
const rollEventInput = ref<string>()
const rollNumInput = ref<number>(1)
const rollRangeInput = ref<number>(100)


//来自父组件的唤醒emit
const showThis = ref<boolean>(false)
function show() {
    showThis.value = true
}
defineExpose({ show })


//各种emit
const emit = defineEmits<{
    refreshPostsList: [],
}>()


//Roll点功能
const { loading: rollPostLoading, send: rollPostSend, onSuccess: rollPostOnsuccess } = useRequest(
    (params: rollPostParams) => rollPostPoster(params),
    { immediate: false }
)
function rollHandle() {
    if (!rollNumInput.value) {
        window.$message.error('请填写骰子数量')
        return
    }
    if (!rollRangeInput.value) {
        window.$message.error('请填写骰子数量')
        return
    }
    const params: rollPostParams = {
        binggan: userStore.binggan!,
        thread_id: props.threadId,
        forum_id: props.forumId,
        roll_name: rollNameInput.value,
        roll_event: rollEventInput.value,
        roll_num: rollNumInput.value,
        roll_range: rollRangeInput.value
    }
    rollPostSend(params)
}
rollPostOnsuccess(() => {
    emit('refreshPostsList')
    showThis.value = false
})

</script>
