<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ mail: { id: string; from: string; subject: string } }>();
const el = useTemplateRef<HTMLElement>('el');
// The checkbox writes the provider's selection; a press on it never starts a drag.
const { selected } = makeSortableItem(el, { item: () => props.mail });
</script>

<template>
  <li ref="el" class="mail" :class="{ selected }">
    <input v-model="selected" type="checkbox" :aria-label="`Select ${mail.subject}`" />
    <strong>{{ mail.from }}</strong>
    <span class="subject">{{ mail.subject }}</span>
  </li>
</template>

<style scoped>
.mail {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.mail:hover {
  background: color-mix(in srgb, currentColor 4%, transparent);
}

.mail:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.mail.selected {
  background: color-mix(in srgb, #42b883 12%, transparent);
}

/* The slots of the dragged mails. */
.mail[data-dnd-placeholder] {
  opacity: 1;
  background: color-mix(in srgb, currentColor 5%, transparent);
}

.mail[data-dnd-placeholder] > * {
  visibility: hidden;
}

input {
  margin: 0;
  accent-color: #42b883;
  cursor: pointer;
}

strong {
  flex: none;
  width: 92px;
  overflow: hidden;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.subject {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.7;
}
</style>
