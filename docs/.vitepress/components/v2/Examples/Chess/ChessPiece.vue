<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';
  import type { Piece } from './types';
  import { SYMBOLS } from './types';

  const props = defineProps<{
    piece: Piece;
    pieces: Piece[];
  }>();

  const el = useTemplateRef<HTMLElement>('el');
  const index = computed(() => props.pieces.findIndex((p) => p.id === props.piece.id));

  const { isDragging } = makeDraggable(
    el,
    { data: () => props.piece },
    () => [index.value, props.pieces]
  );

  const symbol = computed(() => SYMBOLS[props.piece.color][props.piece.type]);
</script>

<template>
  <div
    ref="el"
    class="piece"
    :class="[piece.color, { ghost: isDragging }]"
  >
    {{ symbol }}
  </div>
</template>

<style scoped>
  .piece {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.2rem;
    cursor: grab;
    user-select: none;
    touch-action: none;
    transition:
      opacity 0.15s ease,
      transform 0.08s ease;
    position: relative;
    z-index: 1;
    line-height: 1;
  }

  .piece:not(.ghost):hover {
    transform: scale(1.15);
  }

  .piece:active {
    cursor: grabbing;
  }

  .piece.white {
    color: #fff;
    filter: drop-shadow(0 1px 0 #888) drop-shadow(0 2px 5px rgba(0, 0, 0, 0.5));
  }

  .piece.black {
    color: #1a202c;
    filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.15))
      drop-shadow(0 2px 5px rgba(0, 0, 0, 0.6));
  }

  .piece.ghost {
    opacity: 0.12;
    transform: none !important;
    pointer-events: none;
  }

  @media (max-width: 520px) {
    .piece {
      font-size: 1.4rem;
    }
  }
</style>
