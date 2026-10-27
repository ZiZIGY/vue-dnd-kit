<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ piece: { id: string; x: number; y: number; color: string } }>();
const el = useTemplateRef<HTMLElement>('el');
// A plain draggable: the pointer, the keyboard and the minimap all drag it.
const { isDragging } = makeDraggable(el, { id: () => props.piece.id });
</script>

<template>
  <div
    ref="el"
    class="piece"
    :class="[piece.id, { lifted: isDragging }]"
    :style="{ left: `${piece.x}px`, top: `${piece.y}px`, '--color': piece.color }"
    :aria-label="piece.id"
  />
</template>

<style scoped>
.piece {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--color);
  box-shadow: 0 6px 14px -6px rgb(0 0 0 / 0.6);
  cursor: grab;
}

.piece.circle {
  border-radius: 50%;
}

.piece.pill {
  width: 64px;
  border-radius: 22px;
}

.piece:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

.piece.lifted {
  opacity: 0.3;
}
</style>
