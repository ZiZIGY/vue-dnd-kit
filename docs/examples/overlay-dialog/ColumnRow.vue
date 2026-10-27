<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ name: string }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { id: () => props.name });
</script>

<template>
  <li ref="el" class="column">
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="6" cy="4" r="1.2" /><circle cx="10" cy="4" r="1.2" />
      <circle cx="6" cy="8" r="1.2" /><circle cx="10" cy="8" r="1.2" />
      <circle cx="6" cy="12" r="1.2" /><circle cx="10" cy="12" r="1.2" />
    </svg>
    <span>{{ name }}</span>
  </li>
</template>

<style scoped>
.column {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  border-radius: 9px;
  background: Canvas;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.column:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

[data-dnd-overlay] .column {
  box-shadow:
    inset 0 0 0 1.5px #42b883,
    0 14px 28px -12px rgb(0 0 0 / 0.6);
}

.column[data-dnd-placeholder] {
  opacity: 1;
  background: color-mix(in srgb, currentColor 5%, Canvas);
  box-shadow: none;
}

.column[data-dnd-placeholder] > * {
  visibility: hidden;
}

svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
  opacity: 0.4;
}
</style>
