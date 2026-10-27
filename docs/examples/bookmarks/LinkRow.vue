<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ link: { id: string; title: string; host: string; hue: number } }>();
const el = useTemplateRef<HTMLElement>('el');
// `type: 'link'`: what the folders' `accept` takes.
makeSortableItem(el, { item: () => props.link, type: 'link' });
</script>

<template>
  <li ref="el" class="row">
    <span class="favicon" :style="{ background: `hsl(${link.hue} 70% 45%)` }" aria-hidden="true">{{ link.title[0] }}</span>
    <span class="title">{{ link.title }}</span>
    <span class="host">{{ link.host }}</span>
  </li>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.row[data-dnd-placeholder] {
  opacity: 1;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 22%, transparent);
  background: transparent;
}

.row[data-dnd-placeholder] > * {
  visibility: hidden;
}

.favicon {
  display: grid;
  flex: none;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

.title {
  font-weight: 500;
}

.host {
  margin-left: auto;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}
</style>
