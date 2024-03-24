<template>
    <n-modal v-model:show="showThis" display-directive="if">
        <n-card :style="{ maxWidth: maxWidth }" title="跳楼机" closable @close="showThis = false" size="small">
            <n-flex vertical>
                <n-text>
                    最大高度：{{ postsNum }}楼
                </n-text>
                <n-input-group>
                    <f-input-group-label style="width: 3.2rem;" class="round">跳楼</f-input-group-label>
                    <n-input-number placeholder="请输入楼层号" :max="postsNum" v-model:value="floorInput"
                        @keyup.enter="jumpFloorHandle" />
                </n-input-group>
            </n-flex>
            <template #action>
                <n-flex justify="end">
                    <f-button type="primary" @click="jumpFloorHandle" :disabled="!floorInput">Jump!</f-button>
                    <f-button @click="showThis = false">关闭</f-button>
                </n-flex>
            </template>
        </n-card>
    </n-modal>
</template>


<script setup lang="ts">
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { FButton, FInputGroupLabel } from '@custom';
import { NCard, NFlex, NInputGroup, NInputNumber, NModal, NText } from 'naive-ui';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

//基础数据
const commonStore = useCommonStore()
const userStore = useUserStore()
const router = useRouter()

//组件props
interface Props {
    threadId: number,
    postsNum: number,
    page?: number,
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

//输入数据
const floorInput = ref<number>()

//来自父组件的唤醒emit
const showThis = ref<boolean>(false)
function show() {
    showThis.value = true
}
defineExpose({ show })

//跳楼功能
function jumpFloorHandle() {
    if (floorInput.value !== undefined) {
        const toPage = Math.ceil((floorInput.value + 1) / 200)
        const hash = '#f_' + floorInput.value
        router.push({
            name: 'thread', params: {
                threadId: props.threadId,
                page: toPage
            },
            hash: hash
        })
        if (toPage === props.page) {
            //如果跳转目标在同一页，则并没有获取数据，则需要手动跳转到hash位置
            const floorTarget = document.querySelector(hash)
            console.log('hash', hash)
            console.log('floorTarget', floorTarget)
            floorTarget?.scrollIntoView({ block: "center", behavior: "auto" });
            floorTarget?.classList.add('on-focus');//高亮显示该楼层
        }
        showThis.value = false
    }
}


</script>
