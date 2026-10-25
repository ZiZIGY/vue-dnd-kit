<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';
  import type { Piece } from '../types';

  const props = defineProps<{ piece: Piece }>();
  const emit = defineEmits<{ click: []; buttonClick: [] }>();
  const el = useTemplateRef<HTMLElement>('el');

  const { isDragging } = makeDraggable(el, {
    id: () => props.piece.id,
    type: () => props.piece.type,
    data: () => props.piece,
    keyboard: () => props.piece.keyboard,
    // Keyboard drags stay available; pointer drags need Shift held.
    canDrag: props.piece.shift ? (event) => event instanceof KeyboardEvent || event.shiftKey : undefined,
  });
</script>

<template>
  <div
    ref="el"
    class="piece"
    :class="[piece.type, { dragging: isDragging, placed: piece.zone === null }]"
    :style="piece.zone === null ? { left: `${piece.x}px`, top: `${piece.y}px` } : undefined"
    :data-id="piece.id"
    @click="emit('click')"
  >
    {{ piece.label }}
    <button
      v-if="piece.button"
      type="button"
      data-testid="piece-button"
      @click.stop="emit('buttonClick')"
    >
      +
    </button>
  </div>
</template>
