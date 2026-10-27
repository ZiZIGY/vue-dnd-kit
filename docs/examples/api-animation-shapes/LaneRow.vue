<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ row: { id: string; hue: number } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.row });
</script>

<template>
  <li ref="el" class="row" :style="{ '--hue': row.hue }">
    <span class="swatch" />
    {{ row.id }}
  </li>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  font: 600 13px/1 ui-monospace, Menlo, Consolas, monospace;
  cursor: grab;
  user-select: none;
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.row[data-dnd-placeholder] {
  opacity: 0.3;
}

.swatch {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background: hsl(var(--hue) 65% 50%);
}
</style>
