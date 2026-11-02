<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue';
import { makeDraggable, snapCenterToCursor } from '@vue-dnd-kit/core';
import PieceArt from './PieceArt.vue';
import PieceOverlay from './PieceOverlay.vue';
import { NAMES, type Piece } from './chess';
import { GAME } from './game';

const props = defineProps<{ piece: Piece }>();
const game = inject(GAME)!;
const el = useTemplateRef<HTMLElement>('el');

// Only the side to move picks pieces up, and nobody once the game is over.
const offTurn = () => props.piece.color !== game.position.value.turn || !!game.result.value;

const { isDragging } = makeDraggable(el, {
  id: () => props.piece.id,
  data: () => props.piece,
  disabled: offTurn,
  // Your input only: drags started by code (the bot, a replay, the castling rook) have no
  // input event, so `canDrag` isn't asked for them.
  canDrag: () => game.yourTurn.value,
  // The piece in hand: it says what a drop on the square under it would do.
  overlay: PieceOverlay,
  // The piece's centre follows the pointer, as in chess apps.
  modifiers: [snapCenterToCursor],
  // Arrow keys jump between the squares that accept the piece: its legal moves.
  keyboardMode: 'droppables',
  // A touch drags at once (no long press): pieces don't scroll the page (`touch-action`).
  activation: { touch: { distance: 3 } },
});

// The library sets `aria-disabled` from `disabled`; it leaves one of yours alone.
const locked = computed(() => offTurn() || !game.yourTurn.value);
</script>

<template>
  <span
    ref="el"
    class="piece"
    :class="{ held: isDragging, locked }"
    :data-piece="piece.id"
    :aria-disabled="locked"
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

.piece.locked {
  cursor: default;
}

.piece:focus-visible {
  outline: 3px solid #42b883;
  outline-offset: -3px;
}

.piece :deep(.art) {
  filter: drop-shadow(0 1.5px 1px rgb(0 0 0 / 0.3));
}

/* What stays on the square while the piece is in hand, and until it has landed. */
.piece.held {
  opacity: 0.3;
}
</style>
