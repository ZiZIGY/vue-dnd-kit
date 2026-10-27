<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: { id: string; title: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" class="task">{{ task.title }}</li>
</template>

<style scoped>
.task {
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 10px;
  border-radius: 8px;
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
</style>
