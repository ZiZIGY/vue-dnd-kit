<script setup lang="ts">
const ref = useTemplateRef('ref');

const { isDragging } = makeDraggable(ref);
makeAutoScroll(ref);
makeConstraintArea(ref);
makeDroppable(ref);
const { isSelecting, style } = makeSelectionArea(ref);
</script>

<template>
  <div
    ref="ref"
    :style="{
      opacity: isDragging ? 0 : 1,
    }"
  >
    <div v-if="isSelecting" :style />
    <slot />
  </div>
</template>
