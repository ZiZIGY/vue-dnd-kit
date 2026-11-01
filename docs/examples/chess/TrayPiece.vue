<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import PieceArt from './PieceArt.vue';
import type { Piece } from './chess';

const props = defineProps<{ piece: Piece }>();
const el = useTemplateRef<HTMLElement>('el');
// An item of the tray's list, so that the list animates it. Its list is disabled: it never
// drags, and it isn't announced as draggable (`attributes: false`).
makeSortableItem(el, { item: () => props.piece, attributes: false });
</script>

<template>
  <span ref="el" class="taken" :data-piece="piece.id">
    <PieceArt :kind="piece.kind" :color="piece.color" />
  </span>
</template>

<style scoped>
.taken {
  width: 18px;
  height: 18px;
  margin-right: -4px;
}

/* Outlined in the text colour: black pieces stay visible on a dark page. */
.taken :deep(.art) {
  filter: drop-shadow(0 0 1px color-mix(in srgb, currentColor 70%, transparent));
}
</style>
