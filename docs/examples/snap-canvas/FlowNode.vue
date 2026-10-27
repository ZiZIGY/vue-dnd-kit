<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable, snapToGrid } from '@vue-dnd-kit/core';

const props = defineProps<{
  node: { id: string; text: string; shape: string; x: number; y: number };
  grid: number;
  smooth: boolean;
}>();

const el = useTemplateRef<HTMLElement>('el');
// The node's corner snaps to grid lines drawn from its parent's corner (`origin: 'container'`).
// `smooth` glides the overlay from cell to cell; targets use the snapped place at once.
const { isDragging } = makeDraggable(el, {
  id: () => props.node.id,
  modifiers: () => [snapToGrid({ x: props.grid, y: props.grid, smooth: props.smooth })],
});
</script>

<template>
  <div
    ref="el"
    class="node"
    :class="[node.shape, { dragging: isDragging }]"
    :style="{ left: `${node.x}px`, top: `${node.y}px` }"
  >
    <span>{{ node.text }}</span>
  </div>
</template>

<style scoped>
.node {
  position: absolute;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  width: 120px;
  height: 40px;
  border-radius: 8px;
  background: Canvas;
  box-shadow:
    inset 0 0 0 1.5px #3b82f6,
    0 4px 10px -6px rgb(0 0 0 / 0.5);
  font-size: 12px;
  font-weight: 600;
  cursor: grab;
  user-select: none;
}

.node.pill {
  border-radius: 99px;
  box-shadow:
    inset 0 0 0 1.5px #42b883,
    0 4px 10px -6px rgb(0 0 0 / 0.5);
}

/* A diamond: the shape is clipped, the box stays square. */
.node.diamond {
  width: 80px;
  height: 80px;
  border-radius: 0;
  background: #f59e0b;
  box-shadow: none;
  clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  color: #1c1405;
}

.node:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.node.dragging {
  opacity: 0.3;
}

[data-dnd-overlay] .node:not(.diamond) {
  box-shadow:
    inset 0 0 0 1.5px #42b883,
    0 14px 26px -10px rgb(0 0 0 / 0.6);
}
</style>
