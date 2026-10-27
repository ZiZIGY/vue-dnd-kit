<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ change: { id: string; title: string; approved: boolean } }>();
const el = useTemplateRef<HTMLElement>('el');
// `selected` is the provider's selection for this row: drag a selected row, and every
// selected row comes along.
const { selected } = makeSortableItem(el, { item: () => props.change });
</script>

<template>
  <li ref="el" class="change" :class="{ selected }">
    <input v-model="selected" type="checkbox" :aria-label="`Select ${change.title}`" />
    <span class="title">{{ change.title }}</span>
    <span class="review" :class="{ approved: change.approved }">{{ change.approved ? 'approved' : 'in review' }}</span>
  </li>
</template>

<style scoped>
.change {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
  border-radius: 9px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 11%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.change.selected {
  box-shadow: 0 0 0 1.5px #42b883;
  background: color-mix(in srgb, #42b883 8%, Canvas);
}

.change:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.change[data-dnd-placeholder] {
  opacity: 0.35;
}

input {
  margin: 0;
  accent-color: #42b883;
}

.title {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.review {
  padding: 3px 6px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
  opacity: 0.7;
}

.review.approved {
  background: color-mix(in srgb, #42b883 18%, transparent);
  color: #42b883;
  opacity: 1;
}
</style>
