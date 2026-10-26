<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: { id: number; title: string } }>();

const el = useTemplateRef<HTMLElement>('el');
// The row registers with the list it is rendered in; its key comes from `task.id`.
makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <li ref="el" class="row">
    <span class="grip" aria-hidden="true">⠿</span>
    {{ task.title }}
  </li>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
  background: color-mix(in srgb, currentColor 4%, Canvas);
  cursor: grab;
  user-select: none;
}

.row:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.grip {
  opacity: 0.45;
}
</style>
