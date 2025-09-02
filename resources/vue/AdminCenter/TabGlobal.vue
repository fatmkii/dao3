<template>
    <n-flex vertical :size="[6, 12]">
        <n-flex size="small">
            <n-text style="width: 6.2rem;">领取饼干开关</n-text>
            <n-switch v-model:value="newBingganEnable" :disabled="!globalSettingDataLoaded"
                @update-value="(value) => setGlobalSettingHandle('new_binggan', value)" />
            <n-text :depth="3" v-show="!globalSettingDataLoaded">读取中</n-text>
        </n-flex>
        <n-flex size="small">
            <n-text style="width: 6.2rem;">大喇叭开关</n-text>
            <n-switch v-model:value="loudspeakerEnable" :disabled="!globalSettingDataLoaded"
                @update-value="(value) => setGlobalSettingHandle('new_loudspeaker', value)" />
            <n-text :depth="3" v-show="!globalSettingDataLoaded">读取中</n-text>
        </n-flex>
        <n-flex size="small">
            <n-text style="width: 6.2rem;">强制打开饼干（慎用）</n-text>
            <n-switch v-model:value="newBingganForceEnable" :disabled="!globalSettingDataLoaded"
                @update-value="(value) => setGlobalSettingHandle('new_binggan_force', value)" />
            <n-text :depth="3" v-show="!globalSettingDataLoaded">读取中</n-text>
        </n-flex>
    </n-flex>
</template>

<script setup lang="ts">

import { setGlobalSettingPoster, type setGlobalSettingParams, globalSettingDataGetter, type globalSettingData as globalSettingDataInterface } from '@/api/methods/admin'
import { useCommonStore } from '@/stores/common'
import { useForumsStore } from '@/stores/forums'
import { useUserStore } from '@/stores/user'
import { FButton, FInputGroupLabel } from '@custom'
import { useRequest } from 'alova'
import { NCard, NFlex, NSwitch, NText, useThemeVars } from 'naive-ui'
import { computed, onMounted, ref, watch } from 'vue'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()
const forumsStore = useForumsStore()
const themeVars = useThemeVars()

//输入的数据
const newBingganEnable = ref<boolean>(false)
const loudspeakerEnable = ref<boolean>(false)
const newBingganForceEnable = ref<boolean>(false)
const globalSettingDataLoaded = ref<boolean>(false)

// 获取全局变量
if (userStore.admin.isSuperAdmin === true) {
    globalSettingDataGetter().then((data) => {
        newBingganEnable.value = data.new_binggan
        loudspeakerEnable.value = data.new_loudspeaker
        newBingganForceEnable.value = data.new_binggan_force
        globalSettingDataLoaded.value = true
    })
}

//提交全局变量
function setGlobalSettingHandle(key: string, value: any) {
    const params: setGlobalSettingParams = {
        binggan: userStore.binggan!,
        key: key,
        value: JSON.stringify(value), //后端做了json_decode
    }
    setGlobalSettingPoster(params).then()
}


</script>

<style lang="scss" scoped>
.banner-box {
    max-width: 550px;
}

.banner-box-sm {
    max-width: 100px;
}


.banner-img {
    width: 100%;
    cursor: pointer;
    transition: opacity 0.3s;

    &:hover {
        opacity: 0.7;
    }
}

.delete-icon {
    position: relative;
    top: 10%;
    left: 10%;
}

.dash-line {
    border: 1px dashed;
    border-color: v-bind('themeVars.textColor1');
}
</style>