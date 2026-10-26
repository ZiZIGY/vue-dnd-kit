<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: { id: string; title: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" class="task">
    <span class="title">{{ task.title }}</span>
    <code>{{ task.id }}</code>
  </li>
</template>

<style scoped>
.task {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 14px;
  border: 1px solid color-mix(in srgb, currentColor 16%, transparent);
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 4%, Canvas);
  font-size: 14px;
  cursor: grab;
  user-select: none;
}

.task:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

code {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}
</style>
