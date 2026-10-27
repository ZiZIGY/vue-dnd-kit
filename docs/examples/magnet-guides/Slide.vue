<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeDroppable, restrictToParent, useDnDMonitor, type Modifier } from '@vue-dnd-kit/core';
import SlideBox from './SlideBox.vue';

const boxes = ref([
  { id: 'title', kind: 'title', x: 32, y: 28, width: 220, height: 44 },
  { id: 'image', kind: 'image', x: 300, y: 28, width: 180, height: 124 },
  { id: 'text', kind: 'text', x: 32, y: 96, width: 220, height: 56 },
  { id: 'button', kind: 'button', x: 32, y: 184, width: 104, height: 36 },
]);

const slide = useTemplateRef<HTMLElement>('slide');
const PULL = 8;

/** The lines a box lines up with: the other boxes' edges and centers, and the slide's. */
const lines = (id: string, axis: 'x' | 'y') => {
  const size = axis === 'x' ? 'width' : 'height';
  const edge = slide.value?.[axis === 'x' ? 'clientWidth' : 'clientHeight'] ?? 0;
  return [
    0,
    edge / 2,
    edge,
    ...boxes.value.filter((box) => box.id !== id).flatMap((box) => [box[axis], box[axis] + box[size] / 2, box[axis] + box[size]]),
  ];
};

/** How far to move `start`..`start + length` so its edge or center sits on a line within PULL px. */
const pull = (start: number, length: number, targets: number[]) => {
  let best = 0;
  for (const point of [start, start + length / 2, start + length]) {
    for (const line of targets) {
      const gap = line - point;
      if (Math.abs(gap) <= PULL && (!best || Math.abs(gap) < Math.abs(best))) best = gap;
    }
  }
  return best;
};

/**
 * A modifier of our own: it gets the offset so far and the overlay's rect, and returns a
 * new offset. Near a line, the box jumps onto it.
 */
const magnet: Modifier = ({ transform, overlayRect, containerRect, active }) => {
  if (!containerRect) return transform;
  const id = String(active.id);
  const left = overlayRect.left - containerRect.left;
  const top = overlayRect.top - containerRect.top;
  return {
    x: transform.x + pull(left, overlayRect.width, lines(id, 'x')),
    y: transform.y + pull(top, overlayRect.height, lines(id, 'y')),
  };
};
// In order: the magnet pulls, then the slide's edges hold.
const modifiers = [magnet, restrictToParent];

// The guides: the lines the box sits on exactly, after the modifiers (`delta`).
const guides = ref<{ x: number[]; y: number[] }>({ x: [], y: [] });
const on = (start: number, length: number, targets: number[]) =>
  targets.filter((line) => [start, start + length / 2, start + length].some((point) => Math.abs(point - line) < 0.5));

makeDroppable(slide, { id: 'slide' });
useDnDMonitor({
  onDragMove({ active, delta }) {
    const box = boxes.value.find((item) => item.id === active.id);
    if (!box) return;
    guides.value = {
      x: on(box.x + delta.x, box.width, lines(box.id, 'x')),
      y: on(box.y + delta.y, box.height, lines(box.id, 'y')),
    };
  },
  onDragEnd({ active, over, position }) {
    guides.value = { x: [], y: [] };
    const box = boxes.value.find((item) => item.id === active.id);
    if (!box || over?.id !== 'slide' || !position) return;
    box.x = Math.round(position.x);
    box.y = Math.round(position.y);
  },
  onDragCancel: () => (guides.value = { x: [], y: [] }),
});
</script>

<template>
  <!-- On a narrow screen, the slide scrolls sideways. -->
  <div class="scroll">
    <div ref="slide" class="slide">
      <span v-for="x in guides.x" :key="`x${x}`" class="guide vertical" :style="{ left: `${x}px` }" />
      <span v-for="y in guides.y" :key="`y${y}`" class="guide horizontal" :style="{ top: `${y}px` }" />
      <SlideBox v-for="box in boxes" :key="box.id" :box="box" :modifiers="modifiers" />
    </div>
  </div>
</template>

<style scoped>
.scroll {
  overflow-x: auto;
  padding: 2px 2px 24px;
}

.slide {
  position: relative;
  width: 512px;
  height: 256px;
  margin: 0 auto;
  border-radius: 6px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 14%, transparent),
    0 18px 40px -24px rgb(0 0 0 / 0.6);
}

.guide {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

.vertical {
  top: 0;
  bottom: 0;
  border-left: 1px solid #ec4899;
}

.horizontal {
  left: 0;
  right: 0;
  border-top: 1px solid #ec4899;
}
</style>
