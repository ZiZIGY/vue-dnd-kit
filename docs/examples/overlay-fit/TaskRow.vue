<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: { id: string; title: string; project: string; time: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" class="task">
    <span class="check" />
    <span class="title">{{ task.title }}</span>
    <span class="project" :style="{ background: task.project }" />
    <span class="time">{{ task.time }}</span>
  </li>
</template>

<style scoped>
/* A flex row: at any width or height the overlay box takes, it lays out again. */
.task {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  height: 38px;
  padding: 0 10px;
  border-radius: 9px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.task:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

[data-dnd-overlay] .task {
  box-shadow:
    0 0 0 1.5px #42b883,
    0 14px 28px -12px rgb(0 0 0 / 0.5);
}

.task[data-dnd-placeholder] {
  opacity: 1;
}

.task[data-dnd-placeholder] > * {
  visibility: hidden;
}

.task[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1.5px dashed color-mix(in srgb, currentColor 30%, transparent);
  border-radius: inherit;
}

.check {
  flex: none;
  width: 14px;
  height: 14px;
  border: 1.5px solid color-mix(in srgb, currentColor 35%, transparent);
  border-radius: 50%;
}

.title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.project {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.time {
  flex: none;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}
</style>
