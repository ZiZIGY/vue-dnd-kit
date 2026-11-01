<script setup lang="ts">
import { DnDProvider, type Announcements } from '@vue-dnd-kit/core';
import DesignCanvas from './DesignCanvas.vue';
import { KINDS } from './design';
import type { DragData } from './editor';
import type { ToolData } from './useLayerDrop';

// Screen readers hear names, not ids: a layer's, or the layer a tool adds. Rows of the
// layers panel keep the built-in texts (`undefined`), which say where they are in the tree.
const nameOf = (data: unknown) => {
  const { layer, tool } = (data ?? {}) as Partial<DragData & ToolData>;
  return layer?.name ?? (tool && `New ${KINDS[tool].name.toLowerCase()}`);
};
const placeOf = (over: { id: unknown; data: unknown }) =>
  over.id === 'canvas' ? 'the canvas' : `frame ${(over.data as { name: string }).name}`;

const announcements: Partial<Announcements> = {
  onDragStart: ({ active }, { count }) => {
    const name = nameOf(active.data);
    if (!name) return undefined;
    const others = count > 1 ? ` and ${count - 1} more` : '';
    return `Picked up ${name}${others}. Arrow keys move it, Enter drops it, Escape cancels.`;
  },
  onDragOver: ({ active, over }) => (nameOf(active.data) ? (over ? `Over ${placeOf(over)}` : 'Off the canvas') : undefined),
  onDragEnd: ({ active, over, dropped }) => {
    const name = nameOf(active.data);
    if (!name) return undefined;
    return dropped && over ? `${name} dropped on ${placeOf(over)}.` : `${name} went back.`;
  },
  onDragCancel: ({ active }) => (nameOf(active.data) ? `${nameOf(active.data)} went back.` : undefined),
};
</script>

<template>
  <!-- Space pans, as in any design tool, so Enter alone picks a layer up. Every dragged
       layer gets its clone at pickup, and the page doesn't scroll under a drag. -->
  <DnDProvider
    :keyboard="{ keys: { start: ['Enter'], drop: ['Enter'] }, step: 10 }"
    overlay-previews="all"
    :auto-scroll="false"
    :announcements="announcements"
    screen-reader-instructions="Press Enter to pick up a layer, the arrow keys to move it, Enter to drop it and Escape to cancel. Without a drag, the arrow keys nudge the selected layers."
  >
    <DesignCanvas />
  </DnDProvider>
</template>
