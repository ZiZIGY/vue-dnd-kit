<script setup lang="ts">
import { computed } from 'vue';
import { DragPreview, type DnDStatus, type DragItem, type DragMode, type Over } from '@vue-dnd-kit/core';
import { TRASH } from './form';

/**
 * What follows the pointer, for the palette's fields and the form's: the library's copy of
 * the field (`DragPreview`), with a frame and a badge that say what a drop would do there.
 */
const props = defineProps<{ items: DragItem[]; over: Over | null; accepted: boolean; status: DnDStatus; mode: DragMode }>();

const entry = computed(() => props.items[0]!);
const state = computed(() => {
  if (props.status === 'dropping') return 'landing';
  if (props.over?.id === TRASH) return 'delete';
  // A row that refuses the field: it is full.
  if (props.over && !props.accepted) return 'full';
  // Palette fields are copies too, but they say nothing: adding is what they do.
  if (props.mode === 'copy' && !entry.value.type.includes('new-field')) return 'copy';
  return 'move';
});

// Lifted and tilted in hand, smaller over the trash, flat again as it lands.
const LOOKS = {
  move: 'ring-primary shadow-2xl motion-safe:rotate-1',
  copy: 'ring-primary shadow-2xl motion-safe:rotate-1',
  full: 'ring-error shadow-2xl motion-safe:rotate-1',
  delete: 'ring-error shadow-2xl motion-safe:rotate-1 motion-safe:scale-90',
  landing: 'ring-transparent',
};
const BADGES = {
  delete: { label: 'Delete', icon: 'i-lucide-trash-2', color: 'error' },
  full: { label: 'Row is full', icon: 'i-lucide-ban', color: 'error' },
  copy: { label: 'Copy', icon: 'i-lucide-plus', color: 'primary' },
} as const;
const badge = computed(() => (state.value in BADGES ? BADGES[state.value as keyof typeof BADGES] : null));
</script>

<template>
  <!-- Fills the overlay's box: a chip from the palette, a field's size from the form. -->
  <div
    class="relative size-full rounded-md bg-default ring-2 transition-[rotate,scale,box-shadow] duration-200"
    :class="LOOKS[state]"
  >
    <DragPreview :id="entry.id" class="rounded-md" :style="{ width: '100%', height: '100%' }" />
    <UBadge
      v-if="badge"
      :label="badge.label"
      :icon="badge.icon"
      :color="badge.color"
      size="sm"
      class="absolute -top-2.5 right-2 shadow-md"
    />
  </div>
</template>
