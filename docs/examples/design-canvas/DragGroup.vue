<script setup lang="ts">
import { computed } from 'vue';
import { DragPreview, type DragItem } from '@vue-dnd-kit/core';
import type { DragData } from './editor';

// The overlay of the canvas: the dragged layers as they lie, the grabbed one filling the
// overlay box and the others around it where they are. Each DragPreview is the clone of its
// layer taken at pickup, so the overlay looks just like the canvas, at its zoom.
const props = defineProps<{ items: DragItem[] }>();

const placed = computed(() => {
  const grabbed = props.items[0]!.data as DragData;
  return props.items.map(({ id, data }) => {
    const { left, top } = data as DragData;
    return { id, left: `${left - grabbed.left}px`, top: `${top - grabbed.top}px` };
  });
});
</script>

<template>
  <div class="group">
    <DragPreview v-for="{ id, left, top } in placed" :id="id" :key="id" class="copy" :style="{ left, top }" />
  </div>
</template>

<style scoped>
.group {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Selected layers keep their blue outline while they move. */
.copy {
  position: absolute;
  outline: 1px solid #0d99ff;
}
</style>
