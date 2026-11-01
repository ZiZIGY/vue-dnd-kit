<script setup lang="ts">
import { computed } from 'vue';
import { DragPreview, type DragItem } from '@vue-dnd-kit/core';
import type { Icon } from './icons';

// The dragged icons as they lie on the desktop: the grabbed one fills the overlay box,
// the others sit where they are from it. Each DragPreview is a clone of its icon, and on
// drop it lands on its icon.
const props = defineProps<{ items: DragItem[] }>();

const placed = computed(() => {
  const grabbed = props.items[0]!.data as Icon;
  return props.items.map(({ id, data }) => {
    const icon = data as Icon;
    return { id, left: `${icon.x - grabbed.x}px`, top: `${icon.y - grabbed.y}px` };
  });
});
</script>

<template>
  <div class="formation">
    <DragPreview v-for="{ id, left, top } in placed" :id="id" :key="id" class="copy" :style="{ left, top }" />
  </div>
</template>

<style scoped>
.formation {
  position: relative;
  width: 100%;
  height: 100%;
}

.copy {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
