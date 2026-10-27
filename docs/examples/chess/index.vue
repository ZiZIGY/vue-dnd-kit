<script setup lang="ts">
import { DnDProvider, type Announcements } from '@vue-dnd-kit/core';
import Board from './Board.vue';
import { NAMES, type Piece } from './chess';

// Screen readers hear pieces and squares, not ids.
const name = (data: unknown) => {
  const piece = data as Piece;
  return `${piece.color === 'w' ? 'white' : 'black'} ${NAMES[piece.kind]}`;
};
const from = (data: unknown) => (data as Piece).square;

const announcements: Partial<Announcements> = {
  onDragStart: ({ active }) => `Picked up the ${name(active.data)} on ${from(active.data)}. Arrow keys go through its moves.`,
  onDragOver: ({ over }) => (over ? `${over.id}${over.accepted ? '' : ', not a legal move'}` : ''),
  onDragEnd: ({ active, over, dropped }) =>
    dropped && over ? `The ${name(active.data)} moves to ${over.id}.` : `The ${name(active.data)} stays on ${from(active.data)}.`,
  onDragCancel: ({ active }) => `The ${name(active.data)} stays on ${from(active.data)}.`,
};
</script>

<template>
  <DnDProvider :announcements="announcements">
    <Board />
  </DnDProvider>
</template>
