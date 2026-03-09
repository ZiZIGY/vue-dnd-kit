<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import type { Piece } from './types';
  import CheckerPiece from './CheckerPiece.vue';

  const props = defineProps<{
    row: number;
    col: number;
    piece: Piece | null;
    pieces: Piece[];
    isValidTarget: boolean;
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
          if (!isDark.value) return;
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
      { 'valid-target': isValidTarget },
    ]"
  >
    <div
      v-if="isValidTarget"
      class="target-dot"
    />
    <Transition name="piece">
      <CheckerPiece
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
    width: 52px;
    height: 52px;
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

  .target-dot {
    position: absolute;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.25);
    pointer-events: none;
  }

  /* dot hidden behind piece when cell is occupied */
  .cell:has(.piece) .target-dot {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: transparent;
    border: 3px solid rgba(255, 255, 255, 0.6);
  }

  /* Piece appear / disappear */
  .piece-enter-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .piece-leave-active {
    transition:
      opacity 0.15s ease,
      transform 0.15s ease;
  }

  .piece-enter-from {
    opacity: 0;
    transform: scale(0.4);
  }

  .piece-leave-to {
    opacity: 0;
    transform: scale(0.4);
  }

  @media (max-width: 520px) {
    .cell {
      width: 36px;
      height: 36px;
    }

    .target-dot {
      width: 14px;
      height: 14px;
    }
  }
</style>
