<script setup lang="ts">
import { computed, inject } from 'vue';
import type { Active, DnDStatus, Over } from '@vue-dnd-kit/core';
import PieceArt from './PieceArt.vue';
import { NAMES, type Piece } from './chess';
import { GAME } from './game';

// The piece in hand, lifted. It reads the square under it (`over`, `accepted`) and says
// what a drop there would do, or why it can't.
const props = defineProps<{ active: Active; over: Over | null; accepted: boolean; status: DnDStatus }>();
const game = inject(GAME)!;
const piece = computed(() => props.active.data as Piece);

const hint = computed(() => {
  const square = props.over ? String(props.over.id) : null;
  // Nothing to say off the board, over its own square, or once it lands.
  if (props.status !== 'dragging' || !square || square === piece.value.square) return null;
  if (props.accepted) {
    const taken = game.takes(piece.value.id, square);
    return taken ? { type: 'capture', text: `Takes ${NAMES[taken.kind]}` } : null;
  }
  // Code only crosses the squares it doesn't play.
  if (game.planned.value) return null;
  return { type: 'refused', text: game.whyNot(piece.value.id, square) };
});
</script>

<template>
  <div class="held" :class="[status, hint?.type]">
    <PieceArt :kind="piece.kind" :color="piece.color" />
    <span v-if="hint" class="tag">{{ hint.text }}</span>
  </div>
</template>

<style scoped>
/* Fills the overlay box: the size of a square. */
.held {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 4%;
  box-sizing: border-box;
}

.held :deep(.art) {
  filter: drop-shadow(0 1.5px 1px rgb(0 0 0 / 0.3));
  transition:
    scale 0.2s,
    filter 0.2s;
}

/* Lifted off the board while dragging, set down as it lands. */
.held.dragging :deep(.art) {
  scale: 1.18;
  filter: drop-shadow(0 12px 9px rgb(0 0 0 / 0.38));
  animation: lift 0.16s ease-out;
}

/* A capture: a target ring around the piece. */
.held.capture::before {
  content: '';
  position: absolute;
  inset: -6%;
  border: 3px solid #ff9f0a;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgb(255 159 10 / 0.25);
}

/* An illegal square: the piece turns red and shakes. */
.held.refused {
  animation: shake 0.28s;
}

.held.refused :deep(.art) {
  filter: drop-shadow(0 0 1px #ff3b30) drop-shadow(0 0 7px rgb(255 59 48 / 0.85));
}

.tag {
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  translate: -50% 0;
  padding: 4px 8px;
  border-radius: 99px;
  background: #1c1c1e;
  color: #fff;
  font: 600 11px/1 system-ui, sans-serif;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.3);
}

.refused .tag {
  background: #e5332a;
}

.capture .tag {
  background: #c46f00;
}

@keyframes lift {
  from {
    scale: 1;
    filter: drop-shadow(0 1.5px 1px rgb(0 0 0 / 0.3));
  }
}

@keyframes shake {
  25% {
    translate: -4px 0;
  }
  75% {
    translate: 4px 0;
  }
}
</style>
