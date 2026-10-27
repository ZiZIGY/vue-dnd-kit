<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem, type SortablePosition } from '@vue-dnd-kit/core';
import { useDnDActions } from '@vue-dnd-kit/actions';
import type { Track } from './tracks';

const props = defineProps<{ track: Track; index: number; last: number }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.track });

// Each move is a whole drag: animated, announced, through the list's onBeforeDrop.
const { moveItem, startDrag } = useDnDActions();
const move = (to: SortablePosition) => moveItem(props.track.id, to);
// Hands the row to the arrow keys: Space or Enter drops it, Escape cancels.
const pickUp = () => startDrag(props.track.id, { type: 'keyboard' });
</script>

<template>
  <li ref="el" class="track" :data-id="track.id">
    <span class="cover" :style="{ '--hue': track.hue }" />
    <span class="text">
      <strong>{{ track.title }}</strong>
      <small>{{ track.artist }}</small>
    </span>
    <span class="tools">
      <button type="button" aria-label="Move up" :disabled="index === 0" @click="move({ index: index - 1 })">↑</button>
      <button type="button" aria-label="Move down" :disabled="index === last" @click="move({ index: index + 1 })">↓</button>
      <button type="button" aria-label="Move to the top" :disabled="index === 0" @click="move({ index: 0 })">⤒</button>
      <button type="button" aria-label="Move with the arrow keys" @click="pickUp">⌨</button>
    </span>
    <span class="length">{{ track.length }}</span>
  </li>
</template>

<style scoped>
.track {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 10px;
  background: Canvas;
  cursor: grab;
  user-select: none;
}

.track:hover {
  background: color-mix(in srgb, currentColor 4%, Canvas);
}

.track:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.track[data-dnd-placeholder] > * {
  visibility: hidden;
}

.track[data-dnd-placeholder] {
  background: color-mix(in srgb, #42b883 10%, Canvas);
}

.cover {
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: 8px;
  background: linear-gradient(135deg, hsl(var(--hue) 70% 60%), hsl(calc(var(--hue) + 40) 70% 42%));
}

.text {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
}

.text small {
  opacity: 0.55;
}

.tools {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}

.track:hover .tools,
.track:focus-within .tools {
  opacity: 1;
}

.tools button {
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 6px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  color: inherit;
  font-size: 13px;
  cursor: pointer;
}

.tools button:hover:not(:disabled) {
  background: color-mix(in srgb, #42b883 22%, transparent);
}

.tools button:disabled {
  opacity: 0.3;
  cursor: default;
}

.length {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

/* Touch screens have no hover: the buttons stay. */
@media (hover: none) {
  .tools {
    opacity: 1;
  }
}
</style>
