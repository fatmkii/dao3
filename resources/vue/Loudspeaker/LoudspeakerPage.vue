<template>
    <n-flex vertical style="margin-top: 8px;">
        <!-- 题图和发布按钮 -->
        <n-flex size="small" :align="'center'">
            <img :style="{ height: commonStore.isMobile ? '48px' : '64px' }" src="/ui/miku-loudspeaker.png" />
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
        <Pagination v-model:page="page" :last-page="Math.ceil(loudspeakerData.length / pageSize)"
            @update:page="(value) => { if (value !== undefined) page = value }" style="margin-right: auto;" />

        <!-- 大喇叭数据 -->
        <template v-if="loudspeakerData.length > 0">
            <n-card v-for="loudspeaker in loudspeakerData.slice(offset, offset + pageSize)" :key="loudspeaker.id"
                size="small" :bordered="true" class="loudspeaker-card">
                <component :is="loudspeaker.thread_id ? 'router-link' : 'span'" :style="{ color: loudspeaker.color }"
                    style="white-space: pre-wrap;"
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
                        style="cursor: pointer;" @click="repealLoudspeakerHandle(loudspeaker.id, false)">
                        <Delete />
                    </n-icon>
                    <n-icon v-if="!loudspeaker.is_your_loudspeaker" :size="commonStore.isMobile ? 20 : 24"
                        class="loudspeaker-accuse-icon" @click="reportLoudspeakerHandle(loudspeaker)">
                        <Flag />
                    </n-icon>
                    <f-button v-if="userStore.admin.isNormalAdmin" size="tiny" type="warning"
                        @click="showAdminDeleteLoudspeaker(loudspeaker.id)">强制删除</f-button>
                </n-flex>
            </n-card>
        </template>
        <n-empty v-else />

        <!-- 发布大喇叭modal -->
        <NewLoudspeakerModal ref="NewLoudspeakerModalCom" @refresh-loudspeaker="loudspeakerDataSend(params)" />
        <AccuseCreateModal ref="AccuseCreateModalCom" @submit="submitAccuse" />
        <n-modal v-model:show="adminDeleteModalVisible" display-directive="if">
            <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" title="强制删除大喇叭" closable size="small"
                @close="adminDeleteModalVisible = false">
                <n-flex vertical>
                    <n-text>要强制删除这个大喇叭吗？这是管理员功能。</n-text>
                    <f-input v-model:value="adminDeleteReason" placeholder="填写删除理由" :maxlength="255" show-count />
                </n-flex>
                <template #action>
                    <n-flex justify="end">
                        <f-button @click="adminDeleteModalVisible = false">取消</f-button>
                        <f-button type="warning" @click="adminDeleteLoudspeakerHandle">确定</f-button>
                    </n-flex>
                </template>
            </n-card>
        </n-modal>
    </n-flex>
</template>

<script setup lang="ts">

import { accuseCreatePoster, type AccuseCreateParams } from '@/api/methods/accuse'
import { deleteLoudspeakerPoster } from '@/api/methods/admin'
import { newLoudspeakerEnableGetter } from '@/api/methods/globalSetting'
import { loudspeakerDataGetter, repealLoudspeakerPoster, type loudspeakerData, type loudspeakerDataParams } from '@/api/methods/loudspeaker'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import Pagination from '@/vue/Components/Pagination.vue'
import { FButton, FInput } from '@custom'
import { Delete } from '@vicons/carbon'
import { FlagOutlined as Flag } from '@vicons/material'
import { useRequest } from 'alova'
import dayjs from 'dayjs'
import { NCard, NDatePicker, NFlex, NGradientText, NIcon, NPopover, NSwitch, NText, NEmpty, NModal, useThemeVars } from 'naive-ui'
import { computed, ref, shallowRef } from 'vue'
import AccuseCreateModal from '../Accuse/AccuseCreateModal.vue'
import NewLoudspeakerModal from './NewLoudspeakerModal.vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const NewLoudspeakerModalCom = ref<InstanceType<typeof NewLoudspeakerModal> | null>()
const AccuseCreateModalCom = ref<InstanceType<typeof AccuseCreateModal> | null>()
const themeVars = useThemeVars()

//设置浏览器标题
document.title = '大喇叭'

//用户输入
const dateSelected = ref<string>()
const onlyMyLoudspeaker = ref<boolean>(false)
const page = ref<number>(1)
const pageSize = ref<number>(30)
const adminDeleteModalVisible = shallowRef(false)
const adminDeleteLoudspeakerId = shallowRef(0)
const adminDeleteReason = shallowRef('')
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
        if (dateSelected.value && !dayjs.tz(dateSelected.value).isSame(item.effective_date, 'day')) {
            return false
        }
        return true
    })
})


//确认是否可以发布大喇叭
const { data: newLoudspeakerEnable } = useRequest(newLoudspeakerEnableGetter);
const { send: createAccuse } = useRequest((params: AccuseCreateParams) => accuseCreatePoster(params), { immediate: false })

//管理员强制删除大喇叭
function showAdminDeleteLoudspeaker(id: number) {
    adminDeleteLoudspeakerId.value = id
    adminDeleteReason.value = ''
    adminDeleteModalVisible.value = true
}

function adminDeleteLoudspeakerHandle() {
    if (adminDeleteReason.value.trim().length === 0) {
        window.$message.error('请填写删除理由')
        return
    }

    deleteLoudspeakerPoster({
        binggan: userStore.binggan!,
        loudspeaker_id: adminDeleteLoudspeakerId.value,
        content: adminDeleteReason.value.trim(),
    }).then(() => {
        adminDeleteModalVisible.value = false
        loudspeakerDataSend(params)
    })
}

function reportLoudspeakerHandle(loudspeaker: loudspeakerData) {
    AccuseCreateModalCom.value?.show({
        target_type: 'loudspeaker',
        loudspeaker_id: loudspeaker.id,
        loudspeaker_content: loudspeaker.content,
        loudspeaker_color: loudspeaker.color,
    })
}

async function submitAccuse(payload: AccuseCreateParams) {
    await createAccuse(payload)
}

//用户撤回大喇叭
function repealLoudspeakerHandle(id: number, should_confirm: boolean = false) {
    const dialogArgs = {
        title: '撤回大喇叭',
        closable: false,
        content: should_confirm ? `由于已超过5分钟，olo将不会退回，是否接受？` : `要撤回这个大喇叭吗？如果是5分钟内撤回将退回olo`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            repealLoudspeakerPoster({
                binggan: userStore.binggan!,
                loudspeaker_id: id,
                confirm_penalty: should_confirm,
            }).then(
                () => loudspeakerDataSend(params)
            ).catch(
                (error) => {
                    if (error.cause !== undefined && error.cause.code == 21430) {
                        //如果是21430，说明已经超过5分钟，用户必须确认接受不退回olo
                        repealLoudspeakerHandle(id, true)
                    }
                }
            )
        },
    }
    if (should_confirm) {
        window.$dialog.warning(dialogArgs)
    } else {
        window.$dialog.success(dialogArgs)
    }
}
</script>

<style scoped lang="scss">
a {
    color: v-bind('themeVars.textColor1');
}

.loudspeaker-accuse-icon {
    cursor: pointer;
    opacity: 0.55;
}

.loudspeaker-accuse-icon:hover {
    opacity: 0.9;
}
</style>
