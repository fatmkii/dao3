<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NFlex } from 'naive-ui'
import randomHeadsData from '@/data/randomHeads'
import { useCommonStore } from '@/stores/common'
import { useThemeStore } from '@/stores/theme'

withDefaults(defineProps<{
    randomHead?: number | null
    randomHeadGroupIndex?: number
    noHeadMode?: boolean
    createdByAdmin?: number
    editCount?: number
}>(), { randomHead: 0, randomHeadGroupIndex: 1, noHeadMode: false, createdByAdmin: 0, editCount: 0 })

const commonStore = useCommonStore()
const themeStore = useThemeStore()
const frameStyle = computed(() => commonStore.userCustom.postLegacyMode ? {
    paddingTop: '6px', paddingBottom: '6px', borderBottom: '1px solid',
    borderColor: themeStore.themeColor.postItemBorderColor,
} : undefined)
const cardStyle = computed(() => !commonStore.userCustom.postLegacyMode
    ? { padding: commonStore.userCustom.postCardPadding + 'px' } : undefined)
const headerStyle = computed(() => ({
    paddingRight: commonStore.isMobile && !commonStore.userCustom.sidebarLeft
        ? (commonStore.userCustom.postLegacyMode ? 20 : 20 - commonStore.userCustom.postCardPadding) + 'px' : '0px',
}))
const footerStyle = computed(() => ({
    marginTop: commonStore.userCustom.postInnerMargin + 'px',
    fontSize: commonStore.userCustom.fontSizeFooter + 'px',
    lineHeight: commonStore.userCustom.fontSizeFooter + 'px',
}))
</script>

<template>
    <component :is="commonStore.userCustom.postLegacyMode ? 'div' : NCard"
        :class="{ card: !commonStore.userCustom.postLegacyMode }" class="post-item"
        :style="frameStyle" :content-style="cardStyle">
        <n-flex size="small" align="center" :style="headerStyle">
            <div v-if="!noHeadMode" class="random-head-container">
                <img :src="randomHeadsData[randomHeadGroupIndex - 1]?.random_heads[randomHead ?? 0]"
                    :class="'head_' + (randomHead ?? 0)" />
            </div>
            <slot name="header" />
            <span v-if="editCount > 0">有{{ editCount }}次修改</span>
            <slot name="actions" />
        </n-flex>
        <slot />
        <n-flex v-if="$slots.footer" :size="[4, 0]" class="post-footer" :style="footerStyle"
            :class="{ 'system-post': createdByAdmin === 2, 'admin-post': createdByAdmin === 1 }">
            <slot name="footer" />
        </n-flex>
    </component>
</template>
