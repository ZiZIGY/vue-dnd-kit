<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';
  import type { Piece } from './types';

  const props = defineProps<{
    piece: Piece;
    pieces: Piece[];
  }>();

  const el = useTemplateRef<HTMLElement>('el');
  const index = computed(() => props.pieces.findIndex((p) => p.id === props.piece.id));

  const { isDragging } = makeDraggable(
    el,
    {
      data: () => props.piece,
    },
    () => [index.value, props.pieces]
  );
</script>

<template>
  <div
    ref="el"
    class="piece"
    :class="[piece.color, { ghost: isDragging, king: piece.isKing }]"
  >
    <span
      v-if="piece.isKing"
      class="crown"
    >♛</span>
  </div>
</template>

<style scoped>
  .piece {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition:
      transform 0.08s ease,
      opacity 0.2s ease;

    /* See Mobile & Touch section */
    touch-action: none;
    user-select: none;
  }

  .piece:not(.ghost):hover {
    transform: scale(1.08);
  }

  .piece:active {
    cursor: grabbing;
  }

  .piece.red {
    background: radial-gradient(circle at 35% 30%, #fc8181, #c53030);
    border: 3px solid #822727;
    box-shadow:
      0 3px 0 #63171b,
      0 5px 10px rgba(0, 0, 0, 0.45);
  }

  .piece.black {
    background: radial-gradient(circle at 35% 30%, #718096, #1a202c);
    border: 3px solid #111827;
    box-shadow:
      0 3px 0 #000,
      0 5px 10px rgba(0, 0, 0, 0.45);
  }

  .piece.ghost {
    opacity: 0.15;
    box-shadow: none;
    transform: none !important;
    pointer-events: none;
  }

  .piece.king::before {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    border: 2px solid rgba(255, 215, 0, 0.65);
  }

  .crown {
    font-size: 1rem;
    color: #ffd700;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
    line-height: 1;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 520px) {
    .piece {
      width: 30px;
      height: 30px;
    }

    .crown {
      font-size: 0.65rem;
    }
  }
</style>
