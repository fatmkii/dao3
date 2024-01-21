
<template>
    <heartIcon />
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui'
import { h, computed } from 'vue';
import { Heart, HeartOutline } from '@vicons/ionicons5'
import type { Component } from 'vue';


//组件props
interface Props {
    isFavorite: boolean
    forumId: number
}
const props = withDefaults(defineProps<Props>(), {
    isFavorite: false,
    forumId: 0,
})


//生成icon
const heartIcon = h(NIcon,
    { size: '1.5rem', onClick: starClick, },
    () => h(props.isFavorite ? Heart : HeartOutline)
)

//触发事件
const emit = defineEmits(['favorite-add', 'favorite-cancel'])
function starClick() {
    if (props.isFavorite) {
        emit("favorite-cancel", props.forumId);
    } else {
        emit("favorite-add", props.forumId);
    }
}

</script>
