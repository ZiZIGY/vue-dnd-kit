<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ file: { id: string; name: string; kind: 'image' | 'doc' } }>();
const el = useTemplateRef<HTMLElement>('el');
// `type` is what a list's `group.put` reads as `types`.
makeSortableItem(el, { item: () => props.file, type: () => props.file.kind });
</script>

<template>
  <li ref="el" class="file" :class="file.kind">
    <span class="thumb" aria-hidden="true" />
    <span class="name">{{ file.name }}</span>
  </li>
</template>

<style scoped>
.file {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 10px 0 5px;
  border-radius: 8px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 11%, transparent);
  font-size: 12px;
  font-weight: 500;
  cursor: grab;
  user-select: none;
}

.file:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.file[data-dnd-placeholder] {
  opacity: 1;
  background: transparent;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 22%, transparent);
}

.file[data-dnd-placeholder] > * {
  visibility: hidden;
}

.thumb {
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 5px;
}

.image .thumb {
  background:
    radial-gradient(circle at 70% 32%, #fef08a 0 3px, transparent 3.5px),
    linear-gradient(160deg, #6ee7b7, #0e7490);
}

.doc .thumb {
  background:
    linear-gradient(#fff 0 0) 6px 7px / 10px 1.5px no-repeat,
    linear-gradient(#fff 0 0) 6px 11px / 10px 1.5px no-repeat,
    linear-gradient(#fff 0 0) 6px 15px / 6px 1.5px no-repeat,
    linear-gradient(160deg, #93c5fd, #3b82f6);
}

.name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
