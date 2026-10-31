<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{
  track: { id: string; title: string; artist: string; duration: string; hue: number };
  number: number;
  playing: boolean;
}>();
const emit = defineEmits<{ pick: [event: MouseEvent] }>();
const el = useTemplateRef<HTMLElement>('el');
const { selected } = makeSortableItem(el, { item: () => props.track });
</script>

<template>
  <li ref="el" class="track" :class="{ selected, playing }" @click="emit('pick', $event)">
    <span class="number">
      <span v-if="playing" class="bars" aria-label="Playing"><i /><i /><i /></span>
      <template v-else>{{ number }}</template>
    </span>
    <span class="art" :style="{ '--hue': track.hue }" aria-hidden="true">♪</span>
    <span class="text">
      <span class="title">{{ track.title }}</span>
      <span class="artist">{{ track.artist }}</span>
    </span>
    <span class="duration">{{ track.duration }}</span>
  </li>
</template>

<style scoped>
.track {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  padding: 0 10px 0 6px;
  border-radius: 7px;
  /* Its own background: the overlay, a copy of the row, isn't see-through. */
  background: color-mix(in srgb, currentColor 3%, Canvas);
  cursor: grab;
  user-select: none;
}

.track:hover {
  background: color-mix(in srgb, currentColor 8%, Canvas);
}

.track:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.track.selected {
  background: color-mix(in srgb, #42b883 18%, Canvas);
}

/* The slots of the dragged block. */
.track[data-dnd-placeholder] {
  opacity: 1;
  background: color-mix(in srgb, #42b883 8%, Canvas);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 55%, transparent);
}

.track[data-dnd-placeholder] > * {
  visibility: hidden;
}

.number {
  display: grid;
  flex: none;
  place-items: center;
  width: 22px;
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.playing .number {
  opacity: 1;
}

.playing .title {
  color: #42b883;
}

.bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
}

.bars i {
  width: 3px;
  height: 100%;
  border-radius: 1px;
  background: #42b883;
  transform-origin: bottom;
  animation: bar 0.9s ease-in-out infinite alternate;
}

.bars i:nth-child(2) {
  animation-delay: -0.3s;
}

.bars i:nth-child(3) {
  animation-delay: -0.6s;
}

.art {
  display: grid;
  flex: none;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 5px;
  background: linear-gradient(135deg, hsl(var(--hue) 70% 55%), hsl(calc(var(--hue) + 50) 65% 35%));
  color: #fff;
  font-size: 15px;
}

.text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.title {
  overflow: hidden;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.artist {
  font-size: 12px;
  opacity: 0.6;
}

.duration {
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}

@keyframes bar {
  from {
    scale: 1 0.25;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bars i {
    animation: none;
  }
}
</style>
