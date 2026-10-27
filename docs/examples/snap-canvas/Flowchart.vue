<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeDroppable, useDnDMonitor } from '@vue-dnd-kit/core';
import FlowNode from './FlowNode.vue';

const nodes = ref([
  { id: 'start', text: 'Start', shape: 'pill', x: 40, y: 40 },
  { id: 'stock', text: 'Check stock', shape: 'box', x: 200, y: 40 },
  { id: 'ask', text: 'In stock?', shape: 'diamond', x: 240, y: 120 },
  { id: 'ship', text: 'Ship it', shape: 'box', x: 360, y: 160 },
]);

const SIZES = [10, 20, 40];
const grid = ref(20);
const smooth = ref(true);

// The canvas takes the drop: `position` is where the node's corner landed, after the snap.
const canvas = useTemplateRef<HTMLElement>('canvas');
makeDroppable(canvas, { id: 'canvas' });
useDnDMonitor({
  onDragEnd({ active, over, position }) {
    const node = nodes.value.find((item) => item.id === active.id);
    if (!node || over?.id !== 'canvas' || !position) return;
    node.x = Math.round(position.x);
    node.y = Math.round(position.y);
  },
});
</script>

<template>
  <div class="editor">
    <div class="controls">
      <div class="segmented" role="group" aria-label="Grid size">
        <button v-for="size in SIZES" :key="size" type="button" :aria-pressed="grid === size" @click="grid = size">
          {{ size }}px
        </button>
      </div>
      <button type="button" class="toggle" :aria-pressed="smooth" @click="smooth = !smooth">smooth</button>
    </div>
    <!-- On a narrow screen, the canvas scrolls sideways. -->
    <div class="scroll">
      <!-- Its frame is a shadow, not a border: the grid starts at its very edge. -->
      <div ref="canvas" class="canvas" :style="{ '--grid': `${grid}px` }">
        <FlowNode v-for="node in nodes" :key="node.id" :node="node" :grid="grid" :smooth="smooth" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.segmented {
  display: flex;
  padding: 3px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

button {
  padding: 6px 10px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: 12px/1.2 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

.segmented button[aria-pressed='true'] {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
}

.toggle {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 15%, transparent);
  opacity: 0.6;
}

.toggle[aria-pressed='true'] {
  background: color-mix(in srgb, #42b883 14%, transparent);
  box-shadow: inset 0 0 0 1px #42b883;
  color: #42b883;
  opacity: 1;
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.scroll {
  overflow-x: auto;
}

.canvas {
  position: relative;
  width: 520px;
  height: 260px;
  border-radius: 12px;
  background-color: color-mix(in srgb, currentColor 3%, Canvas);
  background-image:
    linear-gradient(to right, color-mix(in srgb, currentColor 9%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, currentColor 9%, transparent) 1px, transparent 1px);
  background-size: var(--grid) var(--grid);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 14%, transparent);
}
</style>
