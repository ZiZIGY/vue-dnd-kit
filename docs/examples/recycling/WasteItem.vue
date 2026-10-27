<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';
import type { Waste } from './waste';

const props = defineProps<{ waste: Waste; small?: boolean }>();
const el = useTemplateRef<HTMLElement>('el');
const { isDragging } = makeDraggable(el, {
  id: () => props.waste.id,
  type: () => props.waste.type, // matched against the bins' `accept`
  data: () => props.waste, // read by the compost bin's rule
  keyboard: 'droppables', // arrows jump between the bins that take it
});
</script>

<template>
  <div ref="el" class="waste" :class="{ small, dragging: isDragging }" :aria-label="waste.name">
    <span class="emoji" aria-hidden="true">{{ waste.emoji }}</span>
    <span v-if="!small" class="name">{{ waste.name }}</span>
  </div>
</template>

<style scoped>
.waste {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 5px;
  border-radius: 99px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 12%, transparent),
    0 2px 4px -2px rgb(0 0 0 / 0.3);
  font-size: 13px;
  font-weight: 500;
  cursor: grab;
  user-select: none;
}

.waste.small {
  padding: 4px;
}

.waste:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* Where it was picked up from, while it travels. */
.waste.dragging {
  opacity: 0.25;
}

.emoji {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: color-mix(in srgb, currentColor 7%, transparent);
  font-size: 16px;
  line-height: 1;
}

.small .emoji {
  width: 24px;
  height: 24px;
  font-size: 14px;
}
</style>
