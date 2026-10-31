<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: { id: string; title: string; who: string; hue: number }; column: string }>();
const el = useTemplateRef<HTMLElement>('el');
// `data` tells the overlay where the task comes from: Done celebrates only new arrivals.
makeSortableItem(el, { item: () => props.task, data: () => ({ column: props.column }) });
</script>

<template>
  <li ref="el" class="task" :class="{ finished: column === 'done' }">
    <span class="check" aria-hidden="true">
      <svg viewBox="0 0 16 16"><path d="m4 8.5 2.5 2.5L12 5.5" /></svg>
    </span>
    <span class="title">{{ task.title }}</span>
    <span class="who" :style="{ '--hue': task.hue }">{{ task.who }}</span>
  </li>
</template>

<style scoped>
.task {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 9%, transparent),
    0 2px 4px -2px rgb(0 0 0 / 0.25);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.task:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* The slot the task will land in. */
.task[data-dnd-placeholder] {
  opacity: 1;
}

.task[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1.5px dashed color-mix(in srgb, currentColor 30%, transparent);
  border-radius: inherit;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.check {
  display: grid;
  flex: none;
  place-items: center;
  width: 16px;
  height: 16px;
  margin-top: 1px;
  border: 1.5px solid color-mix(in srgb, currentColor 30%, transparent);
  border-radius: 50%;
}

.check svg {
  width: 11px;
  height: 11px;
  fill: none;
  stroke: #04130c;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
}

.finished .check {
  border-color: #42b883;
  background: #42b883;
}

.finished .check svg {
  opacity: 1;
}

.title {
  flex: 1;
  line-height: 1.35;
}

.finished .title {
  text-decoration: line-through;
  text-decoration-color: color-mix(in srgb, currentColor 45%, transparent);
  opacity: 0.6;
}

.who {
  flex: none;
  padding: 2px 5px;
  border-radius: 6px;
  background: hsl(var(--hue) 70% 50% / 0.18);
  color: hsl(var(--hue) 60% 45%);
  font-size: 10px;
  font-weight: 700;
}
</style>
