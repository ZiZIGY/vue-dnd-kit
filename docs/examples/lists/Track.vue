<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

type Track = { id: string; title: string; artist: string; seconds: number; hue: number };
const props = defineProps<{ track: Track }>();

const el = useTemplateRef<HTMLElement>('el');
// `index` follows the draft: the numbers change while you drag, and the first track plays.
const { index } = makeSortableItem(el, { item: () => props.track });

const time = computed(() => `${Math.floor(props.track.seconds / 60)}:${String(props.track.seconds % 60).padStart(2, '0')}`);
const cover = computed(() => `linear-gradient(135deg, hsl(${props.track.hue} 85% 66%), hsl(${props.track.hue + 50} 70% 38%))`);
</script>

<template>
  <li ref="el" class="track" :class="{ playing: index === 0 }">
    <span class="number">
      <span v-if="index === 0" class="bars" aria-hidden="true"><i /><i /><i /></span>
      <template v-else>{{ index + 1 }}</template>
    </span>
    <span class="cover" :style="{ background: cover }" />
    <span class="text">
      <strong>{{ track.title }}</strong>
      <small>{{ track.artist }}</small>
    </span>
    <span class="time">{{ time }}</span>
    <svg class="grip" viewBox="0 0 10 16" aria-hidden="true">
      <circle v-for="dot in 6" :key="dot" :cx="dot % 2 ? 2 : 8" :cy="Math.ceil(dot / 2) * 5 - 2" r="1.5" />
    </svg>
  </li>
</template>

<style scoped>
.track {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: grab;
  user-select: none;
  transition: background 0.2s;
}

.track:hover {
  background: color-mix(in srgb, currentColor 7%, Canvas);
}

.track:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

/* The slot the dragged track will land in: an empty, dashed row. */
.track[data-dnd-placeholder] {
  opacity: 1;
}

.track[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1.5px dashed color-mix(in srgb, currentColor 30%, transparent);
  border-radius: inherit;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.number {
  display: grid;
  place-items: center;
  width: 16px;
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

.playing .number {
  opacity: 1;
}

.bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
}

.bars i {
  width: 3px;
  background: #42b883;
  animation: bounce 0.9s ease-in-out infinite alternate;
}

.bars i:nth-child(2) {
  animation-delay: -0.3s;
}

.bars i:nth-child(3) {
  animation-delay: -0.6s;
}

@keyframes bounce {
  from {
    height: 3px;
  }
  to {
    height: 12px;
  }
}

.cover {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.15);
}

.text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

strong {
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.playing strong {
  color: #42b883;
}

small {
  font-size: 12px;
  opacity: 0.55;
}

.time {
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.grip {
  flex: none;
  width: 10px;
  height: 16px;
  fill: currentColor;
  opacity: 0.3;
}

@media (prefers-reduced-motion: reduce) {
  .bars i {
    animation: none;
    height: 8px;
  }
}
</style>
