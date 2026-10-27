<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ title: string; kind: 'page' | 'link' | 'group' }>();
const el = useTemplateRef<HTMLElement>('el');
// A plain draggable: it stays in the sidebar, the tree's `createItem` makes the new item.
makeDraggable(el, { id: () => `template-${props.kind}`, data: () => ({ title: props.title, kind: props.kind }) });
</script>

<template>
  <div ref="el" class="template">
    <span class="plus" aria-hidden="true">+</span>
    {{ title }}
  </div>
</template>

<style scoped>
.template {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px 8px 8px;
  border: 1px dashed color-mix(in srgb, currentColor 28%, transparent);
  border-radius: 9px;
  background: Canvas;
  font-size: 13px;
  font-weight: 500;
  cursor: grab;
  user-select: none;
}

.template:hover {
  border-color: #42b883;
}

.template:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.plus {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: color-mix(in srgb, #42b883 18%, transparent);
  color: #42b883;
  font-weight: 700;
}
</style>
