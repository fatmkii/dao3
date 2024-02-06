<template>
    <!-- 很多按钮都是共同式样（圆形/自动大小等）所以统一修改按钮式样 -->
    <n-input round :size="size" v-bind="$attrs">
        <!-- 自动继承模板 -->
        <template v-for="(item, key, index) in $slots" :key="index" #[key]>
            <slot :name="key"></slot>
        </template>
    </n-input>
</template>

<script setup lang="ts">
import { NInput } from 'naive-ui'
import type { InputProps } from 'naive-ui'
import { useCommonStore } from '@/stores/common'
import { computed } from 'vue'

//基础数据
const commonStore = useCommonStore()

//声明props
interface Props extends  /* @vue-ignore */InputProps {//好像编译器不支持ButtonProps，所以这里加了ignore

}
const props = withDefaults(defineProps<Props>(), {

})

//尺寸
const size = computed<'small' | 'medium' | 'large'>(() => commonStore.isMobile ? 'small' : 'medium')

</script>