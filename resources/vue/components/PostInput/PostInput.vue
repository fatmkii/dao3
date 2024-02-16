<template>
    <n-flex vertical>
        <!-- 昵称输入及功能 -->
        <n-flex size="small" :wrap="false" :align="'center'">
            <n-input-group style="max-width: 300px;">
                <f-input-group-label style="width: 3.2rem;">昵称</f-input-group-label>
                <f-input :maxlength="30" v-model:value="nicknameInput" show-count
                    :style="{ color: postWithAdmin ? 'FF6060' : undefined }" />
            </n-input-group>
            <n-dropdown trigger="hover" :options="funcOptions" placement="bottom-start">
                <f-button size="medium" style="flex-shrink:0" :secondary="false">功能</f-button>
            </n-dropdown>
        </n-flex>
        <!-- 标题输入 -->
        <n-input-group v-if="mode === 'thread'">
            <f-input-group-label style="width: 3.2rem;">标题</f-input-group-label>
            <f-input :maxlength="100" v-model:value="titleInput" show-count placeholder="标题内容" />
        </n-input-group>
        <!-- 表情包 -->
        <EmojiTab :auto-hide="emojiAutoHide" :heads-id="0" @append-emoji="emojiAppend" />
        <!-- 功能图标栏 -->
        <n-flex :size="commonStore.isMobile ? 'small' : 'medium'" justify="end" :align="'center'">
            <n-icon :size="commonStore.isMobile ? 28 : 32" v-if="mode === 'post'">
                <!-- 红包 -->
                <Hongbao style="cursor: pointer;" />
            </n-icon>
            <n-icon :size="commonStore.isMobile ? 28 : 32" v-if="mode === 'post'">
                <!-- 大乱斗 -->
                <Game style="cursor: pointer;" />
            </n-icon>
            <n-icon :size="commonStore.isMobile ? 28 : 32" v-if="mode === 'post'">
                <!-- roll点 -->
                <Dice style="cursor: pointer;" />
            </n-icon>
            <n-icon :size="commonStore.isMobile ? 28 : 32">
                <!-- 涂鸦板 -->
                <Draw style="cursor: pointer;" />
            </n-icon>
            <n-icon :size="commonStore.isMobile ? 28 : 32">
                <!-- 代码 -->
                <Code style="cursor: pointer;" />
            </n-icon>
            <n-icon :size="commonStore.isMobile ? 28 : 32">
                <!-- 屏蔽词 -->
                <Mute style="cursor: pointer;" />
            </n-icon>
            <n-icon :size="commonStore.isMobile ? 28 : 32">
                <!-- 撤销 -->
                <Undo style="cursor: pointer;" @click="contentInputRevoke" />
            </n-icon>
            <n-icon :size="commonStore.isMobile ? 28 : 32">
                <!-- 清空 -->
                <Earser style="cursor: pointer;" @click="clearContent" />
            </n-icon>
        </n-flex>
        <!-- 输入框 -->
        <n-input v-model:value="contentInput" type="textarea" placeholder="正文内容" :autosize="{ minRows: 5, maxRows: 10 }"
            ref="contentInputDom" style="border-radius: 10px; " :input-props="{ id: 'content-input' }"
            @change="contentInputChange" @keyup.ctrl.enter="handleCommit($event)" @blur="isTyping = false"
            @focus="isTyping = true" />
        <!-- 提交按钮等 -->
        <n-flex justify="end" :align="'center'">
            <f-button style="margin-right: auto;">上传图片</f-button>
            <f-checkbox v-if="mode === 'thread'" v-model:checked="isDelayInput">延时发送</f-checkbox>
            <n-popover placement="bottom-start" trigger="hover" :disabled="commonStore.isMobile">
                <template #trigger>
                    <f-button type="primary" @click="handleCommit($event)" :loading="handling">提交</f-button>
                </template>
                可以Ctrl+Enter
            </n-popover>
        </n-flex>

    </n-flex>
</template>

<script setup lang="ts">
import { useLocalStorageToRef } from '@/js/func/localStorageToRef'
import showDialog from '@/js/func/showDialog'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { usethemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { FButton, FCheckbox, FInput, FInputGroupLabel } from '@custom'
import { MoneyCollectOutlined as Hongbao, AudioMutedOutlined as Mute } from '@vicons/antd'
import { Code24Regular as Code, DrawShape24Regular as Draw, Eraser24Regular as Earser } from '@vicons/fluent'
import { GameControllerOutline as Game, ArrowUndoOutline as Undo, DiceOutline as Dice } from '@vicons/ionicons5'
import { NDropdown, NFlex, NIcon, NInput, NInputGroup, NPopover, NButton } from 'naive-ui'
import { h, ref, watch } from 'vue'
import EmojiTab from './EmojiTab.vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const themeStore = usethemeStore()
const contentInputDom = ref<HTMLInputElement | null>(null) //输入框的组件引用

//组件props
interface Props {
    mode: 'post' | 'thread',
    disabled: boolean,//可否输入（有时候需要禁止输入？）
    handling: boolean,//是否正在提交的状态
    forumId?: number,
    threadId?: number,
    randomHeadsGroup?: number,
}
const props = withDefaults(defineProps<Props>(), {
    forumId: 0,
    threadId: 0,
    randomHeadsGroup: 1,
})


//用户输入内容
const nicknameInput = ref<string>(userStore.userData.binggan.nickname || '= =')
const titleInput = ref<string>("")
const contentInput = ref<string>("")
const isDelayInput = ref<boolean>(false)
const postWithAdmin = ref<boolean>(false)


//功能选项下拉框
const showPreview = ref<boolean>(false) //实时预览
const emojiAutoHide = useLocalStorageToRef<boolean>('emoji_auto_hide', false) //表情包自动收起
function renderFuncOptions() {
    let options = [
        h(FCheckbox, {
            checked: showPreview.value,
            'onUpdate:checked': (value: boolean) => showPreview.value = value,
            label: "实时预览"
        }),
        h(FCheckbox, {
            checked: emojiAutoHide.value,
            'onUpdate:checked': (value: boolean) => emojiAutoHide.value = value,
            label: "表情包自动收起"
        }),
    ]

    if (userStore.userData.binggan.admin !== 0 && userStore.checkAdminForums(props.forumId)) {
        options.push(
            h(FCheckbox, {
                checked: postWithAdmin.value,
                'onUpdate:checked': (value: boolean) => postWithAdmin.value = value,
                label: "管理员"
            }),
        )
    }

    return h(
        NFlex,
        {
            style: 'padding:6px 8px',
            vertical: true,
        },
        () => options
    )
}
const funcOptions = [
    {
        key: 'funcOption',
        type: 'render',
        render: renderFuncOptions,
    },
]

//监控管理员自动设置昵称
watch(postWithAdmin, (value) => nicknameInput.value = value ? '管理员' : '= =')

//在光标处插入的功能函数
function getCaretPosition(element: HTMLTextAreaElement): number {// 获取光标位置的辅助函数
    return element.selectionStart != null ? element.selectionStart : 0;
}
function insertTextAtCursor(element: HTMLTextAreaElement, text: string): void {
    const caretPos = getCaretPosition(element);
    const currentValue = element.value;
    const newValue =
        currentValue.substring(0, caretPos) + text + currentValue.substring(caretPos);
    contentInput.value = newValue
}

//清空内容
function clearContent() {
    showDialog({ title: '要清空内容吗？', onPositiveClick: () => contentInput.value = '' })
}

//内容撤销上一步的功能
const contentInputHistory = ref<string[]>([''])
function contentInputRevoke() {
    if (contentInputHistory.value.length > 1) {
        //撤回时弹出历史记录
        contentInputHistory.value.pop()
        contentInput.value = contentInputHistory.value.slice(-1)[0]//弹出后再拿最后一个元素
    }
}
function contentInputChange() {
    contentInputHistory.value.push(contentInput.value ?? '')
    //当正文输入发生变化时，往历史记录最后插入记录
    if (contentInputHistory.value.length > 20) {
        //历史记录最多20条，超出则从前面shift
        contentInputHistory.value.shift()
    }
}

//响应子组件的emojiAppend事件
function emojiAppend(emojiSrc: string, isMyEmoji: boolean) {
    const contentInputTextarea = document.getElementById('content-input') as HTMLTextAreaElement
    const className = isMyEmoji ? 'custom-emoji-img' : 'emoji-img'
    insertTextAtCursor(contentInputTextarea, `<img src='${emojiSrc}' class='${className}'>`)
    contentInputChange()//记录一次输入历史
    contentInputTextarea.focus()//返回焦点
}

//响应来自父组件的“回复引用”事件
function quoteHandle(content: string) {
    contentInput.value = content
    contentInputChange()
    contentInputDom.value?.focus()
}


//向父组件发出contentCommit事件
export interface contentCommit {
    nicknameInput: string,
    titleInput: string,
    contentInput: string,
    postWithAdmin: boolean,
    isDelay: boolean,
    ist: boolean,
}
const emit = defineEmits<{
    contentCommit: [content: contentCommit, resolve: (value: any) => void]
}>()
function handleCommit(event: MouseEvent | KeyboardEvent) {
    const promise = new Promise(function (resolve, reject) {
        emit('contentCommit', {
            contentInput: contentInput.value,
            nicknameInput: nicknameInput.value,
            postWithAdmin: postWithAdmin.value,
            titleInput: titleInput.value,
            isDelay: isDelayInput.value,
            ist: event.isTrusted,
        }, resolve)
    });
    promise.then(resetContent)
}

//提交成功后，复位输入内容
function resetContent() {
    titleInput.value = ""
    contentInput.value = ""
    isDelayInput.value = false
}

//确认输入框是否在输入中，并且向父组件返回
const isTyping = ref<boolean>(false)


defineExpose({ quoteHandle, isTyping })

</script>
