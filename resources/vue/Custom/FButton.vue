<template>
    <!-- 很多按钮都是共同式样（圆形/自动大小等）所以统一修改按钮式样 -->
    <n-button round :size="size" v-bind="attrsCombined">
        <!-- 自动继承模板 -->
        <template v-for="(item, key, index) in $slots" :key="index" #[key]>
            <slot :name="key"></slot>
        </template>
    </n-button>
</template>

<script setup lang="ts">
import { NButton, type ButtonProps } from 'naive-ui'
import { useCommonStore } from '@/stores/common'
import { useThemeStore } from '@/stores/theme'
import { useAttrs, computed } from 'vue'

//基础数据
const commonStore = useCommonStore()
const themeStore = useThemeStore()
const attrs = useAttrs()

//声明props
interface Props extends  /* @vue-ignore */ButtonProps {//好像编译器不支持ButtonProps，所以这里加了ignore

}
const props = withDefaults(defineProps<Props>(), {

})

//组合透传的attrs和设定默认主题式样的attrs
const attrsCombined = computed(() => {
    return {
        ...attrs,
        ...themeStore.buttonThemeAttr
    }
})

//尺寸
const size = computed<'tiny' | 'small' | 'medium' | 'large'>(() => commonStore.isMobile ? 'small' : 'medium')

</script>