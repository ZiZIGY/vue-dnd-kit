<script setup lang="ts">
import { provide } from 'vue';
import { DnDProvider, type Announcements } from '@vue-dnd-kit/core';
import Board from './Board.vue';
import { NAMES, type Piece } from './chess';
import { GAME, createGame } from './game';

// Provided above the provider: the overlays it renders read the game too.
const game = createGame();
provide(GAME, game);

// Screen readers hear pieces and squares, not ids.
const name = (data: unknown) => {
  const piece = data as Piece;
  return `${piece.color === 'w' ? 'white' : 'black'} ${NAMES[piece.kind]}`;
};
const from = (data: unknown) => (data as Piece).square;
const stays = (data: unknown) => `The ${name(data)} stays on ${from(data)}.`;

const announcements: Partial<Announcements> = {
  onDragStart: ({ active }) => {
    const keys = active.sensor === 'keyboard' ? ' Arrow keys go through its moves.' : '';
    return `Picked up the ${name(active.data)} on ${from(active.data)}.${keys}`;
  },
  // Over an illegal square, the reason the overlay shows: "f7, pinned".
  onDragOver: ({ active, over }) =>
    over ? `${over.id}${over.accepted ? '' : `, ${game.whyNot(active.id, String(over.id)).toLowerCase()}`}` : '',
  onDragEnd: ({ active, over, dropped }) => {
    if (!dropped || !over) return stays(active.data);
    const turn = game.last.value;
    const takes = turn?.captured ? `, takes the ${name(turn.captured)}` : '';
    const becomes = turn?.promotion ? ` and becomes a ${NAMES[turn.promotion]}` : '';
    return `The ${name(active.data)} moves to ${over.id}${takes}${becomes}.`;
  },
  onDragCancel: ({ active }) => stays(active.data),
  onDragResume: ({ active }) => `Still holding the ${name(active.data)}.`,
};
</script>

<template>
  <!-- Touch drags vibrate on a legal square, and when a drop is refused. -->
  <DnDProvider :announcements="announcements" :haptics="{ enter: true, refuse: true }">
    <Board />
  </DnDProvider>
</template>
