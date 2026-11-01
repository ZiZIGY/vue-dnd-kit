<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';
import type { Shape } from './shapes';

const props = defineProps<{ shape: Shape }>();
const el = useTemplateRef<HTMLElement>('el');
// The slide's drag area sets the rules; the shape only says it can be dragged.
const { isDragging } = makeDraggable(el, { id: () => props.shape.id });
</script>

<template>
  <div
    ref="el"
    class="shape"
    :class="[shape.kind, { dragging: isDragging }]"
    :style="{ left: `${shape.x}px`, top: `${shape.y}px`, width: `${shape.width}px`, height: `${shape.height}px` }"
    :aria-label="shape.label"
  >
    <template v-if="shape.kind === 'title'">Q3 in review</template>
    <svg v-else-if="shape.kind === 'chart'" viewBox="0 0 96 48" aria-hidden="true">
      <rect x="6" y="28" width="14" height="16" rx="2" />
      <rect x="28" y="18" width="14" height="26" rx="2" />
      <rect x="50" y="22" width="14" height="22" rx="2" />
      <rect x="72" y="6" width="14" height="38" rx="2" />
    </svg>
    <svg v-else-if="shape.kind === 'photo'" viewBox="0 0 96 64" aria-hidden="true">
      <circle cx="70" cy="18" r="8" />
      <path d="M0 64 30 30l18 18 12-12 36 28z" />
    </svg>
    <template v-else>◆ acme</template>
  </div>
</template>

<style scoped>
.shape {
  position: absolute;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  border-radius: 6px;
  cursor: grab;
  user-select: none;
}

.shape:hover {
  outline: 1.5px solid color-mix(in srgb, #3b82f6 70%, transparent);
}

.shape:focus-visible {
  outline: 2px solid #3b82f6;
}

/* Where the shape was picked up from. */
.shape.dragging {
  opacity: 0.3;
}

.title {
  color: #0f172a;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.chart {
  background: #eef2ff;
}

.chart svg {
  width: 80%;
  fill: #6366f1;
}

.photo {
  overflow: hidden;
  background: linear-gradient(160deg, #bae6fd, #7dd3fc);
}

.photo svg {
  width: 100%;
  height: 100%;
  fill: #0ea5e9;
}

.photo circle {
  fill: #fde68a;
}

.logo {
  color: #0f172a;
  font: 700 12px/1 ui-monospace, Menlo, Consolas, monospace;
}
</style>
