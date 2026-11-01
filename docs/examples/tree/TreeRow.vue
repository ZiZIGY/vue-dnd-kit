<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem, type FlatNode, type Key } from '@vue-dnd-kit/core';
import { weightOf, type Thing } from './types';

const props = defineProps<{ node: FlatNode<Thing>; indent: number }>();
const emit = defineEmits<{ toggle: [key: Key] }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { id: () => props.node.key });

const weight = computed(() => weightOf(props.node.item));
</script>

<template>
  <!-- Indented by its margin, not its padding: the row itself moves with its depth, so the
       overlay takes the slot's width and lands on its level, and a depth change slides. -->
  <div ref="el" class="row" :class="{ container: node.item.container }" :style="{ marginInlineStart: `${node.depth * indent}px` }">
    <!-- One guide per level: left of the row, in its margin. -->
    <span v-for="level in node.depth" :key="level" class="guide" :style="{ left: `${17 - (node.depth - level + 1) * indent}px` }" />
    <button
      v-if="node.item.container"
      type="button"
      class="toggle"
      :class="{ open: !node.collapsed }"
      :aria-label="node.collapsed ? `Open the ${node.item.name}` : `Close the ${node.item.name}`"
      @click="emit('toggle', node.key)"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" /></svg>
    </button>
    <span v-else class="toggle" />
    <span class="icon" aria-hidden="true">{{ node.item.icon }}</span>
    <span class="name">{{ node.item.name }}</span>
    <span class="weight">{{ weight }} kg</span>
  </div>
</template>

<style scoped>
.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding: 0 10px 0 6px;
  border-radius: 8px;
  /* Its own background, the inventory's: the overlay, a copy of the row, isn't see-through. */
  background: color-mix(in srgb, currentColor 3%, Canvas);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.row.container {
  font-weight: 600;
}

.row:hover {
  background: color-mix(in srgb, currentColor 7%, Canvas);
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

/* The slot the dragged row will land in, at the depth it will land at. */
.row[data-dnd-placeholder] {
  opacity: 1;
}

.row[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: 2px 4px 2px 6px;
  border: 1.5px dashed #42b883;
  border-radius: 8px;
  background: color-mix(in srgb, #42b883 8%, Canvas);
}

.guide {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: color-mix(in srgb, currentColor 12%, transparent);
}

/* The overlay is the row alone: its levels stay in the tree. */
[data-dnd-overlay] .guide {
  display: none;
}

[data-dnd-overlay] .row {
  box-shadow: 0 12px 24px -12px rgb(0 0 0 / 0.55);
}

.toggle {
  display: grid;
  flex: none;
  place-items: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: none;
  color: inherit;
  cursor: pointer;
}

.toggle:focus-visible {
  outline: 2px solid #42b883;
}

.toggle svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.55;
  transition: rotate 0.15s;
}

.toggle.open svg {
  rotate: 90deg;
}

.icon {
  font-size: 16px;
  line-height: 1;
}

.name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.weight {
  margin-left: auto;
  font: 400 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}
</style>
