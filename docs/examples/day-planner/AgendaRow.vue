<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ entry: { id: string; title: string; minutes: number; color: string }; start: string; end: string }>();
defineEmits<{ remove: [] }>();

const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.entry });
</script>

<template>
  <li ref="el" class="entry" :style="{ '--color': entry.color }">
    <span class="time">{{ start }}</span>
    <span class="card">
      <strong>{{ entry.title }}</strong>
      <small>{{ start }} – {{ end }}</small>
      <button type="button" aria-label="Remove" @click="$emit('remove')">×</button>
    </span>
  </li>
</template>

<style scoped>
.entry {
  display: flex;
  align-items: stretch;
  gap: 10px;
  cursor: grab;
  user-select: none;
}

.entry:focus-visible {
  outline: none;
}

.entry:focus-visible .card {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.time {
  width: 38px;
  padding-top: 4px;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  text-align: right;
  opacity: 0.5;
}

.card {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  min-width: 0;
  height: 40px;
  padding: 0 34px 0 12px;
  border-left: 3px solid var(--color);
  border-radius: 4px 9px 9px 4px;
  background: color-mix(in srgb, var(--color) 14%, Canvas);
}

strong {
  font-size: 13px;
  font-weight: 600;
}

small {
  font: 10.5px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}

button {
  position: absolute;
  top: 50%;
  right: 6px;
  width: 24px;
  height: 24px;
  margin-top: -12px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: none;
  color: inherit;
  font-size: 16px;
  line-height: 1;
  opacity: 0.4;
  cursor: pointer;
}

button:hover {
  background: color-mix(in srgb, currentColor 10%, transparent);
  opacity: 1;
}

/* The slot the entry will land in, a new one too while a block is over the agenda. */
.entry[data-dnd-placeholder] {
  opacity: 1;
}

.entry[data-dnd-placeholder] .card {
  border: 1.5px dashed var(--color);
  background: transparent;
}

.entry[data-dnd-placeholder] .card > * {
  visibility: hidden;
}
</style>
