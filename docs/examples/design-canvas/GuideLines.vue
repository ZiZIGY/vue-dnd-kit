<script setup lang="ts">
import { inject } from 'vue';
import { EDITOR } from './editor';
import type { Guide } from './geometry';

// The smart guides of a drag or a resize: pink lines through the edges and centres the
// layers share, and the distance to the closest layer on each line.
const editor = inject(EDITOR)!;
const { view, guides } = editor;

/** A guide in screen pixels: a vertical line for the 'x' axis, a horizontal one for 'y'. */
const place = ({ axis, at, from, to }: Guide) => {
  const along = { start: `${(axis === 'x' ? view.y : view.x) + from * view.zoom}px`, length: `${(to - from) * view.zoom}px` };
  const across = `${(axis === 'x' ? view.x : view.y) + at * view.zoom}px`;
  return axis === 'x'
    ? { left: across, top: along.start, height: along.length }
    : { top: across, left: along.start, width: along.length };
};
</script>

<template>
  <div class="guides" aria-hidden="true">
    <span v-for="line in guides.lines" :key="`${line.axis}${line.at}`" class="line" :class="line.axis" :style="place(line)" />
    <span v-for="gap in guides.gaps" :key="`gap${gap.axis}${gap.at}`" class="gap" :class="gap.axis" :style="place(gap)">
      <span class="distance">{{ Math.round(gap.to - gap.from) }}</span>
    </span>
  </div>
</template>

<style scoped>
.guides {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  --guide: #f43f8e;
}

.line,
.gap {
  position: absolute;
}

.line.x {
  border-left: 1px solid var(--guide);
}

.line.y {
  border-top: 1px solid var(--guide);
}

/* A gap is measured like a dimension: a line with a tick at each end and its length. */
.gap.x {
  width: 0;
  border-left: 1px solid var(--guide);
}

.gap.y {
  height: 0;
  border-top: 1px solid var(--guide);
}

.gap::before,
.gap::after {
  content: '';
  position: absolute;
  background: var(--guide);
}

.gap.x::before,
.gap.x::after {
  left: -4px;
  width: 7px;
  height: 1px;
}

.gap.x::before {
  top: 0;
}

.gap.x::after {
  bottom: 0;
}

.gap.y::before,
.gap.y::after {
  top: -4px;
  width: 1px;
  height: 7px;
}

.gap.y::before {
  left: 0;
}

.gap.y::after {
  right: 0;
}

.distance {
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--guide);
  color: #fff;
  font: 600 10px/1.3 ui-monospace, Menlo, Consolas, monospace;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  transform: translate(-50%, -50%);
}
</style>
