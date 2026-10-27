<script setup lang="ts">
import { inject, useTemplateRef } from 'vue';
import { makeDraggable, snapCenterToCursor } from '@vue-dnd-kit/core';
import PieceArt from './PieceArt.vue';
import { NAMES, type Piece } from './chess';
import { GAME } from './game';

const props = defineProps<{ piece: Piece }>();
const game = inject(GAME)!;
const el = useTemplateRef<HTMLElement>('el');

const { isDragging } = makeDraggable(el, {
  id: () => props.piece.id,
  data: () => props.piece,
  // Only the side to move picks pieces up, and nobody once the game is over.
  disabled: () => props.piece.color !== game.position.value.turn || !!game.result.value,
  // The piece's centre follows the pointer, as in chess apps.
  modifiers: [snapCenterToCursor],
  // Arrow keys jump between the squares that accept the piece: its legal moves.
  keyboard: 'droppables',
  // A touch drags at once (no long press): pieces don't scroll the page (`touch-action`).
  activation: { touch: { distance: 3 } },
});
</script>

<template>
  <span
    ref="el"
    class="piece"
    :class="{ held: isDragging }"
    :aria-label="`${piece.color === 'w' ? 'White' : 'Black'} ${NAMES[piece.kind]} on ${piece.square}`"
  >
    <PieceArt :kind="piece.kind" :color="piece.color" />
  </span>
</template>

<style scoped>
.piece {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  padding: 4%;
  box-sizing: border-box;
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.piece[aria-disabled='true'] {
  cursor: default;
}

.piece:focus-visible {
  outline: 3px solid #42b883;
  outline-offset: -3px;
}

.piece :deep(.art) {
  filter: drop-shadow(0 1.5px 1px rgb(0 0 0 / 0.3));
}

/* What stays on the square while the piece is in hand. */
.piece.held {
  opacity: 0.3;
}

/* The piece in hand: lifted off the board, and set down as it lands. */
[data-dnd-overlay] .piece {
  cursor: grabbing;
}

[data-dnd-overlay='dragging'] .piece :deep(.art) {
  scale: 1.18;
  filter: drop-shadow(0 12px 9px rgb(0 0 0 / 0.38));
  animation: lift 0.16s ease-out;
}

[data-dnd-overlay='dropping'] .piece :deep(.art) {
  transition:
    scale 0.2s,
    filter 0.2s;
}

@keyframes lift {
  from {
    scale: 1;
    filter: drop-shadow(0 1.5px 1px rgb(0 0 0 / 0.3));
  }
}
</style>
