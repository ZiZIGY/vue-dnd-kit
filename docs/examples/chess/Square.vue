<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue';
import { makeDroppable, useDnD } from '@vue-dnd-kit/core';
import Piece from './Piece.vue';
import { isDark, type Piece as PieceData } from './chess';
import { GAME } from './game';

const props = defineProps<{ square: string }>();
const game = inject(GAME)!;
const el = useTemplateRef<HTMLElement>('el');

const { isOver, isAccepting } = makeDroppable(el, {
  id: props.square,
  // A rule, asked while a piece is dragged: the square takes the piece's legal moves only.
  // Anything else is refused, and the piece flies back.
  accept: ({ active }) => game.canMove(active.id, props.square),
  onDrop: ({ active }) => game.move(String(active.id), props.square),
});

const piece = computed(() => game.pieceAt(props.square));
const { active } = useDnD();
const from = computed(() => (active.value?.data as PieceData | undefined)?.square === props.square);
const last = computed(() => game.last.value?.from === props.square || game.last.value?.to === props.square);
</script>

<template>
  <div
    ref="el"
    class="square"
    :class="{
      dark: isDark(square),
      marked: from || last,
      legal: isAccepting,
      capture: isAccepting && piece,
      over: isOver && isAccepting,
      check: game.check.value === square,
    }"
  >
    <span v-if="square[0] === 'a'" class="rank">{{ square[1] }}</span>
    <span v-if="square[1] === '1'" class="file">{{ square[0] }}</span>
    <Piece v-if="piece" :key="piece.id" :piece="piece" />
  </div>
</template>

<style scoped>
.square {
  --light: #ecebd6;
  --dark: #789a5b;
  position: relative;
  background: var(--light);
}

.square.dark {
  background: var(--dark);
}

/* The last move, and the square the piece in hand comes from. */
.square.marked {
  box-shadow: inset 0 0 0 100vmax rgb(255 214 10 / 0.42);
}

/* Legal moves: a dot on free squares, a ring around pieces to take. */
.square.legal::after {
  content: '';
  position: absolute;
  inset: 34%;
  border-radius: 50%;
  background: rgb(20 30 10 / 0.22);
  pointer-events: none;
}

.square.capture::after {
  inset: 3%;
  background: none;
  box-shadow: inset 0 0 0 0.36rem rgb(20 30 10 / 0.22);
}

.square.over {
  box-shadow: inset 0 0 0 0.24rem rgb(255 255 255 / 0.85);
}

.square.check {
  background-image: radial-gradient(circle, #ff3b30 0%, rgb(255 59 48 / 0.65) 32%, transparent 72%);
}

/* Coordinates in the corners, in the other square's colour. */
.rank,
.file {
  position: absolute;
  color: var(--dark);
  font: 600 clamp(8px, 1.6vw, 11px) / 1 ui-monospace, Menlo, Consolas, monospace;
  pointer-events: none;
}

.square.dark > .rank,
.square.dark > .file {
  color: var(--light);
}

.rank {
  top: 4px;
  left: 4px;
}

.file {
  right: 4px;
  bottom: 3px;
}
</style>
