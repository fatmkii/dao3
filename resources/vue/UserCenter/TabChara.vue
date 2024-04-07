<template>
    <n-flex vertical>
        <n-card title="我的角色" size="small">
            <!-- 卡片头，显示提示和大乱斗角色选择 -->
            <template #header-extra v-if="!userCharaDataLoading && userCharaData.length > 0">
                <n-text :depth="3" style="flex-shrink:0;">
                    选择要编辑的角色
                </n-text>
                <n-select v-model:value="charaSelectedInput" :options="charaSelectedOptions" />
            </template>
            <!-- 没有槽位时候的提示 -->
            <template #header-extra v-if="!userCharaDataLoading && userCharaData.length === 0">
                <n-text :depth="3">
                    你尚未拥有角色槽位，<br v-if="commonStore.isMobile">请在“饼干升级”处购买
                </n-text>
            </template>

            <template v-if="!userCharaDataLoading && userCharaData.length > 0">
                <!-- 导出导入 -->
                <n-flex size="small" :justify="'end'" :align="'center'">
                    <f-button @click="showImportModal = true">导入角色</f-button>
                    <f-button @click="showExportModal = true">导出角色</f-button>
                </n-flex>

                <!-- 表单输入 -->
                <n-form ref="formRef" :model="userCharaData[charaSelectedInput]" label-placement="left"
                    label-width="auto" :rules="inputRules" :size="commonStore.isMobile ? 'small' : 'medium'">

                    <n-grid cols="1 1000:2" :x-gap="12">
                        <!-- 左侧Grid -->
                        <n-gi style="max-width: 500px;">
                            <!-- 角色名框（含导出导入、暂停使用等） -->
                            <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;">
                                <n-text depth="3" style="font-size: 0.875rem;">
                                    角色名
                                </n-text>
                            </n-divider>
                            <n-form-item label="角色名" path="name">
                                <f-input v-model:value="userCharaData[charaSelectedInput].name" placeholder="你的角色的名称" />
                            </n-form-item>
                            <n-form-item label="暂停使用" path="not_use">
                                <n-switch v-model:value="userCharaData[charaSelectedInput].not_use" />
                                <span style="margin-left: 6px;">暂停使用后，大乱斗时不显示选项</span>
                            </n-form-item>

                            <!-- 头像组框 -->
                            <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;">
                                <n-text depth="3" style="font-size: 0.875rem;">
                                    头像组
                                </n-text>
                            </n-divider>
                            <n-form-item v-for="(item, index) in headsInputList" :label="item.label"
                                :path="`heads.${item.varName}`">
                                <f-input v-model:value="userCharaData[charaSelectedInput]['heads'][item.varName]" />
                                <img :src="userCharaData[charaSelectedInput]['heads'][item.varName]"
                                    style="max-height: 34px;">
                            </n-form-item>
                        </n-gi>
                        <!-- 右侧Grid -->
                        <n-gi style="max-width: 500px;">
                            <!-- 战斗语音框 -->
                            <n-divider dashed style="margin-top: 8px;margin-bottom: 8px;">
                                <n-text depth="3" style="font-size: 0.875rem;cursor: pointer;"
                                    @click="showHintModal = true">
                                    战斗语音（使用说明？）
                                </n-text>
                            </n-divider>
                            <n-form-item v-for="n in 10" :label="`骰子${n * 10 - 9}~${n * 10}`"
                                :path="`messages.${n - 1}`">
                                <f-input v-model:value="userCharaData[charaSelectedInput]['messages'][n - 1]" />
                            </n-form-item>
                        </n-gi>
                    </n-grid>
                </n-form>
            </template>
        </n-card>

        <template v-if="!userCharaDataLoading && userCharaData.length > 0">
            <!-- 提交 -->
            <n-flex size="small" :justify="'end'" :align="'center'">
                <n-text :depth="3">
                    各个角色要分别点提交喔
                </n-text>
                <f-button type="primary" :loading="setUserCharaLoading" :disabled="setUserCharaLoading"
                    @click="setUserCharaHandle">提交当前角色</f-button>
            </n-flex>

            <!-- 战斗语音说明的弹出modal -->
            <n-modal v-model:show="showHintModal" display-directive="if">
                <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" closable @close="showHintModal = false"
                    size="small" title="战斗语音使用说明">
                    <h4>骰子语句：</h4>
                    <p>1~10指投出1~10点时候的语句，如此类推。</p>
                    <h4>替换词会被自动替换为相应内容：</h4>
                    <p>%rand_num —— 骰子数字（必须有） <br>
                        %name —— 本角色名字 <br>
                        %opponent —— 对手名字</p>
                </n-card>
            </n-modal>


            <!-- 导入的弹出modal -->
            <n-modal v-model:show="showImportModal" display-directive="if">
                <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" closable @close="showImportModal = false"
                    size="small" title="导入角色数据">
                    <n-flex vertical>
                        <span>将代码填入下述框就可以导入角色数据</span>
                        <n-input v-model:value="charaImportData" type="textarea"
                            style="border-radius: 10px; margin-top: 6px; "
                            :autosize="{ minRows: 3, maxRows: 8 }"></n-input>
                    </n-flex>
                    <template #action>
                        <n-flex justify="end">
                            <f-button @click="charaImportHandle" type="primary">导入</f-button>
                            <f-button @click="showImportModal = false">关闭</f-button>
                        </n-flex>
                    </template>
                </n-card>
            </n-modal>

            <!-- 导出的弹出modal -->
            <n-modal v-model:show="showExportModal" display-directive="if">
                <n-card :style="{ maxWidth: commonStore.modalMaxWidth }" closable @close="showExportModal = false"
                    size="small" title="导出角色数据">
                    <n-flex vertical>
                        <span>可以将下面代码复制下来分享给别人</span>
                        <n-input :value="charaExportData" type="textarea" readonly
                            style="border-radius: 10px; margin-top: 6px; "
                            :autosize="{ minRows: 3, maxRows: 8 }"></n-input>
                    </n-flex>
                    <template #action>
                        <n-flex justify="end">
                            <f-button @click="charaExportCopy">复制</f-button>
                            <f-button @click="showExportModal = false">关闭</f-button>
                        </n-flex>
                    </template>
                </n-card>
            </n-modal>
        </template>
    </n-flex>
</template>

<script setup lang="ts">

import { getUserCharaGetter, setUserCharaPoster, type setUserCharaParams } from '@/api/methods/user'
import copyToClipboard from '@/js/func/copyToClipboard'
import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { FButton, FInput } from '@custom'
import { useRequest } from 'alova'
import { NCard, NDivider, NFlex, NForm, NFormItem, NGi, NGrid, NInput, NModal, NSelect, NSwitch, NText, type FormInst, type FormItemRule, type FormRules } from 'naive-ui'
import { computed, ref } from 'vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const formRef = ref<FormInst | null>(null)
const showHintModal = ref<boolean>(false)
const showImportModal = ref<boolean>(false)
const showExportModal = ref<boolean>(false)
const charaImportData = ref<string>() //导入角色数据用
const charaExportData = computed(() => JSON.stringify(userCharaData.value[charaSelectedInput.value]))

//角色选择的Select
const charaSelectedInput = ref<number>(0)
const charaSelectedOptions = computed(() => userCharaData.value.map((item, index) => ({ value: index, label: item.name })))

//渲染头像组选项用
const headsInputList = [
    { label: '等待', varName: 'wait' },
    { label: '参战', varName: 'against' },
    { label: '攻击', varName: 'attack' },
    { label: '胜利', varName: 'win' },
    { label: '失败', varName: 'lose' },
]

//数据验证规则
const inputRules: FormRules = {
    name: {
        required: true,
        message: '请输入角色名称',
        trigger: 'blur',
    },
    // 各个头像地址的判断
    // reduce还能这样用？
    ...headsInputList.reduce((acc, { label, varName }) => {
        acc[`heads.${varName}`] = {
            required: true,
            message: '请输入头像地址',
            trigger: 'blur',
        };
        return acc;
    }, {} as { [key: string]: any }),
    // 各个骰子大小的战斗语音的判断
    ...Array.from({ length: 10 }, (value, key) => key)
        .reduce((acc, num) => {
            acc[`messages.${num}`] = {
                required: true,
                validator: (rule: FormItemRule, value: string) => {
                    const regExp = /%rand_num/;
                    if (value === null) {
                        return new Error('请输入战斗语音')
                    } else if (!regExp.test(value)) {
                        return new Error('必须包含%rand_num（上面有使用说明）')
                    }
                    return true
                },
                trigger: 'blur',
            };
            return acc;
        }, {} as { [key: string]: any })
}

//导入角色数据
function charaImportHandle() {
    if (charaImportData.value === undefined) {
        window.$message.error('请输入角色数据')
        return
    }
    try {
        userCharaData.value[charaSelectedInput.value] = JSON.parse(charaImportData.value)
    } catch (error) {
        window.$message.error('输入数据的格式有误，请重新尝试')
        return
    }
    window.$message.success('已导入角色数据')
    showImportModal.value = false
}

//导出角色数据复制到剪贴板
function charaExportCopy() {
    copyToClipboard(charaExportData.value)
    window.$message.success('已复制到剪贴板')
}

//获取自定义角色数据
const { loading: userCharaDataLoading, data: userCharaData, send: getUserCharaDataSend } = useRequest(
    (params: setUserCharaParams) => getUserCharaGetter(params),
    { immediate: false, initialData: [] }
);
if (userStore.binggan !== null) {
    getUserCharaDataSend({ binggan: userStore.binggan })
}

//提交自定义大乱斗角色
const { loading: setUserCharaLoading, send: setUserCharaSend } = useRequest(
    (params: setUserCharaParams) => setUserCharaPoster(params),
    { immediate: false }
);
function setUserCharaHandle() {
    formRef.value?.validate((errors) => {
        if (errors) {
            window.$message.error('请确认信息填写完整')
        } else {
            const params: setUserCharaParams = {
                binggan: userStore.binggan!,
                chara_id: charaSelectedInput.value,
                ...userCharaData.value[charaSelectedInput.value],
            }
            setUserCharaSend(params)
        }
    })
}

</script>