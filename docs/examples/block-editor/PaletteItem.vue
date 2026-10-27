<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import { KINDS, type Block } from './blocks';

const props = defineProps<{ template: Block }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.template });
</script>

<template>
  <li ref="el" class="kind">
    <span class="icon">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="KINDS[template.kind].icon" /></svg>
    </span>
    <span class="text">
      <strong>{{ KINDS[template.kind].name }}</strong>
      <small>{{ KINDS[template.kind].hint }}</small>
    </span>
  </li>
</template>

<style scoped>
.kind {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  cursor: grab;
  user-select: none;
  transition: background 0.15s;
}

.kind:hover {
  background: color-mix(in srgb, currentColor 8%, Canvas);
}

.kind:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

[data-dnd-overlay] .kind {
  background: Canvas;
  box-shadow: 0 12px 24px -10px rgb(0 0 0 / 0.5), 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
}

.icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  border-radius: 7px;
  background: Canvas;
}

svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

strong {
  font-size: 13px;
  font-weight: 600;
}

small {
  overflow: hidden;
  font-size: 11px;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.55;
}
</style>
