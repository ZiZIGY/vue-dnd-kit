<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import type { Stop } from './trip';

const props = defineProps<{ stop: Stop }>();
const el = useTemplateRef<HTMLElement>('el');
// `selected` lives in the provider's selection: drag one selected stop, and they all come.
const { selected } = makeSortableItem(el, { item: () => props.stop });

const onClick = (event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
};
</script>

<template>
  <li ref="el" class="stop" :class="{ selected }" :style="{ '--tone': stop.tone }" @click="onClick">
    <span class="time">{{ stop.time }}</span>
    <span class="title">{{ stop.title }}</span>
  </li>
</template>

<style scoped>
.stop {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px 9px 14px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 9%, transparent),
    0 2px 4px -2px rgb(0 0 0 / 0.25);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

/* A stripe in the stop's colour. */
.stop::before {
  content: '';
  position: absolute;
  top: 9px;
  bottom: 9px;
  left: 6px;
  width: 3px;
  border-radius: 2px;
  background: var(--tone);
}

.stop:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.stop.selected {
  background: color-mix(in srgb, #42b883 12%, Canvas);
  box-shadow: 0 0 0 2px #42b883;
}

/* The slots the dragged stops will land in. */
.stop[data-dnd-placeholder] {
  background: none;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 22%, transparent);
}

.stop[data-dnd-placeholder] > *,
.stop[data-dnd-placeholder]::before {
  visibility: hidden;
}

[data-dnd-overlay] .stop {
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 14%, transparent),
    0 14px 24px -12px rgb(0 0 0 / 0.5);
}

.time {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

.title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
