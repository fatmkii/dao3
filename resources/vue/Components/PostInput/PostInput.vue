<template>
    <n-flex vertical>
        <!-- 实时预览用组件 -->
        <template v-if="showPreview">
            <n-card v-if="mode === 'thread'" class="thread-title-container" size="small" key="title-card">
                <span class="thread-title" :style="{ fontSize: commonStore.userCustom.fontSizeThreadList + 'px' }">
                    {{ titleInput || '标题预览' }} [0]
                </span>
            </n-card>
            <PostItem :post-data="postDataForPreview" :forum-id="0" :preview-mode="true" />
        </template>
        <!-- 昵称输入及功能 -->
        <n-flex size="small" :wrap="false" :align="'center'"
            :style="{ paddingRight: commonStore.isMobile ? '24px' : '0px' }">
            <n-input-group style="max-width: 300px;">
                <f-input-group-label style="width: 3.2rem;">昵称</f-input-group-label>
                <f-input :maxlength="30" v-model:value="nicknameInput" show-count :input-props="nicknameInputStyle" />
            </n-input-group>
            <n-dropdown :trigger="commonStore.isMobile ? 'click' : 'hover'" :options="funcOptions"
                placement="bottom-start">
                <f-button size="medium" style="flex-shrink:0" :secondary="false">功能</f-button>
            </n-dropdown>
        </n-flex>
        <!-- 标题输入 -->
        <n-input-group v-if="mode === 'thread'">
            <f-input-group-label style="width: 3.2rem;">标题</f-input-group-label>
            <f-input :maxlength="100" v-model:value="titleInput" show-count placeholder="标题内容" />
        </n-input-group>
        <!-- 表情包 -->
        <EmojiTab :auto-hide="emojiAutoHide" :random-heads-group="randomHeadsGroup" @append-emoji="emojiAppend" />
        <!-- 功能图标栏 -->
        <n-flex :size="commonStore.isMobile ? 'small' : 'medium'" justify="end" :align="'center'"
            :style="{ paddingRight: commonStore.isMobile ? '24px' : '0px' }">
            <!-- 不常用涂鸦板和屏蔽词折叠 -->
            <n-dropdown trigger="click" :options="IconOptions" @select="dropdownSelect"
                :size="commonStore.isMobile ? 'medium' : 'large'">
                <n-icon :size="commonStore.isMobile ? 20 : 24" style="cursor: pointer;">
                    <Dropdown />
                </n-icon>
            </n-dropdown>
            <!-- 红包 -->
            <n-popover v-if="mode === 'post'" placement="bottom-start"
                :trigger="commonStore.isMobile ? 'click' : 'hover'">
                <template #trigger>
                    <n-icon :size="commonStore.isMobile ? 28 : 32">
                        <Hongbao style="cursor: pointer;" @click="HongbaoModalCom?.show()" />
                    </n-icon>
                </template>
                发红包
            </n-popover>
            <!-- 大乱斗 -->
            <n-popover v-if="mode === 'post'" placement="bottom-start"
                :trigger="commonStore.isMobile ? 'click' : 'hover'">
                <template #trigger>
                    <n-icon :size="commonStore.isMobile ? 28 : 32">
                        <Game style="cursor: pointer;" @click="BattleModalCom?.show()" />
                    </n-icon>
                </template>
                大乱斗
            </n-popover>
            <!-- roll点 -->
            <n-popover v-if="mode === 'post'" placement="bottom-start"
                :trigger="commonStore.isMobile ? 'click' : 'hover'">
                <template #trigger>
                    <n-icon :size="commonStore.isMobile ? 28 : 32">
                        <Dice style="cursor: pointer;" @click="RollModalCom?.show()" />
                    </n-icon>
                </template>
                Roll点
            </n-popover>
            <!-- 代码 -->
            <n-popover placement="bottom-start" :trigger="commonStore.isMobile ? 'click' : 'hover'">
                <template #trigger>
                    <n-icon :size="commonStore.isMobile ? 28 : 32">
                        <Code style="cursor: pointer;" @click="CodeModalCom?.show()" />
                    </n-icon>
                </template>
                快捷代码
            </n-popover>
            <!-- 分割线 -->
            <n-divider vertical />
            <!-- 撤销 -->
            <n-popover placement="bottom-start" :trigger="commonStore.isMobile ? 'click' : 'hover'">
                <template #trigger>
                    <n-icon :size="commonStore.isMobile ? 28 : 32">
                        <Undo style="cursor: pointer;" @click="contentInputRevoke" />
                    </n-icon>
                </template>
                撤销
            </n-popover>
            <!-- 清空 -->
            <n-popover placement="bottom-start" :trigger="commonStore.isMobile ? 'click' : 'hover'">
                <template #trigger>
                    <n-icon :size="commonStore.isMobile ? 28 : 32">
                        <Earser style="cursor: pointer;" @click="clearContent" />
                    </n-icon>
                </template>
                清空
            </n-popover>
        </n-flex>
        <!-- 输入框 -->
        <n-input v-model:value="contentInput" type="textarea" :placeholder="textareaPlaceHolder" :rows="inputRows"
            ref="contentInputDom" :style="inputStyle" :input-props="{ id: 'content-input' }" :disabled="userIsLocked"
            @change="contentInputChange" @keyup.ctrl.enter="handleCommit($event)" @blur="isTyping = false"
            @focus="isTyping = true" />
        <!-- 提交按钮等 -->
        <n-flex justify="end" :align="'center'">
            <ImageUpload :user-is-locked="userIsLocked" :forum-id="forumId" :thread-id="threadId"
                @insert-image="insertImageHandle" />
            <f-checkbox v-if="mode === 'thread'" v-model:checked="isDelayInput">延时发送</f-checkbox>
            <n-popover placement="bottom-start" trigger="hover" :disabled="commonStore.isMobile">
                <template #trigger>
                    <f-button type="primary" @click="handleCommit($event)" :loading="handling"
                        :disabled="handling || userIsLocked">提交</f-button>
                </template>
                可以Ctrl+Enter
            </n-popover>
        </n-flex>
        <!-- 各种modal -->
        <HongbaoModal ref="HongbaoModalCom" :thread-id="threadId" :forum-id="forumId"
            @refresh-posts-list="emit('refreshPostsList')" />
        <BattleModal ref="BattleModalCom" :thread-id="threadId" :forum-id="forumId"
            :random-heads-group="randomHeadsGroup" @refresh-posts-list="emit('refreshPostsList')" />
        <RollModal ref="RollModalCom" :thread-id="threadId" :forum-id="forumId"
            @refresh-posts-list="emit('refreshPostsList')" />
        <PingbiciModal ref="PingbiciModalCom" />
        <CodeModal ref="CodeModalCom" @insert-code="insertCodeHandle" />
        <DrawerModal ref="DrawerModalCom" @insert-image="insertImageHandle" :user-is-locked="userIsLocked"
            :forum-id="forumId" :thread-id="threadId" />

    </n-flex>
</template>

<script setup lang="ts">
import { renderIcon } from '@/js/func/renderIcon'
import showDialog from '@/js/func/showDialog'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import RollModal from '@/vue/Components/PostInput/RollModal.vue'
import PostItem from '@/vue/Thread/PostItem/PostItem.vue'
import { FButton, FCheckbox, FInput, FInputGroupLabel } from '@custom'
import { MoneyCollectOutlined as Hongbao, AudioMutedOutlined as Mute } from '@vicons/antd'
import { Code24Regular as Code, DrawShape24Regular as Draw, Eraser24Regular as Earser } from '@vicons/fluent'
import { DiceOutline as Dice, EllipsisHorizontal as Dropdown, GameControllerOutline as Game, ArrowUndoOutline as Undo } from '@vicons/ionicons5'
import { useStorage } from '@vueuse/core'
import { NDivider, NDropdown, NFlex, NIcon, NInput, NInputGroup, NPopover, NCard } from 'naive-ui'
import { computed, h, ref, watch } from 'vue'
import BattleModal from './BattleModal.vue'
import CodeModal from './CodeModal.vue'
import DrawerModal from './DrawerModal.vue'
import EmojiTab from './EmojiTab.vue'
import HongbaoModal from './HongbaoModal.vue'
import ImageUpload from './ImageUpload.vue'
import PingbiciModal from './PingbiciModal.vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()

const contentInputDom = ref<HTMLInputElement | null>(null) //输入框的组件引用

//各种Modal
const HongbaoModalCom = ref<InstanceType<typeof HongbaoModal> | null>(null)
const BattleModalCom = ref<InstanceType<typeof BattleModal> | null>(null)
const RollModalCom = ref<InstanceType<typeof RollModal> | null>(null)
const PingbiciModalCom = ref<InstanceType<typeof PingbiciModal> | null>(null)
const CodeModalCom = ref<InstanceType<typeof CodeModal> | null>(null)
const DrawerModalCom = ref<InstanceType<typeof DrawerModal> | null>(null)

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

//输入框style
const inputStyle = computed(() => ({
    fontSize: commonStore.userCustom.fontSizeInput + 'px',
    borderRadius: '10px',
}))
//输入框高度行数
const inputRows = computed(() => {
    const lines = (contentInput.value.match(/\r?\n|\r/g) || []).length + 2;
    if (lines < 5) return 5
    if (lines > 10) return 10
    return lines
})

//用户禁言显示
const textareaPlaceHolder = computed(() => {
    if (userStore.userData.binggan.locked_ttl > 0) {
        return `你的饼干封禁中，将于${Math.floor(userStore.userData.binggan.locked_ttl / 3600) + 1}小时后解封`
    } else {
        return '正文内容'
    }
})
const userIsLocked = computed(() => userStore.userData.binggan.locked_ttl > 0)

//用户输入内容
const nicknameInput = ref<string>(userStore.userData.binggan.nickname || '= =')
const titleInput = ref<string>("")
const contentInput = ref<string>("")
const isDelayInput = ref<boolean>(false)
const postWithAdmin = ref<boolean>(false)

//复位输入内容
function resetInput() {
    nicknameInput.value = userStore.userData.binggan.nickname || '= ='
    titleInput.value = ""
    contentInput.value = ""
    isDelayInput.value = false
    postWithAdmin.value = false
}

//实时预览用的虚拟postData
const postDataForPreview = computed(() => ({
    id: 0,
    created_at: '预览模式',
    is_deleted: 0,//0=正常；1=被用户删除；2=被管理员删除
    thread_id: 0,
    battle_id: null,
    hongbao_id: null,
    floor: 0,
    random_head: 1,
    created_by_admin: 0, //0=一般用户 1=管理员发布，2=系统发布
    content: contentInput.value,
    nickname: nicknameInput.value,
    is_your_post: true,
    hongbao_data: null
}))

//nicknameInput的class式样
const nicknameInputStyle = computed(() => {
    return { class: { 'nickname-input': true, 'admin': postWithAdmin.value } }
})

//“功能”选项下拉框
const showPreview = ref<boolean>(false) //实时预览
const emojiAutoHide = useStorage<boolean>('emoji_auto_hide', false) //表情包自动收起
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
//部分不常用图标按钮的下拉菜单
const IconOptions = [
    { label: '涂鸦板', key: 'draw', icon: renderIcon(Draw, { size: '1.5rem' }) },
    { label: '屏蔽词', key: 'mute', icon: renderIcon(Mute, { size: '1.5rem' }) },
]
function dropdownSelect(name: 'draw' | 'mute') {
    switch (name) {
        case 'mute':
            PingbiciModalCom.value?.show()
            break;
        case 'draw':
            DrawerModalCom.value?.show()
            break;
    }
}

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
function insertTextAtCursorAndLog(text: string) {
    const contentInputTextarea = document.getElementById('content-input') as HTMLTextAreaElement
    insertTextAtCursor(contentInputTextarea, text)
    contentInputChange()//记录一次输入历史
    contentInputTextarea.focus()//返回焦点
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
    const className = isMyEmoji ? 'custom-emoji-img' : 'emoji-img'
    insertTextAtCursorAndLog(`<img src='${emojiSrc}' class='${className}'>`)
}

//响应子组件的insertCode事件
function insertCodeHandle(code: string) {
    insertTextAtCursorAndLog(code)
}

//响应子组件的insertImage事件
function insertImageHandle(imgSrc: string) {
    insertTextAtCursorAndLog(`<img src='${imgSrc}' />`)
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
    contentCommit: [content: contentCommit, resolve: (value: any) => void],
    refreshPostsList: []
}>()
function handleCommit(event: MouseEvent | KeyboardEvent) {
    if (!event.isTrusted) {
        const dialogArgs = {
            title: '错误',
            closable: false,
            content: '请不要用脚本回复喔，可能会被系统判断为脚本并碎饼干。',
            positiveText: '确定',
        }
        window.$dialog.warning(dialogArgs)
        return
    }
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

defineExpose({ quoteHandle, isTyping, resetInput })

</script>