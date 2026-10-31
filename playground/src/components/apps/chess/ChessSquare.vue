<script setup lang="ts">
  import { computed, inject, useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import ChessPiece from './ChessPiece.vue';
  import { CHESS, isDark } from './chess';

  const props = defineProps<{ square: string }>();
  const chess = inject(CHESS)!;
  const el = useTemplateRef<HTMLElement>('el');

  const { isOver } = makeDroppable(el, {
    id: props.square,
    data: props.square,
    // Live rule: only the legal moves of the piece being dragged. A refused drop flies back.
    accept: () => chess.legal.value.has(props.square),
    onDrop: (event) => chess.move(String(event.active.id), props.square),
  });

  const piece = computed(() => chess.pieceAt(props.square));
  const legal = computed(() => chess.legal.value.has(props.square));
</script>

<template>
  <div
    ref="el"
    class="ch-square"
    :class="{ dark: isDark(square), legal, capture: legal && !!piece, over: isOver, refused: isOver && !legal }"
    :data-square="square"
    :data-legal="legal || undefined"
    :data-source="chess.source.value === square || undefined"
  >
    <ChessPiece
      v-if="piece"
      :key="piece.id"
      :piece="piece"
    />
  </div>
</template>

<style scoped>
  .ch-square {
    position: relative;
    width: 64px;
    height: 64px;
    background: #f0d9b5;
  }

  .ch-square.dark {
    background: #b58863;
  }

  .ch-square[data-source] {
    box-shadow: inset 0 0 0 64px rgb(250 204 21 / 0.45);
  }

  /* A dot on free legal squares, a ring around pieces that can be taken. */
  .ch-square.legal::after {
    content: '';
    position: absolute;
    inset: 0;
    margin: auto;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: rgb(22 101 52 / 0.45);
    pointer-events: none;
  }

  .ch-square.capture::after {
    width: 58px;
    height: 58px;
    background: none;
    box-shadow: inset 0 0 0 5px rgb(22 101 52 / 0.55);
  }

  .ch-square.over.legal {
    box-shadow: inset 0 0 0 4px #166534;
  }

  .ch-square.refused {
    box-shadow: inset 0 0 0 4px #dc2626;
  }
</style>
