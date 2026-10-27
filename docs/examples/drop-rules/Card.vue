<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ pull: { id: string; title: string; approved: boolean } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.pull });
</script>

<template>
  <li ref="el" class="pull">
    <span class="title">{{ pull.title }}</span>
    <span class="state" :class="{ approved: pull.approved }">{{ pull.approved ? '✓ approved' : 'changes requested' }}</span>
  </li>
</template>

<style scoped>
.pull {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 9px 10px;
  border-radius: 9px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 11%, transparent);
  font-size: 12px;
  font-weight: 500;
  cursor: grab;
  user-select: none;
}

.pull:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.pull[data-dnd-placeholder] {
  opacity: 1;
  background: transparent;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 25%, transparent);
}

.pull[data-dnd-placeholder] > * {
  visibility: hidden;
}

.state {
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  color: #e5a00d;
}

.state.approved {
  color: #42b883;
}
</style>
