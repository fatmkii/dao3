<template>
    <n-flex vertical style="margin-top: 8px;">
        <PostInput ref="postInputCom" mode="thread" :forum-id="forumId" :disabled="false" :handling="newThreadHandling"
            @content-commit="newThreadHandle" />

        <n-tabs type="line" animated :size="commonStore.isMobile ? 'small' : 'medium'" v-model:value="tabValue">
            <n-tab-pane name="常规" tab="常规" display-directive="show">
                <TabCommon :forum-id="props.forumId" ref="TabCommonComponent"></TabCommon>
            </n-tab-pane>
            <n-tab-pane name="红包" tab="红包" display-directive="show">
                <n-checkbox v-model:checked="threadTypeSeleted" checked-value="hongbao" unchecked-value="normal">
                    开启红包
                </n-checkbox>
                <TabHongbao v-if="threadTypeSeleted === 'hongbao'" ref="TabHongbaoCom" />
            </n-tab-pane>
            <n-tab-pane name="投票" tab="投票" display-directive="show">
                <n-checkbox v-model:checked="threadTypeSeleted" checked-value="vote" unchecked-value="normal">
                    开启投票（1000奥利奥）
                </n-checkbox>
                <TabVote v-if="threadTypeSeleted === 'vote'" ref="TabVoteCom" />
            </n-tab-pane>
            <n-tab-pane name="菠菜" tab="菠菜" display-directive="show">
                <n-checkbox v-model:checked="threadTypeSeleted" checked-value="gamble" unchecked-value="normal"
                    :disabled="forumId !== 12">
                    开启菠菜（500奥利奥） 目前只能在海滨乐园岛开菠菜（避免被日清）
                </n-checkbox>
                <TabGamble v-if="threadTypeSeleted === 'gamble'" ref="TabGambleCom" />
            </n-tab-pane>
            <n-tab-pane name="众筹" tab="众筹" display-directive="show" v-if="userStore.checkAdminForums(props.forumId)">
                <n-checkbox v-model:checked="threadTypeSeleted" checked-value="crowd" unchecked-value="normal"
                    :disabled="forumId !== 2">
                    开启众筹（仅管理员可见） 目前只能在小火锅调味区开众筹（避免被日清）
                </n-checkbox>
                <TabCrowd v-if="threadTypeSeleted === 'crowd'" ref="TabCrowdCom" />
            </n-tab-pane>
        </n-tabs>

        <!-- 发送到TopBar的版面标题 -->
        <Teleport to="#topbar-nav" v-if="isActive">
            <router-link :to="{ name: 'forum', params: { forumId: props.forumId } }" class="flex-item-center">
                <n-ellipsis :style="{ maxWidth: commonStore.isMobile ? '120px' : '900px' }" :tooltip="false">
                    {{ forumsStore.forumData(forumId)?.name }}
                </n-ellipsis>
                <n-tag round class="forum-tag" :size="commonStore.isMobile ? 'small' : 'medium'">{{ forumId }}</n-tag>
            </router-link>
        </Teleport>
    </n-flex>
</template>

<script setup lang="ts">
import { newThreadParams, newThreadPoster } from '@/api/methods/threads'
import showDialog from '@/js/func/showDialog'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import type { contentCommit } from '@/vue/Components/PostInput/PostInput.vue'
import PostInput from '@/vue/Components/PostInput/PostInput.vue'
import { NCheckbox, NEllipsis, NFlex, NTabPane, NTabs, NTag } from 'naive-ui'
import { computed, onActivated, onDeactivated, ref } from 'vue'
import { useRouter } from 'vue-router'
import { TabCommon, TabCrowd, TabGamble, TabHongbao, TabVote, type threadType } from './'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const router = useRouter()
const tabValue = ref<string>()//功能选项tabs
const threadTypeSeleted = ref<threadType>('normal')
const postInputCom = ref<InstanceType<typeof PostInput> | null>(null)//输入框组件的ref

//用teleport组件替代掉topbar的“小火锅”
onActivated(() => {
    commonStore.showTopbarNav = false//使Topbar的“小火锅”隐藏
})
onDeactivated(() => {
    commonStore.showTopbarNav = true//使Topbar的“小火锅”显示
})

//因为这个组件用了KeepAlive，这个flag用来判断自身是否处于激活状态
const isActive = ref<boolean>(false)
onActivated(() => { isActive.value = true })
onDeactivated(() => { isActive.value = false })


//设置浏览器标题
document.title = '新主题'

//组件props
interface Props {
    forumId: number //来自路由
}
const props = withDefaults(defineProps<Props>(), {

})

//来自各子组件的输入值
const TabCommonComponent = ref<InstanceType<typeof TabCommon> | null>(null)
const tabNormalInput = computed(() => TabCommonComponent.value?.tabNormalInput)

const TabHongbaoCom = ref<InstanceType<typeof TabHongbao> | null>(null)
const TabCrowdCom = ref<InstanceType<typeof TabCrowd> | null>(null)
const TabGambleCom = ref<InstanceType<typeof TabGamble> | null>(null)
const TabVoteCom = ref<InstanceType<typeof TabVote> | null>(null)

//发送新主题
let newThreadHandling = false
function newThreadHandle(content: contentCommit, resolve: (value: any) => void) {
    // 请求参数
    let params: newThreadParams
    params = {
        binggan: userStore.binggan!,
        forum_id: props.forumId,
        title: content.titleInput,
        content: content.contentInput,
        nickname: content.nicknameInput,
        subtitle: tabNormalInput.value!.subtitle,
        thread_type: threadTypeSeleted.value,
        post_with_admin: content.postWithAdmin,
        anti_jingfen: tabNormalInput.value!.antiJingfen,
        is_delay: content.isDelay,
        is_private: tabNormalInput.value!.isPrivate,
        can_battle: tabNormalInput.value!.canBattle,
        random_heads_group: tabNormalInput.value!.randomHeadsGroup,
        nissin_time: tabNormalInput.value!.nissinTime, //这是天数的数字
        title_color: tabNormalInput.value!.titleColor,
        locked_by_coin: tabNormalInput.value!.lockedByCoin,
        sub_id: tabNormalInput.value!.subId,
    }

    //各种条件判断和追加参数
    if (threadTypeSeleted.value === 'hongbao') { //红包模式
        const hongbaoParams = TabHongbaoCom.value!.hongbaoParams
        if (hongbaoParams.type === 2 && hongbaoParams.olo % hongbaoParams.num !== 0) {
            window.$message.error("选择定额红包时，总额要是红包数量的整倍数喔")
            return
        }
        if (!hongbaoParams.keyword) {
            window.$message.error("必须要输入红包口令")
            return
        }
        params.hongbao_params = {
            ...hongbaoParams,
            keyword: hongbaoParams.keyword! //我上面明明已经判断过了，这里编译器还是会以为是keyword: string | undefined;
        }
    }
    if (threadTypeSeleted.value === 'vote') { //投票模式
        const voteParams = TabVoteCom.value!.voteParams
        if (!voteParams.title) {
            window.$message.error("必须要输入投票标题")
            return
        }
        params.vote_params = {
            ...voteParams,
            title: voteParams.title! //我上面明明已经判断过了，这里编译器还是会以为是title: string | undefined;
        }
    }
    if (threadTypeSeleted.value === 'gamble') { //菠菜模式
        const gambleParams = TabGambleCom.value!.gambleParams
        if (!gambleParams.title) {
            window.$message.error("必须要输入菠菜标题")
            return
        }
        params.gamble_params = {
            ...gambleParams,
            title: gambleParams.title! //我上面明明已经判断过了，这里编译器还是会以为是title: string | undefined;
        }
    }
    if (threadTypeSeleted.value === 'crowd') { //众筹模式
        const crowdParams = TabCrowdCom.value!.crowdParams
        if (!crowdParams.title) {
            window.$message.error("必须要输入众筹标题")
            return
        }
        if (!crowdParams.olo_target) {
            window.$message.error("必须要输入众筹金额")
            return
        }
        params.crowd_params = {
            ...crowdParams,
            title: crowdParams.title! //我上面明明已经判断过了，这里编译器还是会以为是title: string | undefined;
        }
    }
    newThreadHandling = true
    newThreadPoster(params).then((event) => { //因为这里要resolve，所以用.then()处理
        resolve('success')
        newThreadHandling = false
        showDialog(
            {
                title: '已发送主题，是否跳转？',
                mode: 'success',
                onPositiveClick: () => router.push({ name: 'thread', params: { threadId: event.thread_id } })
            })
    })
}

//因为做了KeepAlive，失活前要手动复位内容
onDeactivated(() => {
    threadTypeSeleted.value = 'normal'
    postInputCom.value?.resetInput()
})


</script>