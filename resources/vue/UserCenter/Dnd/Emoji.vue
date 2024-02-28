
<template>
  <div :ref="setRef" class="emoji-box draggable" :style="{ opacity }" :data-handler-id="handlerId">
    <img :src="emojiSrc" class="emoji-in-box">
  </div>
</template>


<script lang="ts" setup>
import { computed, ref, unref } from 'vue'
import { useDrag, useDrop } from 'vue3-dnd'
import type { XYCoord, Identifier } from 'dnd-core'
import { toRefs } from '@vueuse/core'

const props = defineProps<{
  emojiSrc: string
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
}>()

interface DragItem {
  index: number
  type: string
}

const card = ref<HTMLDivElement>()
const [dropCollect, drop] = useDrop<
  DragItem,
  void,
  { handlerId: Identifier | null }
>({
  accept: 'emojiImg',
  collect(monitor) {
    return {
      handlerId: monitor.getHandlerId(),
    }
  },
  hover(item: DragItem, monitor) {
    if (!card.value) {
      return
    }
    const dragIndex = item.index
    const hoverIndex = props.index
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = card.value?.getBoundingClientRect()

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

    // Determine mouse position
    const clientOffset = monitor.getClientOffset()

    // Get pixels to the top
    const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // 不知道这里的用处，反而导致水平拖拽有问题。
    // Dragging downwards
    // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    //   return
    // }

    // 不知道这里的用处，反而导致水平拖拽有问题。
    // Dragging upwards
    // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    //   return
    // }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex)

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    item.index = hoverIndex
  },
})

const [collect, drag] = useDrag({
  type: 'emojiImg',
  item: () => {
    return { index: props.index }
  },
  collect: (monitor: any) => ({
    isDragging: monitor.isDragging(),
  }),
})

const { handlerId } = toRefs(dropCollect)
const { isDragging } = toRefs(collect)
const opacity = computed(() => (unref(isDragging) ? 0 : 1))

const setRef = (el: HTMLDivElement) => {
  card.value = drag(drop(el)) as HTMLDivElement
}
</script>

<style lang="scss" scoped>
.draggable {
  cursor: grab;
}
</style>
