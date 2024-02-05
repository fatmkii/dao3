<template>
    <!-- 很多按钮都是共同式样（圆形/自动大小等）所以统一修改按钮式样 -->
    <n-checkbox :size="commonStore.checkBoxSize" v-bind="$attrs">
        <!-- 自动继承模板 -->
        <template v-for="(item, key, index) in $slots" :key="index" #[key]>
            <slot :name="key"></slot>
        </template>
    </n-checkbox>
</template>

<script setup lang="ts">
import { NCheckbox } from 'naive-ui'
import type { CheckboxProps } from 'naive-ui'
import { useCommonStore } from '@/stores/common'

//基础数据
const commonStore = useCommonStore()

//声明props
interface Props extends  /* @vue-ignore */CheckboxProps {//好像编译器不支持ButtonProps，所以这里加了ignore

}
const props = withDefaults(defineProps<Props>(), {

})

</script>