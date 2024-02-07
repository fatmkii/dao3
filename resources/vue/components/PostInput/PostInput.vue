<template>
    <n-flex vertical>
        <!-- 昵称输入及功能 -->
        <n-flex size="small" :wrap="false" :align="'center'">
            <n-input-group style="max-width: 300px;">
                <f-input-group-label style="width: 3.2rem;">昵称</f-input-group-label>
                <f-input :maxlength="30" v-model:value="nicknameInput" show-count
                    :style="{ color: postAsAdmin ? 'FF6060' : undefined }" />
            </n-input-group>
            <n-dropdown trigger="hover" :options="funcOptions" placement="bottom-start">
                <f-button size="medium" style="flex-shrink:0">功能</f-button>
            </n-dropdown>
        </n-flex>
        <!-- 标题输入 -->
        <n-input-group v-if="mode === 'thread'">
            <f-input-group-label style="width: 3.2rem;">标题</f-input-group-label>
            <f-input :maxlength="100" v-model:value="titleInput" show-count placeholder="标题内容" />
        </n-input-group>
        <!-- 表情包 -->
        <EmojiTab :auto-hide="false" :heads-id="0" @append-emoji="console.log('//TODO')" />
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
            style="border-radius: 10px;" @change="contentInputChange" id="content-input" />
        <!-- 提交按钮等 -->
        <n-flex justify="end" :align="'center'">
            <f-button style="margin-right: auto;">上传图片</f-button>
            <f-checkbox v-if="mode === 'thread'">延时发送</f-checkbox>
            <f-button type="primary">提交</f-button>
        </n-flex>

    </n-flex>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { usethemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { useLocalStorageToRef } from '@/js/func/localStorageToRef'
import { FButton, FCheckbox, FInput, FInputGroupLabel } from '@custom'
import showDialog from '@/js/func/showDialog'
import { AudioMutedOutlined as Mute, MoneyCollectOutlined as Hongbao } from '@vicons/antd'
import { Code24Regular as Code, DrawShape24Regular as Draw, Eraser24Regular as Earser } from '@vicons/fluent'
import { ArrowUndoOutline as Undo, GameControllerOutline as Game } from '@vicons/ionicons5'
import { NFlex, NIcon, NInput, NInputGroup, NDropdown } from 'naive-ui'
import { ref, h, watch, VNode } from 'vue'
import EmojiTab from './EmojiTab.vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const themeStore = usethemeStore()

//组件props
interface Props {
    mode: 'post' | 'thread',
    disabled: boolean,//可否输入（正在处理提交时设false）
    handling: boolean,//是否正常提交的状态
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
const titleInput = ref<string>()
const contentInput = ref<string>()


//功能选项下拉框
const showPreview = ref<boolean>(false) //实时预览
const emojiAutoHide = useLocalStorageToRef<boolean>('emoji_auto_hide', false) //表情包自动收起
const postAsAdmin = ref<boolean>(false)
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

    if (userStore.userData.binggan.admin !== 0 && userStore.userData.binggan.admin_forums?.includes(props.forumId)) {
        options.push(
            h(FCheckbox, {
                checked: postAsAdmin.value,
                'onUpdate:checked': (value: boolean) => postAsAdmin.value = value,
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
watch(postAsAdmin, (value) => nicknameInput.value = value ? '管理员' : '= =')

//在光标处插入的功能函数
function getCaretPosition(element: HTMLTextAreaElement): number {// 获取光标位置的辅助函数
    return element.selectionStart != null ? element.selectionStart : 0;
}
function insertTextAtCursor(element: HTMLTextAreaElement, text: string): void {
    const caretPos = getCaretPosition(element);
    const currentValue = element.value;
    const newValue =
        currentValue.substring(0, caretPos) + text + currentValue.substring(caretPos);
    element.value = newValue;
    element.setSelectionRange(caretPos + text.length, caretPos + text.length);
}

//清空内容
function clearContent() {
    showDialog('要清空内容吗？', () => contentInput.value = '')
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

</script>
