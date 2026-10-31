<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem, type FlatNode } from '@vue-dnd-kit/core';

const props = defineProps<{
  node: FlatNode<{ id: string; title: string }>;
  number: string;
  indentation: number;
}>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { id: () => props.node.key });
</script>

<template>
  <!-- The margin indents by `indentation` per level, as far as a sideways drag moves. The
       section itself moves with its depth: the overlay lands on its level, a change slides. -->
  <li ref="el" class="section" :class="`level-${node.depth}`" :style="{ marginInlineStart: `${node.depth * indentation}px` }">
    <span class="number">{{ number }}</span>
    <span class="title">{{ node.item.title }}</span>
  </li>
</template>

<style scoped>
.section {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 7px 10px;
  border-radius: 7px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.section:hover {
  background: color-mix(in srgb, currentColor 8%, Canvas);
}

.section:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.level-0 {
  font-size: 14px;
  font-weight: 650;
}

.level-2 .title {
  opacity: 0.75;
}

.number {
  min-width: 2.2em;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

/* The slot, at the depth the section will land at. */
.section[data-dnd-placeholder] {
  opacity: 1;
  background: transparent;
}

.section[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: 1px 2px 1px 4px;
  border: 1.5px dashed #42b883;
  border-radius: 7px;
  background: color-mix(in srgb, #42b883 8%, transparent);
}

.section[data-dnd-placeholder] .title {
  color: #42b883;
}
</style>
