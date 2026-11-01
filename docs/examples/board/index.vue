<script setup lang="ts">
import { provide } from 'vue';
import { DnDProvider, type Active, type AnnouncedPosition, type Announcements } from '@vue-dnd-kit/core';
import Board from './Board.vue';
import { BOARD, createBoard, type Card, type Column } from './store';

// Provided above the provider: the overlay it renders reads the board too.
const board = createBoard();
provide(BOARD, board);

// Screen readers hear cards and columns by name, not by id.
const subject = (active: Active) => {
  const item = active.items[0]?.item;
  if (active.type.includes('column')) return `the ${(item as Column).title} column`;
  if (active.ids.length > 1) return `${active.ids.length} cards`;
  return `${(item as Card).id}, ${(item as Card).title}`;
};
/** Where it is: "Todo, position 2 of 6." for a card, "Place 2 of 4." for a column. */
const where = (position: AnnouncedPosition | undefined) => {
  if (!position) return '';
  const column = board.column(position.list);
  if (!column) return `Place ${position.index + 1} of ${position.length}.`;
  return `${column.title}, position ${position.index + 1} of ${position.length}.`;
};

const announcements: Partial<Announcements> = {
  onDragStart: ({ active }, { position }) => {
    const keys = active.sensor === 'keyboard' ? ' Arrow keys move it, Space drops it, Escape cancels.' : '';
    return `Picked up ${subject(active)}. ${where(position)}${keys}`;
  },
  onDragOver: ({ over }, { position }) => {
    if (over?.id === 'trash') return 'Over the trash. Drop to delete.';
    const column = over ? board.column(over.id) : undefined;
    if (column && !over!.accepted) return `${column.title} is full: its limit is ${column.limit} cards.`;
    return position ? where(position) : undefined;
  },
  onDragEnd: ({ active, over }, { position }) =>
    over?.id === 'trash' ? `Deleted ${subject(active)}. Undo is in the notice.` : `Dropped ${subject(active)}. ${where(position)}`,
  onDragCancel: ({ active }, { position }) => `${subject(active)} went back. ${where(position)}`,
  onDragResume: ({ active }) => `Not dropped: still holding ${subject(active)}.`,
};
</script>

<template>
  <!--
    Space picks a card up and drops it: Enter is left to open the card. Touch drags vibrate
    over a column that takes them, and when a drop is refused.
  -->
  <DnDProvider
    :keyboard="{ keys: { start: ['Space'] } }"
    screen-reader-instructions="Space picks up a card or a column, the arrow keys move it, Space drops it, Escape cancels. Enter opens a card, X selects it."
    :announcements="announcements"
    :haptics="{ enter: true, refuse: true }"
  >
    <Board />
  </DnDProvider>
</template>
