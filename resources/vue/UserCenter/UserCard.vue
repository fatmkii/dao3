<template>
    <n-card hoverable size="small">
        <n-flex justify="space-around" :vertical="commonStore.isMobile" :size="commonStore.isMobile ? 'small' : 'medium'">
            <n-flex :vertical="!commonStore.isMobile" :align="'start'">
                <img src="https://www.freeimg.cn/i/2024/05/14/664358a77ebfb.png" style="max-height: 40px;">
                <div>
                    <div>
                        <n-text :depth="3">我的饼干</n-text>
                    </div>
                    <div style="display: flex;align-items: center;gap: 4px;">
                        <n-text :depth="2"
                            :style="{ fontSize: commonStore.isMobile ? '0.875rem' : '1rem', cursor: hideBinggan ? 'pointer' : 'auto' }"
                            @click="hideBinggan = false">
                            {{ hideBinggan ? '*点击显示*' : userStore.binggan }}
                        </n-text>
                        <n-icon :size="commonStore.isMobile ? 18 : 20">
                            <Copy style="cursor: pointer;" @click="copyBingganHandle" />
                        </n-icon>
                    </div>
                </div>
            </n-flex>
            <n-flex :vertical="!commonStore.isMobile" :align="'start'">
                <img src="https://www.freeimg.cn/i/2024/05/14/664358a77f040.png" style="max-height: 40px;">
                <div>
                    <div>
                        <n-text :depth="3">饼干等级</n-text>
                    </div>
                    <div>
                        <n-text :depth="2" :style="{ fontSize: commonStore.isMobile ? '0.875rem' : '1rem' }">{{
                            userStore.userData?.binggan.user_lv }}</n-text>
                    </div>
                </div>
            </n-flex>
            <n-flex :vertical="!commonStore.isMobile" :align="'start'">
                <img src="https://www.freeimg.cn/i/2024/05/14/664358a770549.png" style="max-height: 40px;">
                <div>
                    <div>
                        <n-text :depth="3">奥利奥</n-text>
                    </div>
                    <div>
                        <n-text :depth="2" :style="{ fontSize: commonStore.isMobile ? '0.875rem' : '1rem' }">
                            <n-number-animation :from="0" :to="userStore.userData?.binggan.coin" show-separator
                                :duration="2000" />
                        </n-text>
                    </div>
                </div>
            </n-flex>
            <n-flex :vertical="!commonStore.isMobile" :align="'start'">
                <img src="https://www.freeimg.cn/i/2024/05/14/664358a770a06.png" style="max-height: 40px;">
                <div>
                    <div>
                        <n-text :depth="3">粮仓奥利奥</n-text>
                    </div>
                    <div>
                        <n-text :depth="2" :style="{ fontSize: commonStore.isMobile ? '0.875rem' : '1rem' }">
                            <n-number-animation :from="0" :to="userStore.userData?.binggan.coin_in_bank" show-separator
                                :duration="2000" />
                        </n-text>
                    </div>
                </div>
            </n-flex>
        </n-flex>
    </n-card>
</template>

<script setup lang="ts">

import { useCommonStore } from '@/stores/common'
import { useUserStore } from '@/stores/user'
import { CopyOutline as Copy } from '@vicons/ionicons5'
import { NCard, NFlex, NIcon, NNumberAnimation, NText } from 'naive-ui'
import { ref } from 'vue'
import copyToClipboard from '@/js/func/copyToClipboard'

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()

//隐藏饼干
const hideBinggan = ref<boolean>(true)

//复制饼干
function copyBingganHandle() {
    copyToClipboard(userStore.binggan!)
    window.$message.success('已将饼干复制到粘贴板，请保存好喔！')
}

//拉取最新的用户数据（可能会用alova缓存）
userStore.refreshUserData()

</script>