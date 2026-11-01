<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import { LIMIT, type Attachment } from './files';

const props = defineProps<{ file: Attachment }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.file });

const tooBig = computed(() => props.file.size > LIMIT);
const extension = computed(() => props.file.name.split('.').pop());
</script>

<template>
  <li ref="el" class="file">
    <span class="kind" aria-hidden="true">{{ extension }}</span>
    <span class="text">
      <span class="name">{{ file.name }}</span>
      <span class="size" :class="{ big: tooBig }">{{ file.size }} MB{{ tooBig ? ' · too big' : '' }}</span>
    </span>
  </li>
</template>

<style scoped>
.file {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 9px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 11%, transparent);
  font-size: 12px;
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
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 25%, transparent);
}

.file[data-dnd-placeholder] > * {
  visibility: hidden;
}

.kind {
  display: grid;
  flex: none;
  place-items: center;
  width: 30px;
  height: 34px;
  border-radius: 4px 10px 4px 4px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 700 8px/1 ui-monospace, Menlo, Consolas, monospace;
  text-transform: uppercase;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.name {
  overflow: hidden;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.size {
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}

.size.big {
  color: #e5a00d;
  opacity: 1;
}
</style>
