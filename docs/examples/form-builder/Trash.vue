<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';
import { TRASH } from './form';

/**
 * Covers the palette while a field of the form is dragged: drop it here to delete it. It
 * takes the form's fields only (their type is their group's name), not new ones from the
 * palette, nor rows. `source.remove()` takes the field out of its row: the row's `onDrop`
 * runs, and the form records the change, so Undo brings the field back.
 */
const el = useTemplateRef<HTMLElement>('el');
const { isOver, isAccepting } = makeDroppable(el, {
  id: TRASH,
  accept: 'fields',
  onDrop: (event) => {
    // An Alt-drag carries a copy: there is nothing to delete.
    if (event.mode !== 'copy') event.source?.remove();
  },
});
</script>

<template>
  <div
    ref="el"
    class="absolute inset-2 z-10 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed text-sm font-medium backdrop-blur-sm transition duration-200"
    :class="[
      isAccepting ? 'bg-default/85' : 'pointer-events-none scale-95 opacity-0',
      isOver ? 'border-error bg-error/10 text-error' : 'border-error/40 text-muted',
    ]"
  >
    <UIcon name="i-lucide-trash-2" class="size-5" :class="isOver ? 'text-error motion-safe:animate-bounce' : 'text-dimmed'" />
    Drop to delete
  </div>
</template>
