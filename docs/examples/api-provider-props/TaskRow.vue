<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: { id: string; title: string }; compact?: boolean }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.task });
</script>

<template>
  <!-- No placeholder style of ours: the provider's default styles fade the slot. -->
  <li ref="el" class="row" :class="{ compact }">
    <span class="dot" />
    <span class="text">
      <strong>{{ task.title }}</strong>
      <small v-if="!compact">#{{ task.id }}</small>
    </span>
  </li>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 12px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 10%, transparent),
    0 2px 6px -4px rgb(0 0 0 / 0.4);
  cursor: grab;
  user-select: none;
}

.row.compact {
  gap: 8px;
  height: 32px;
  padding: 0 10px;
  border-radius: 7px;
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #42b883;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

strong {
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.compact strong {
  font-size: 12px;
  font-weight: 500;
}

small {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}
</style>
