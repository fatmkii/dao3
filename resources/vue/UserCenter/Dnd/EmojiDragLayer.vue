<script setup lang="ts">
import type { Identifier, XYCoord } from 'dnd-core'
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import { useDragLayer } from 'vue3-dnd'

interface EmojiDragItem {
  index: number
  emojiSrc: string
}

interface EmojiDragLayerState {
  isDragging: boolean
  itemType: Identifier | null
  item: EmojiDragItem | null
  currentOffset: XYCoord | null
}

const dragState = useDragLayer<EmojiDragLayerState, EmojiDragItem>(monitor => ({
  isDragging: monitor.isDragging(),
  itemType: monitor.getItemType(),
  item: monitor.getItem<EmojiDragItem | null>(),
  currentOffset: monitor.getSourceClientOffset(),
}))

const previewStyle = computed<CSSProperties>(() => {
  const offset = dragState.value.currentOffset

  return offset
    ? { transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }
    : { display: 'none' }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="dragState.isDragging && dragState.itemType === 'emojiImg' && dragState.item"
      class="emoji-drag-layer"
    >
      <div class="emoji-drag-preview" :style="previewStyle">
        <img :src="dragState.item.emojiSrc" class="emoji-in-box" alt="">
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.emoji-drag-layer {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
}

.emoji-drag-preview {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  width: 48px;
  height: 48px;
  will-change: transform;
}
</style>
