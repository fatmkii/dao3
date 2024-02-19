<template>
    <n-card hoverable size="small">
        <n-flex justify="space-around" :vertical="commonStore.isMobile" :size="commonStore.isMobile ? 'small' : 'medium'">
            <n-flex :vertical="!commonStore.isMobile" :align="'start'">
                <img src="https://oss.cpttmm.com/xhg_other/icon_binggan.png" style="max-height: 40px;">
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
                <img src="https://oss.cpttmm.com/xhg_other/icon_binggan_lv.png" style="max-height: 40px;">
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
                <img src="https://oss.cpttmm.com/xhg_other/icon_olo.png" style="max-height: 40px;">
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
                <img src="https://oss.cpttmm.com/xhg_other/icon_bank_olo.png" style="max-height: 40px;">
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

//基础数据
const userStore = useUserStore()
const commonStore = useCommonStore()

//隐藏饼干
const hideBinggan = ref<boolean>(true)

//复制饼干
function copyToClipboard(text: string) { //复制到剪贴板
    if (!navigator.clipboard) {
        // 如果浏览器不支持 Clipboard API，则降级为使用 document.execCommand 方法
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return;
    }
    navigator.clipboard.writeText(text)
}
function copyBingganHandle() {
    copyToClipboard(userStore.binggan!)
    window.$message.success('已将饼干复制到粘贴板，请保存好喔！')
}




</script>