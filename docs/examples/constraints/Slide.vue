<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeDragArea, makeDroppable, snapToGrid, useDnD } from '@vue-dnd-kit/core';
import Shape from './Shape.vue';
import type { Shape as ShapeData } from './shapes';

const GRID = 24;
const shapes = ref<ShapeData[]>([
  { id: 'title', kind: 'title', label: 'Title', x: 24, y: 24, width: 240, height: 48 },
  { id: 'chart', kind: 'chart', label: 'Chart', x: 24, y: 96, width: 192, height: 120 },
  { id: 'photo', kind: 'photo', label: 'Photo', x: 264, y: 96, width: 192, height: 120 },
  { id: 'logo', kind: 'logo', label: 'Logo', x: 384, y: 24, width: 72, height: 48 },
]);

const axis = ref<'x' | 'y' | undefined>();
const snap = ref(true);
const bounded = ref(true);

const slide = useTemplateRef<HTMLElement>('slide');
// Rules for every drag that starts on the slide, read when a drag starts: an axis lock,
// the slide's edges, a grid.
makeDragArea(slide, {
  axis,
  restrictToArea: bounded,
  modifiers: () => (snap.value ? [snapToGrid(GRID)] : []),
});

// The slide is also the drop target: a shape stays where it is dropped. `position` is
// where it landed, as `left`/`top` inside the slide.
const moved = ref<ShapeData | null>(null);
makeDroppable(slide, {
  id: 'slide',
  onDrop: ({ active, position }) => {
    const shape = shapes.value.find((item) => item.id === active.id);
    if (!shape || !position) return;
    shape.x = Math.round(position.x);
    shape.y = Math.round(position.y);
    moved.value = shape;
  },
});

// The line a shape slides along while the axis is locked.
const { active } = useDnD();
const guide = computed(() => {
  const shape = shapes.value.find((item) => item.id === active.value?.id);
  if (!shape || !axis.value) return null;
  return axis.value === 'x' ? { top: `${shape.y + shape.height / 2}px` } : { left: `${shape.x + shape.width / 2}px` };
});

const AXES = [
  { label: 'Free', value: undefined },
  { label: 'X', value: 'x' },
  { label: 'Y', value: 'y' },
] as const;
</script>

<template>
  <div class="editor">
    <div class="toolbar">
      <div class="segmented" role="group" aria-label="Axis">
        <button
          v-for="option in AXES"
          :key="option.label"
          type="button"
          :aria-pressed="axis === option.value"
          @click="axis = option.value"
        >
          {{ option.label }}
        </button>
      </div>
      <button type="button" class="toggle" :aria-pressed="snap" @click="snap = !snap">Snap to grid</button>
      <button type="button" class="toggle" :aria-pressed="bounded" @click="bounded = !bounded">Keep on slide</button>
      <span class="readout">{{ moved ? `${moved.label} → ${moved.x}, ${moved.y}` : '' }}</span>
    </div>
    <!-- On a narrow screen, the slide scrolls sideways: its shapes are placed in px. -->
    <div class="scroll">
      <div ref="slide" class="slide" :class="{ snap, bounded, dragging: !!active }">
        <div v-if="guide" class="guide" :class="axis" :style="guide" />
        <Shape v-for="shape in shapes" :key="shape.id" :shape="shape" />
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
  max-width: 488px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.segmented {
  display: flex;
  padding: 3px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

button {
  padding: 6px 12px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: 600 12px/1.2 system-ui, sans-serif;
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
  background: color-mix(in srgb, #3b82f6 14%, transparent);
  box-shadow: inset 0 0 0 1px #3b82f6;
  color: #3b82f6;
  opacity: 1;
}

button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.readout {
  margin-left: auto;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}

.scroll {
  overflow-x: auto;
  padding: 4px;
}

/* A white 16:9 slide in either theme. */
.slide {
  position: relative;
  width: 480px;
  height: 270px;
  border-radius: 8px;
  background: #fff;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 14%, transparent),
    0 18px 40px -24px rgb(0 0 0 / 0.6);
}

.slide.snap {
  background-image:
    linear-gradient(to right, rgb(15 23 42 / 0.07) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(15 23 42 / 0.07) 1px, transparent 1px);
  background-size: 24px 24px;
}

.slide.bounded.dragging {
  box-shadow: 0 0 0 2px #3b82f6;
}

.guide {
  position: absolute;
  pointer-events: none;
}

.guide.x {
  left: 0;
  right: 0;
  border-top: 1.5px dashed #3b82f6;
}

.guide.y {
  top: 0;
  bottom: 0;
  border-left: 1.5px dashed #3b82f6;
}
</style>
