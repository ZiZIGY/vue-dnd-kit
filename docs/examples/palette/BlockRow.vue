<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import type { PageBlock } from './blocks';

const props = defineProps<{ block: PageBlock; wide?: boolean }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.block });

// A line drawing per kind of block (24×24).
const ICONS: Record<PageBlock['kind'], string> = {
  title: 'M5 6h14M12 6v13',
  text: 'M4 7h16M4 12h16M4 17h10',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4',
  button: 'M3 8h18v8H3zM8 12h8',
};
</script>

<template>
  <li ref="el" class="row" :class="{ wide }">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="ICONS[block.kind]" /></svg>
    <span>{{ block.name }}</span>
  </li>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  border-radius: 9px;
  background: Canvas;
  font-size: 13px;
  font-weight: 500;
  cursor: grab;
  user-select: none;
}

.row.wide {
  padding: 14px 12px;
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* The slot the block will land in. */
.row[data-dnd-placeholder] {
  opacity: 1;
  border-style: dashed;
  border-color: #42b883;
  background: color-mix(in srgb, #42b883 8%, Canvas);
}

.row[data-dnd-placeholder] > * {
  visibility: hidden;
}

svg {
  flex: none;
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #42b883;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
