<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ story: { id: string; title: string; points: number; bug?: boolean } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.story });
</script>

<template>
  <li ref="el" class="story">
    <span class="kind" :class="{ bug: story.bug }" :aria-label="story.bug ? 'Bug' : 'Story'" />
    <span class="title">{{ story.title }}</span>
    <span class="points">{{ story.points }}</span>
  </li>
</template>

<style scoped>
.story {
  position: relative;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 10px 10px 12px;
  border-radius: 9px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 10%, transparent),
    0 2px 4px -2px rgb(0 0 0 / 0.25);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.story:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.story[data-dnd-placeholder] {
  opacity: 1;
  background: transparent;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 22%, transparent);
}

.story[data-dnd-placeholder] > * {
  visibility: hidden;
}

.kind {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: #42b883;
}

.kind.bug {
  border-radius: 50%;
  background: #f43f5e;
}

.title {
  flex: 1;
  min-width: 0;
  line-height: 1.3;
}

.points {
  display: grid;
  flex: none;
  place-items: center;
  min-width: 20px;
  height: 20px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 9%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}
</style>
