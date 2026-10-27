<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';
import type { Furniture } from './furniture';

const props = defineProps<{ piece: Furniture }>();
const el = useTemplateRef<HTMLElement>('el');

// In storage, a copy of the piece follows the pointer (the default overlay). In the room,
// there is no overlay: the piece moves itself, by the `transform` the drag returns.
const inRoom = computed(() => props.piece.place === 'room');
const { isDragging, transform } = makeDraggable(el, {
  id: () => props.piece.id,
  overlay: computed(() => !inRoom.value),
});

const style = computed(() => ({
  width: `${props.piece.width}px`,
  height: `${props.piece.height}px`,
  '--color': props.piece.color,
  ...(inRoom.value && { left: `${props.piece.x}px`, top: `${props.piece.y}px` }),
  ...(transform.value && { transform: `translate3d(${transform.value.x}px, ${transform.value.y}px, 0)` }),
}));
</script>

<template>
  <div
    ref="el"
    class="piece"
    :class="{ round: piece.round, rug: piece.id === 'rug', placed: inRoom, dragging: isDragging }"
    :style="style"
    :aria-label="piece.name"
  >
    <span>{{ piece.name }}</span>
  </div>
</template>

<style scoped>
.piece {
  display: grid;
  flex: none;
  place-items: center;
  box-sizing: border-box;
  border: 1.5px solid var(--color);
  border-radius: 6px;
  background: color-mix(in srgb, var(--color) 30%, Canvas);
  font: 600 9px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: grab;
  user-select: none;
}

.piece.round {
  border-radius: 50%;
  background: radial-gradient(circle, var(--color) 0 22%, color-mix(in srgb, var(--color) 30%, Canvas) 26%);
}

.piece.round span {
  display: none;
}

.piece.rug {
  border-style: dashed;
  background: repeating-linear-gradient(45deg, color-mix(in srgb, var(--color) 16%, Canvas) 0 6px, color-mix(in srgb, var(--color) 24%, Canvas) 6px 12px);
}

.piece.placed {
  position: absolute;
  z-index: 1;
}

.piece.placed.rug {
  z-index: 0;
}

/* In storage it stays behind, faded; in the room it is what moves, so it goes on top. */
.piece.dragging {
  opacity: 0.3;
}

.piece.placed.dragging {
  z-index: 2;
  opacity: 1;
  box-shadow: 0 10px 20px -8px rgb(0 0 0 / 0.5);
}

.piece:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}
</style>
