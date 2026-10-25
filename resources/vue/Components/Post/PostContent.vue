<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useCommonStore } from '@/stores/common'

const props = defineProps<{ html: string }>()
const emit = defineEmits<{
    elementChange: [element: HTMLSpanElement | null]
    imageClick: [image: HTMLImageElement]
}>()
const commonStore = useCommonStore()
const element = ref<HTMLSpanElement | null>(null)
const style = computed(() => ({ fontSize: commonStore.userCustom.fontSizePost + 'px' }))
watch(element, value => emit('elementChange', value), { flush: 'post' })
onBeforeUnmount(() => emit('elementChange', null))

function handleClick(event: MouseEvent) {
    const target = event.target
    if (!(target instanceof HTMLImageElement)) return
    if (target.classList.contains('img-svg')) {
        const oldSrc = target.getAttribute('src')
        target.setAttribute('src', target.getAttribute('origin-src') ?? '')
        target.setAttribute('origin-src', oldSrc ?? '')
    } else {
        emit('imageClick', target)
    }
}
</script>

<template>
    <span ref="element" v-html="props.html" class="post-span" :style="style" @click="handleClick"></span>
</template>
