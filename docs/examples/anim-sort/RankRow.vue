<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ idea: { id: string; title: string; votes: number } }>();
const el = useTemplateRef<HTMLElement>('el');
// `index` is the row's place in the draft: the ranks change while you drag.
const { index } = makeSortableItem(el, { item: () => props.idea });
</script>

<template>
  <li ref="el" class="row">
    <span class="rank">{{ index + 1 }}</span>
    <span class="title">{{ idea.title }}</span>
    <span class="votes">▲ {{ idea.votes }}</span>
  </li>
</template>

<style scoped>
.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

[data-dnd-overlay] .row {
  box-shadow:
    0 0 0 1.5px #42b883,
    0 16px 28px -12px rgb(0 0 0 / 0.55);
}

.row[data-dnd-placeholder] {
  opacity: 1;
  background: color-mix(in srgb, #42b883 8%, Canvas);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 45%, transparent);
}

.row[data-dnd-placeholder] > :not(.rank) {
  visibility: hidden;
}

.rank {
  display: grid;
  flex: none;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 600 12px/1 ui-monospace, Menlo, Consolas, monospace;
}

.title {
  flex: 1;
  font-weight: 500;
}

.votes {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}
</style>
