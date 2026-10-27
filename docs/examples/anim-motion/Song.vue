<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ song: { id: number; title: string; artist: string; length: string; hue: number } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.song });
</script>

<template>
  <li ref="el" class="song">
    <span class="cover" :style="{ '--hue': song.hue }" />
    <span class="text">
      <strong>{{ song.title }}</strong>
      <small>{{ song.artist }}</small>
    </span>
    <span class="length">{{ song.length }}</span>
  </li>
</template>

<style scoped>
.song {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px 8px 8px;
  border-radius: 12px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  cursor: grab;
  user-select: none;
}

.song:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.song[data-dnd-placeholder] {
  opacity: 1;
  background: none;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 20%, transparent);
}

.song[data-dnd-placeholder] > * {
  visibility: hidden;
}

.cover {
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, hsl(var(--hue) 75% 62%), hsl(calc(var(--hue) + 50) 70% 38%));
}

.text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

strong {
  font-size: 13px;
  font-weight: 600;
}

small {
  font-size: 11px;
  opacity: 0.6;
}

.length {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}
</style>
