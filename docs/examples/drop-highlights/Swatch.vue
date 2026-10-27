<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ swatch: { id: string; color: string; tone: 'warm' | 'cool' | 'neutral' } }>();
const el = useTemplateRef<HTMLElement>('el');
const { isDragging } = makeDraggable(el, {
  id: () => props.swatch.id,
  type: () => props.swatch.tone,
  data: () => props.swatch,
  keyboard: 'droppables',
});
</script>

<template>
  <div ref="el" class="swatch" :class="{ dragging: isDragging }" :style="{ background: swatch.color }" :aria-label="`${swatch.tone} ${swatch.color}`" />
</template>

<style scoped>
.swatch {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.15), 0 2px 5px -2px rgb(0 0 0 / 0.4);
  cursor: grab;
  transition: scale 0.15s;
}

.swatch:hover {
  scale: 1.08;
}

.swatch:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 3px;
}

.swatch.dragging {
  scale: 0.85;
  opacity: 0.35;
}
</style>
