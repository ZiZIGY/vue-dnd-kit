<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';
import type { DeskFile } from './files';

const props = defineProps<{ file: DeskFile }>();
const el = useTemplateRef<HTMLElement>('el');
// The type is what drop targets check in `accept`.
const { isDragging } = makeDraggable(el, { id: () => props.file.id, type: () => props.file.type });
</script>

<template>
  <div ref="el" class="chip" :class="{ dragging: isDragging }">
    <span class="icon">{{ file.icon }}</span>
    {{ file.name }}
  </div>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px 7px 8px;
  border-radius: 99px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 12%, transparent),
    0 3px 8px -5px rgb(0 0 0 / 0.4);
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.chip:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* The overlay carries the chip: the original stays as a faint outline. */
.chip.dragging {
  opacity: 0.3;
}

.icon {
  font-size: 15px;
}
</style>
