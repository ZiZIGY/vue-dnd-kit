<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

export type Tag = 'bug' | 'feature' | 'docs';
export interface Task {
  id: number;
  title: string;
  tag: Tag;
}

const props = defineProps<{ task: Task }>();

const el = useTemplateRef<HTMLElement>('el');
// `label`: screen readers hear "Picked up Keyboard shortcuts", not "item 5".
makeSortableItem(el, { item: () => props.task, label: () => props.task.title });
</script>

<template>
  <li ref="el" class="task">
    <span class="tag" :class="task.tag">{{ task.tag }}</span>
    <span class="title">{{ task.title }}</span>
  </li>
</template>

<style scoped>
.task {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  /* The panel's colour: the overlay, a copy of the row, isn't see-through. */
  background: color-mix(in srgb, currentColor 5%, Canvas);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.task:hover {
  background: color-mix(in srgb, currentColor 9%, Canvas);
}

.task[data-dnd-placeholder] {
  opacity: 1;
  background: color-mix(in srgb, #42b883 10%, Canvas);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 60%, transparent);
}

.task[data-dnd-placeholder] > * {
  visibility: hidden;
}

.tag {
  flex: none;
  width: 56px;
  padding: 3px 0;
  border-radius: 999px;
  font: 600 10px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.04em;
  text-align: center;
  text-transform: uppercase;
}

.bug {
  background: color-mix(in srgb, #ef4444 16%, transparent);
  color: #dc2626;
}

.feature {
  background: color-mix(in srgb, #3b82f6 16%, transparent);
  color: #2563eb;
}

.docs {
  background: color-mix(in srgb, #a855f7 16%, transparent);
  color: #9333ea;
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
