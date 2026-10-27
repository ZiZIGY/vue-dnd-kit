<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ note: { id: string; text: string; paper: string }; saving: boolean }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.note });
</script>

<template>
  <li ref="el" class="note" :style="{ '--paper': note.paper }">
    {{ note.text }}
    <!-- Shown only in the overlay while it is `dropping`, that is while the save runs. -->
    <span v-if="saving" class="saving"><i />Saving</span>
  </li>
</template>

<style scoped>
.note {
  position: relative;
  box-sizing: border-box;
  height: 92px;
  padding: 12px;
  border-radius: 3px 3px 14px 3px;
  background: var(--paper);
  box-shadow: 0 3px 6px -3px rgb(0 0 0 / 0.4);
  color: #27272a;
  font: 500 13px/1.35 system-ui, sans-serif;
  cursor: grab;
  user-select: none;
}

.note:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 3px;
}

/* The slot: the outline of the note, on the board. */
.note[data-dnd-placeholder] {
  opacity: 1;
  background: transparent;
  box-shadow: none;
  outline: 1.5px dashed color-mix(in srgb, currentColor 35%, transparent);
  outline-offset: -1.5px;
  color: transparent;
}

/* Its copy in the overlay, while it travels: off the board, with a long shadow. */
[data-dnd-overlay='dragging'] .note {
  box-shadow:
    0 0 0 2px #42b883,
    0 22px 30px -14px rgb(0 0 0 / 0.6);
}

/* Landing, and waiting for the save: back on the board, dimmed until it is saved. */
[data-dnd-overlay='dropping'] .note {
  opacity: 0.85;
}

.saving {
  position: absolute;
  right: 10px;
  bottom: 9px;
  display: none;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  opacity: 0.7;
}

[data-dnd-overlay='dropping'] .saving {
  display: flex;
}

.saving i {
  width: 10px;
  height: 10px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    rotate: 360deg;
  }
}
</style>
