<script setup lang="ts">
  import { inject, useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';
  import { CHESS, GLYPHS, NAMES, type Piece } from './chess';

  const props = defineProps<{ piece: Piece }>();
  const chess = inject(CHESS)!;
  const el = useTemplateRef<HTMLElement>('el');

  const { isDragging } = makeDraggable(el, {
    id: () => props.piece.id,
    type: () => props.piece.color,
    data: () => props.piece,
    // Only the side to move can pick up pieces, and nobody once a king has fallen.
    disabled: () => chess.over.value || props.piece.color !== chess.turn.value,
    // Arrow keys jump between the squares that accept the piece: its legal moves.
    keyboard: 'droppables',
  });
</script>

<template>
  <span
    ref="el"
    class="ch-piece"
    :class="[piece.color === 'w' ? 'white' : 'black', { dragging: isDragging }]"
    :data-id="piece.id"
    :data-piece="piece.color + piece.kind"
    :aria-label="`${piece.color === 'w' ? 'White' : 'Black'} ${NAMES[piece.kind]} on ${piece.square}`"
    >{{ GLYPHS[piece.kind] }}</span
  >
</template>

<style scoped>
  .ch-piece {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    font: 46px/1 'Segoe UI Symbol', 'DejaVu Sans', 'Noto Sans Symbols 2', serif;
    cursor: grab;
    user-select: none;
  }

  .ch-piece[aria-disabled='true'] {
    cursor: default;
  }

  .ch-piece:focus-visible {
    outline: 3px solid var(--ui-focus);
    outline-offset: -3px;
  }

  .ch-piece.white {
    color: #fff;
    text-shadow:
      0 0 1px #1f2937,
      0 0 1px #1f2937,
      0 1px 2px rgb(0 0 0 / 0.4);
  }

  .ch-piece.black {
    color: #1f2937;
    text-shadow: 0 1px 2px rgb(255 255 255 / 0.25);
  }

  .ch-piece.dragging {
    opacity: 0.3;
  }
</style>
