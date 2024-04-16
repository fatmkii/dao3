<template>
    <n-flex vertical style="margin-top: 8px;">
        <!-- 题图和发布按钮 -->
        <n-flex size="small" :align="'center'">
            <img :style="{ height: commonStore.isMobile ? '48px' : '64px' }"
                src="https://ll4484.bvimg.com/21501/47292a78bd68f016.png" />
            <n-gradient-text :style="{ fontSize: commonStore.isMobile ? '16px' : '20px' }"
                :gradient="{ from: '#7fcab9', to: '#99b1c5' }">
                爱乃是盲目～🎵
            </n-gradient-text>

            <n-popover placement="bottom" trigger="hover" :disabled="newLoudspeakerEnable">
                <template #trigger>
                    <f-button type="primary" :disabled="!newLoudspeakerEnable" @click="NewLoudspeakerModalCom?.show()"
                        style="margin-left: auto;">发布大喇叭</f-button>
                </template>
                <n-text>嗷！目前暂停发布大喇叭…… </n-text>
            </n-popover>
        </n-flex>

        <!-- 日期筛选和仅自己选项 -->
        <n-flex size="small" :justify="'end'" :align="'center'">

            <n-text>只看自己</n-text>
            <n-switch v-model:value="onlyMyLoudspeaker" />
            <n-date-picker v-model:formatted-value="dateSelected" value-format="yyyy-MM-dd" type="date" clearable
                placeholder="筛选生效日期" :size="commonStore.isMobile ? 'small' : 'medium'" />
        </n-flex>

        <!-- 分页器 -->
        <Pagination v-model:page="page" :last-page="Math.floor(loudspeakerData.length / pageSize)"
            @update:page="(value) => page = value" style="margin-right: auto;" />

        <!-- 大喇叭数据 -->
        <template v-if="loudspeakerData.length > 0">
            <n-card v-for="loudspeaker in loudspeakerData.slice(offset, offset + pageSize)" :key="loudspeaker.id"
                size="small" :bordered="true" class="loudspeaker-card">
                <component :is="loudspeaker.thread_id ? 'router-link' : 'span'" :style="{ color: loudspeaker.color }"
                    :to="loudspeaker.thread_id !== null ? `/thread/${loudspeaker.thread_id}/1` : undefined">
                    {{ loudspeaker.content }}
                </component>
                <n-flex size="small">
                    <span>
                        <n-text :depth="3">生效：</n-text>
                        <n-text>{{ loudspeaker.effective_date }}</n-text>
                    </span>
                    <span>
                        <n-text :depth="3">到期：</n-text>
                        <n-text>{{ loudspeaker.expire_date }}</n-text>
                    </span>
                    <div style="margin-left: auto;"></div>
                    <n-icon v-if="loudspeaker.is_your_loudspeaker" :size="commonStore.isMobile ? 20 : 24"
                        style="cursor: pointer;" @click="repealLoudspeakerHandle(loudspeaker.id)">
                        <Delete />
                    </n-icon>
                    <f-button v-if="userStore.admin.isNormalAdmin" size="tiny" type="warning"
                        @click="adminDeleteLoudspeakerHandle(loudspeaker.id)">强制删除</f-button>
                </n-flex>
            </n-card>
        </template>
        <n-empty v-else />

        <!-- 发布大喇叭modal -->
        <NewLoudspeakerModal ref="NewLoudspeakerModalCom" @refresh-loudspeaker="loudspeakerDataSend(params)" />
    </n-flex>
</template>

<script setup lang="ts">

import { deleteLoudspeakerPoster } from '@/api/methods/admin'
import { newLoudspeakerEnableGetter } from '@/api/methods/globalSetting'
import { loudspeakerDataGetter, repealLoudspeakerPoster, type loudspeakerDataParams } from '@/api/methods/loudspeaker'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import Pagination from '@/vue/Components/Pagination.vue'
import { FButton } from '@custom'
import { Delete } from '@vicons/carbon'
import { useRequest } from 'alova'
import dayjs from 'dayjs'
import { NCard, NDatePicker, NFlex, NGradientText, NIcon, NPopover, NSwitch, NText, NEmpty, useThemeVars } from 'naive-ui'
import { computed, ref } from 'vue'
import NewLoudspeakerModal from './NewLoudspeakerModal.vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const NewLoudspeakerModalCom = ref<InstanceType<typeof NewLoudspeakerModal> | null>()
const themeVars = useThemeVars()

//用户输入
const dateSelected = ref<string>()
const onlyMyLoudspeaker = ref<boolean>(false)
const page = ref<number>(1)
const pageSize = ref<number>(30)
const offset = computed(() => (page.value - 1) * pageSize.value)

//获取大喇叭数据
const params: loudspeakerDataParams = {
    binggan: userStore.binggan!,
    mode: 'all'
}
const { loading: loudspeakerDataLoading,
    data: loudspeakerDataRaw,
    send: loudspeakerDataSend } = useRequest(
        (params: loudspeakerDataParams) => loudspeakerDataGetter(params), { immediate: false, initialData: [] }
    );
loudspeakerDataSend(params)
const loudspeakerData = computed(() => {
    return loudspeakerDataRaw.value.filter((item) => {
        if (onlyMyLoudspeaker.value && !item.is_your_loudspeaker) {
            return false
        }
        if (dateSelected.value && !dayjs(dateSelected.value).isSame(item.effective_date, 'day')) {
            return false
        }
        return true
    })
})


//确认是否可以发布大喇叭
const { data: newLoudspeakerEnable } = useRequest(newLoudspeakerEnableGetter);

//管理员强制删除大喇叭
function adminDeleteLoudspeakerHandle(id: number) {
    const dialogArgs = {
        title: '强制删除大喇叭',
        closable: false,
        content: `要强制删除这个大喇叭吗？这是管理员功能。`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            deleteLoudspeakerPoster({
                binggan: userStore.binggan!,
                loudspeaker_id: id,
            }).then(
                () => loudspeakerDataSend(params)
            )
        },
    }
    window.$dialog.warning(dialogArgs)
}

//用户撤回大喇叭
function repealLoudspeakerHandle(id: number) {
    const dialogArgs = {
        title: '撤回大喇叭',
        closable: false,
        content: `要撤回这个大喇叭吗？花费的奥利奥不会退回喔`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            repealLoudspeakerPoster({
                binggan: userStore.binggan!,
                loudspeaker_id: id,
            }).then(
                () => loudspeakerDataSend(params)
            )
        },
    }
    window.$dialog.warning(dialogArgs)
}
</script>

<style scoped lang="scss">
a {
    color: v-bind('themeVars.textColor1');
}
</style>