<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ block: { title: string; minutes: number; color: string } }>();
const el = useTemplateRef<HTMLElement>('el');
// A plain draggable, not an item of any list. The agenda's `createItem` reads its `data`.
makeDraggable(el, { id: () => `template-${props.block.title}`, data: () => props.block });
</script>

<template>
  <div ref="el" class="chip" :style="{ '--color': block.color }">
    <span class="dot" />
    <span class="title">{{ block.title }}</span>
    <span class="minutes">{{ block.minutes }}m</span>
  </div>
</template>

<style scoped>
.chip {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 10px;
  border-radius: 9px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
  font-size: 13px;
  font-weight: 500;
  cursor: grab;
  user-select: none;
}

.chip:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color);
}

.minutes {
  margin-left: auto;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}
</style>
