<script setup lang="ts">
import { DragPreview, type DnDStatus, type DragItem, type Over } from '@vue-dnd-kit/core';

// The overlay's props this one reads (see `OverlayProps`).
defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean; status: DnDStatus }>();

// A preview is as large as its card was; here each one fills the box instead.
const FILL = { width: '100%', height: '100%' };
</script>

<template>
  <!-- The card in hand, tilted, the rest of a selection piled up under it. -->
  <div class="hand" :class="{ tilted: status === 'dragging', refused: over && !accepted }">
    <span v-for="(item, index) in items.slice(1, 3)" :key="item.id" class="under" :style="{ '--n': index + 1 }">
      <DragPreview :id="item.id" :style="FILL" />
    </span>
    <DragPreview :id="items[0]!.id" class="top" :style="FILL" />
    <span v-if="items.length > 1" class="count">{{ items.length }}</span>
  </div>
</template>

<style scoped>
.hand {
  position: relative;
  isolation: isolate;
  width: 100%;
  height: 100%;
  transition: rotate 0.2s;
}

/* Straightens up as it lands. */
.hand.tilted {
  rotate: 2.5deg;
}

.top {
  border-radius: 10px;
  transition: box-shadow 0.2s;
}

.tilted .top {
  box-shadow: 0 20px 32px -14px rgb(0 0 0 / 0.55);
}

/* Over a column that refuses the cards: its WIP limit is reached. */
.refused .top {
  box-shadow:
    0 0 0 2px #f43f5e,
    0 20px 32px -14px rgb(0 0 0 / 0.55);
}

.under {
  position: absolute;
  inset: 0;
  z-index: calc(-1 * var(--n));
  translate: calc(var(--n) * 5px) calc(var(--n) * 5px);
  opacity: calc(1 - var(--n) * 0.25);
}

.count {
  position: absolute;
  top: -9px;
  right: -9px;
  display: grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  background: #42b883;
  color: #fff;
  font: 700 11px/1 ui-monospace, Menlo, Consolas, monospace;
}
</style>
