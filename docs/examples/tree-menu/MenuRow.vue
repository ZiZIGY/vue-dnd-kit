<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem, type FlatNode } from '@vue-dnd-kit/core';

const props = defineProps<{
  node: FlatNode<{ id: string; title: string; kind: 'page' | 'link' | 'group' }>;
  indent: number;
}>();
const el = useTemplateRef<HTMLElement>('el');
const { indicator } = makeSortableItem(el, { id: () => props.node.key });

// Where the drop goes, around this row: `inside` it (its first child), or a line
// `before` / `after` it, starting at the indentation of the level the drop lands at
// (measured from this row, which is indented to its own level).
const inside = computed(() => indicator.value?.side === 'inside');
const line = computed(() => {
  const value = indicator.value;
  if (!value || value.side === 'inside') return null;
  return { side: value.side, left: `${((value.depth ?? 0) - props.node.depth) * props.indent}px` };
});
</script>

<template>
  <div ref="el" class="item" :class="{ inside }" :style="{ marginLeft: `${node.depth * indent}px` }">
    <svg class="icon" viewBox="0 0 16 16" aria-hidden="true">
      <path v-if="node.item.kind === 'page'" d="M4 1.5h5l3 3v10H4zM9 1.5V5h3" />
      <path v-else-if="node.item.kind === 'link'" d="M6 3.5H3.5v9h9V10M9 2.5h4.5V7M13.5 2.5 7.5 8.5" />
      <path v-else d="M2.5 4h11M2.5 8h11M2.5 12h7" />
    </svg>
    <span class="title">{{ node.item.title }}</span>
    <span class="kind">{{ node.item.kind }}</span>
    <span v-if="line" class="line" :class="line.side" :style="{ left: line.left }" />
  </div>
</template>

<style scoped>
.item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 9px;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
  transition:
    background 0.15s,
    box-shadow 0.15s;
}

.item:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* The row the drop goes into. */
.item.inside {
  background: color-mix(in srgb, #42b883 14%, Canvas);
  box-shadow: 0 0 0 1.5px #42b883;
}

/* The dragged row stays where it is: dim it. */
.item[data-dnd-placeholder] {
  opacity: 0.35;
}

.icon {
  flex: none;
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.7;
}

.title {
  flex: 1;
  font-weight: 500;
}

.kind {
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.45;
}

/* The insertion line, in the 4px gap between rows, from the drop's level to the right edge. */
.line {
  position: absolute;
  right: 0;
  height: 2px;
  border-radius: 1px;
  background: #42b883;
  pointer-events: none;
}

.line::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -4px;
  width: 8px;
  height: 8px;
  box-sizing: border-box;
  border: 2px solid #42b883;
  border-radius: 50%;
  background: Canvas;
}

.line.before {
  top: -3px;
}

.line.after {
  bottom: -3px;
}
</style>
