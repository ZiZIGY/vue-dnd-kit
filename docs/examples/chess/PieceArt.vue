<script setup lang="ts">
import type { Color, Kind } from './chess';

defineProps<{ kind: Kind; color: Color }>();
</script>

<script lang="ts">
/** A circle as a path, so every shape of a piece is one `d`. */
const circle = (x: number, y: number, r: number) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;

/** The plinth every piece stands on. */
const BASE = 'M10 40.5v-1.6c0-1.6 1.2-2.9 2.9-2.9h19.2c1.7 0 2.9 1.3 2.9 2.9v1.6z';
const FOOT = 'M12.5 36v-1.4c0-1 .8-1.8 1.8-1.8h16.4c1 0 1.8.8 1.8 1.8V36z';

/**
 * In a 45×45 box: `shapes` are filled and outlined, back to front; `lines` are details on
 * top (a slit, an eye), dark on white pieces and light on black ones.
 */
const PIECES: Record<Kind, { shapes: string[]; lines?: string[] }> = {
  P: {
    shapes: [
      'M18.6 21.5c0 5.4-2.6 9.4-5.6 14.5h19c-3-5.1-5.6-9.1-5.6-14.5z',
      'M16 19.6c0-1 .8-1.8 1.8-1.8h9.4c1 0 1.8.8 1.8 1.8s-.8 1.9-1.8 1.9h-9.4c-1 0-1.8-.9-1.8-1.9z',
      circle(22.5, 12.6, 5.4),
      BASE,
    ],
  },
  R: {
    shapes: [
      'M14.8 32.8 16.4 17h12.2l1.6 15.8z',
      'M13.5 17v-2.6c0-.9.7-1.6 1.6-1.6h14.8c.9 0 1.6.7 1.6 1.6V17z',
      'M12.5 12.8V6.5h4v3h3.8v-3h4.4v3h3.8v-3h4v6.3z',
      FOOT,
      BASE,
    ],
    lines: ['M16.6 20h11.8', 'M15.8 29.8h13.4'],
  },
  B: {
    shapes: [
      'M15.6 32.8c2.2-3.6 3.4-7.4 3.4-10.6h7c0 3.2 1.2 7 3.4 10.6z',
      'M16.5 21.2c0-.9.7-1.6 1.6-1.6h8.8c.9 0 1.6.7 1.6 1.6s-.7 1.7-1.6 1.7h-8.8c-.9 0-1.6-.8-1.6-1.7z',
      'M22.5 8.4c-4.6 3-7 6.6-6.4 9.6.3 1.2 1.1 1.7 2 1.7h8.8c.9 0 1.7-.5 2-1.7.6-3-1.8-6.6-6.4-9.6z',
      circle(22.5, 6.6, 2),
      FOOT,
      BASE,
    ],
    lines: ['M24.4 11.6 21 15.8'],
  },
  N: {
    shapes: [
      'M14.2 32.8c-.3-4.6 2.4-7.4 5.6-9.9-2.2 1.3-4.6 2.6-7 2.9-1.9.2-3.3-1.2-3.2-3 .1-1.5.9-2.6 1.6-3.7 1.9-3 4.4-5.4 7.6-7.2l1.6-3.6 1.8 2.6c.6-.9 1.4-1.7 2.4-2.2l.4 2.9c4.6 1.5 7.6 5.6 8.4 11.4.6 4.1.2 7.6-.6 10.8z',
      FOOT,
      BASE,
    ],
    lines: ['M25.5 13.6c3 2.6 4.6 6.6 4.4 12.2', circle(17.6, 15.6, 0.4), 'M11.4 21.6l1.2-.3'],
  },
  Q: {
    shapes: [
      'M14.8 32.8c2-4.3 3.1-8.4 3.1-12.4h9.2c0 4 1.1 8.1 3.1 12.4z',
      'M15.2 19.6c0-.9.7-1.6 1.6-1.6h11.4c.9 0 1.6.7 1.6 1.6s-.7 1.7-1.6 1.7H16.8c-.9 0-1.6-.8-1.6-1.7z',
      'M15.6 18 11.2 10.4l5.4 4.4.9-7.2 3.4 6.2 1.6-7.2 1.6 7.2 3.4-6.2.9 7.2 5.4-4.4-4.4 7.6z',
      circle(11.2, 10.4, 1.8),
      circle(17.5, 7.6, 1.8),
      circle(22.5, 6.6, 1.8),
      circle(27.5, 7.6, 1.8),
      circle(33.8, 10.4, 1.8),
      FOOT,
      BASE,
    ],
  },
  K: {
    shapes: [
      'M14.8 32.8c2-4 2.8-7.8 2.8-11.6h9.8c0 3.8.8 7.6 2.8 11.6z',
      'M14.6 20.4c0-.9.7-1.6 1.6-1.6h12.6c.9 0 1.6.7 1.6 1.6s-.7 1.7-1.6 1.7H16.2c-.9 0-1.6-.8-1.6-1.7z',
      'M15.6 18.8c-2.8-3.6-1-8 3.4-7.4 1.6.2 2.8 1.2 3.5 2.6.7-1.4 1.9-2.4 3.5-2.6 4.4-.6 6.2 3.8 3.4 7.4z',
      'M21.5 3.5h2v2.6h2.6v2h-2.6v4.6h-2V8.1h-2.6v-2h2.6z',
      FOOT,
      BASE,
    ],
  },
};
</script>

<template>
  <svg class="art" :class="color" viewBox="1.5 1.5 42 42" aria-hidden="true">
    <path v-for="d in PIECES[kind].shapes" :key="d" :d="d" />
    <path v-for="d in PIECES[kind].lines" :key="d" class="line" :d="d" />
  </svg>
</template>

<style scoped>
.art {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

path {
  stroke-width: 1.5;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.w path {
  fill: #fbfaf7;
  stroke: #26231f;
}

.b path {
  fill: #2e2b28;
  stroke: #141210;
}

.art path.line {
  fill: none;
}

.b path.line {
  stroke: #d9d4cc;
  stroke-width: 1.2;
}
</style>
