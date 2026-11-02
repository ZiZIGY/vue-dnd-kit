<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList, type EnterAnimation } from '@vue-dnd-kit/core';
import TrayPiece from './TrayPiece.vue';
import type { Piece } from './chess';

// The pieces a side has taken. A sortable list for its `animateChanges` alone: it is disabled,
// nothing drags here, but a piece added to `pieces` animates in, and the others make room.
const props = defineProps<{ pieces: Piece[]; board: HTMLElement | null }>();

/** A new piece flies in from the square it was taken on. */
const flyIn: EnterAnimation = ({ element, key, to }) => {
  const piece = props.pieces.find((taken) => `taken-${taken.id}` === key);
  const from = piece && props.board?.querySelector(`[data-square="${piece.square}"]`)?.getBoundingClientRect();
  if (!from) return;
  const start = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`;
  return element.animate(
    [
      { transform: start, transformOrigin: '0 0' },
      { transform: 'none', transformOrigin: '0 0' },
    ],
    { duration: 520, easing: 'cubic-bezier(0.3, 0, 0.2, 1)' },
  );
};

const tray = useTemplateRef<HTMLElement>('tray');
const { items } = makeSortableList(tray, {
  items: () => props.pieces,
  // Not the pieces' own ids: those are the board's draggables.
  getKey: (piece) => `taken-${piece.id}`,
  disabled: true,
  // Undo and a new game fly the pieces back to the board themselves (`glide.ts`).
  animateChanges: { enter: flyIn, leave: false },
});
</script>

<template>
  <span ref="tray" class="tray">
    <TrayPiece v-for="piece in items" :key="piece.id" :piece="piece" />
  </span>
</template>

<style scoped>
.tray {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 18px;
}
</style>
