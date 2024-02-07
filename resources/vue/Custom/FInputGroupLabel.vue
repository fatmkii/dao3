<template>
    <!-- 很多按钮都是共同式样（圆形/自动大小等）所以统一修改按钮式样 -->
    <n-input-group-label :size="size" v-bind="attrsCombined">
        <!-- 自动继承模板 -->
        <template v-for="(item, key, index) in $slots" :key="index" #[key]>
            <slot :name="key"></slot>
        </template>
    </n-input-group-label>
</template>

<script setup lang="ts">
import { NInputGroupLabel } from 'naive-ui'
import type { InputGroupLabelProps } from 'naive-ui'
import { useCommonStore } from '@/stores/common'
import { useAttrs } from 'vue'
import { computed } from 'vue'

//基础数据
const commonStore = useCommonStore()
const attrs = useAttrs()

//声明props
interface Props extends  /* @vue-ignore */InputGroupLabelProps {//好像编译器不支持ButtonProps，所以这里加了ignore
    round?: boolean
    autoSize?: boolean,
}
const props = withDefaults(defineProps<Props>(), {
    round: true,
    autoSize: false
})

const roundStyle = props.round ?
    {
        'border-bottom-left-radius': '17px',
        'border-top-left-radius': '17px'
    }
    : undefined

//组合透传的attrs和设定默认主题式样的attrs
const attrsCombined = {
    ...attrs,
    style: roundStyle
}

//尺寸
const size = computed<'small' | 'medium' | 'large'>(() => {
    if (props.autoSize) {
        return commonStore.isMobile ? 'small' : 'medium'
    } else {
        return 'medium'
    }
})

</script>