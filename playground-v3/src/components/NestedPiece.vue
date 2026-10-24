<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';
  import type { Piece } from './zones';

  const props = defineProps<{ piece: Piece }>();
  const el = useTemplateRef<HTMLElement>('el');
  makeDraggable(el, { id: () => props.piece.id, type: () => props.piece.color, data: () => props.piece });
</script>

<template>
  <div
    ref="el"
    class="nz-piece"
    :class="piece.color"
    :data-piece="piece.id"
  >
    {{ piece.id }}
  </div>
</template>
