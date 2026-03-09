<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import type { Piece } from './types';
  import ChessPiece from './ChessPiece.vue';

  const props = defineProps<{
    row: number;
    col: number;
    piece: Piece | null;
    pieces: Piece[];
    isValidTarget: boolean;
    isInCheck: boolean;
  }>();

  const emit = defineEmits<{
    move: [{ piece: Piece; toRow: number; toCol: number }];
  }>();

  const isDark = computed(() => (props.row + props.col) % 2 === 1);
  const el = useTemplateRef<HTMLElement>('el');

  makeDroppable(
    el,
    {
      events: {
        onDrop(e) {
          const r = e.helpers.suggestRemove();
          if (!r?.removedItems.length) return;
          emit('move', {
            piece: r.removedItems[0] as Piece,
            toRow: props.row,
            toCol: props.col,
          });
        },
      },
    },
    () => (props.piece ? [props.piece] : [])
  );
</script>

<template>
  <div
    ref="el"
    class="cell"
    :class="[
      isDark ? 'dark' : 'light',
      { 'valid-target': isValidTarget, 'in-check': isInCheck },
    ]"
  >
    <div
      v-if="isValidTarget"
      class="target-hint"
      :class="{ capture: !!piece }"
    />
    <Transition name="piece">
      <ChessPiece
        v-if="piece"
        :key="piece.id"
        :piece="piece"
        :pieces="pieces"
      />
    </Transition>
  </div>
</template>

<style scoped>
  .cell {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: background-color 0.12s;
  }

  .cell.light {
    background-color: #f0d9b5;
  }

  .cell.dark {
    background-color: #b58863;
  }

  .cell.dark.valid-target {
    background-color: #7fa650;
  }

  .cell.light.valid-target {
    background-color: #aed16a;
  }

  .cell.in-check {
    background-color: rgba(220, 38, 38, 0.75) !important;
  }

  /* Empty square — dot indicator */
  .target-hint {
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.2);
    pointer-events: none;
    z-index: 0;
  }

  /* Occupied square — ring indicator */
  .target-hint.capture {
    width: 56px;
    height: 56px;
    background: transparent;
    border: 5px solid rgba(0, 0, 0, 0.25);
  }

  /* Piece appear / disappear */
  .piece-enter-active {
    transition:
      opacity 0.18s ease,
      transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .piece-leave-active {
    transition:
      opacity 0.12s ease,
      transform 0.12s ease;
  }

  .piece-enter-from {
    opacity: 0;
    transform: scale(0.5);
  }

  .piece-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }

  @media (max-width: 520px) {
    .cell {
      width: 40px;
      height: 40px;
    }

    .target-hint {
      width: 14px;
      height: 14px;
    }

    .target-hint.capture {
      width: 36px;
      height: 36px;
      border-width: 3px;
    }
  }
</style>
