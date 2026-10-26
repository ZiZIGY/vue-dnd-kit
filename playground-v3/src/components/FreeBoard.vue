<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeDragArea, makeDroppable, snapToGrid, useDnD, useDnDMonitor } from '@vue-dnd-kit/core';
  import FreePiece from './FreePiece.vue';
  import FreeZone from './FreeZone.vue';
  import type { Piece } from '../types';

  const pieces = ref<Piece[]>([
    { id: 'red', label: 'Red', type: 'red', keyboard: 'droppables', x: 40, y: 40, zone: null },
    { id: 'blue', label: 'Blue', type: 'blue', keyboard: 'droppables', x: 160, y: 40, zone: null },
    // Off the grid on purpose: the first snap aligns it to the board's grid.
    { id: 'free', label: 'Free', x: 30, y: 150, zone: null, button: true },
    { id: 'shift', label: 'Shift', x: 240, y: 200, zone: null, shift: true },
  ]);
  const zones = [
    { id: 'zone-red', label: 'Reds only', accept: 'red' },
    { id: 'zone-blue', label: 'Blues only', accept: 'blue' },
    { id: 'zone-any', label: 'Anything', accept: '*' },
  ];

  const clicks = ref(0);
  const buttonClicks = ref(0);
  const progress = useDnD().activation.progress;

  const boardRef = useTemplateRef<HTMLElement>('board');
  makeDroppable(boardRef, { id: 'board', accept: '*' });

  // Every piece, on the board or in a zone, snaps to a 20px grid: a drag area's rule for
  // the drags that start in it, with no provider of its own needed for that.
  const freeRef = useTemplateRef<HTMLElement>('free');
  makeDragArea(freeRef, { modifiers: [snapToGrid({ x: 20, y: 20, smooth: { duration: 80 } })] });

  useDnDMonitor({
    onDragEnd({ active, over, delta }) {
      const piece = pieces.value.find((item) => item.id === active.id);
      if (!piece || !over) return;
      if (over.id === 'board') {
        // Where the overlay was dropped, relative to the board.
        piece.x = Math.round(active.rect.left + delta.x - over.rect.left);
        piece.y = Math.round(active.rect.top + delta.y - over.rect.top);
        piece.zone = null;
      } else {
        piece.zone = String(over.id);
      }
    },
  });
</script>

<template>
  <div
    ref="free"
    class="free"
  >
    <div
      ref="board"
      class="free-board"
      data-testid="board"
    >
      <FreePiece
        v-for="piece in pieces.filter((item) => item.zone === null)"
        :key="piece.id"
        :piece="piece"
        @click="clicks++"
        @button-click="buttonClicks++"
      />
    </div>
    <div class="zones">
      <FreeZone
        v-for="zone in zones"
        :id="zone.id"
        :key="zone.id"
        :label="zone.label"
        :accept="zone.accept"
      >
        <FreePiece
          v-for="piece in pieces.filter((item) => item.zone === zone.id)"
          :key="piece.id"
          :piece="piece"
        />
      </FreeZone>
    </div>
  </div>
  <pre data-testid="free-state">{{
    pieces.map((piece) => `${piece.id}:${piece.zone ?? `${piece.x},${piece.y}`}`).join(' ')
  }}</pre>
  <p>
    Clicks: <output data-testid="clicks">{{ clicks }}</output>, button:
    <output data-testid="button-clicks">{{ buttonClicks }}</output>, activation:
    <output data-testid="progress">{{ progress.toFixed(2) }}</output>
  </p>
</template>
