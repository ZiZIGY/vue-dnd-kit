<script setup lang="ts">
import { computed } from 'vue';
import { DragPreview, type DragItem } from '@vue-dnd-kit/core';

// The photos' own overlay: the grabbed one on top of up to two others, fanned out, and
// how many there are.
const props = defineProps<{ items: DragItem[] }>();
const stack = computed(() =>
  props.items
    .slice(0, 3)
    .map((entry, index) => ({ entry, angle: [0, -7, 6][index]!, depth: index }))
    .reverse(),
);
</script>

<template>
  <div class="stack">
    <div v-for="{ entry, angle, depth } in stack" :key="entry.id" class="card" :style="{ rotate: `${angle}deg`, zIndex: 3 - depth }">
      <!-- The library's clone of the photo, at the size of the box. -->
      <DragPreview :id="entry.id" :style="{ width: '100%', height: '100%' }" />
    </div>
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>

<style scoped>
.stack {
  position: relative;
  width: 100%;
  height: 100%;
}

.card {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  box-shadow: 0 14px 26px -12px rgb(0 0 0 / 0.65);
}

.count {
  position: absolute;
  z-index: 4;
  top: -9px;
  right: -9px;
  min-width: 22px;
  padding: 4px 6px;
  box-sizing: border-box;
  border-radius: 99px;
  background: #42b883;
  color: #04130c;
  font: 700 12px/14px system-ui, sans-serif;
  text-align: center;
}
</style>
