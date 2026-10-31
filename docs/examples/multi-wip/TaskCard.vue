<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ card: { id: string; title: string; tag: 'bug' | 'feature' | 'chore' } }>();
const el = useTemplateRef<HTMLElement>('el');
const { selected } = makeSortableItem(el, { item: () => props.card });
</script>

<template>
  <li ref="el" class="card" :class="{ selected }">
    <button
      type="button"
      role="checkbox"
      class="tick"
      :aria-checked="selected"
      :aria-label="`Select ${card.title}`"
      @click="selected = !selected"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 8.5 2.5 2.5L12 5.5" /></svg>
    </button>
    <span class="title">{{ card.title }}</span>
    <span class="tag" :class="card.tag">{{ card.tag }}</span>
  </li>
</template>

<style scoped>
.card {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 9px 10px;
  border-radius: 9px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 9%, transparent),
    0 2px 4px -2px rgb(0 0 0 / 0.25);
  font-size: 12.5px;
  cursor: grab;
  user-select: none;
}

.card.selected {
  box-shadow:
    0 0 0 1.5px #42b883,
    0 2px 4px -2px rgb(0 0 0 / 0.25);
}

.card:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* The slot a card will land in. */
.card[data-dnd-placeholder] {
  opacity: 1;
  background: color-mix(in srgb, #42b883 8%, Canvas);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 55%, transparent);
}

.card[data-dnd-placeholder] > * {
  visibility: hidden;
}

.tick {
  display: grid;
  flex: none;
  place-items: center;
  width: 16px;
  height: 16px;
  margin-top: 1px;
  padding: 0;
  border: 1.5px solid color-mix(in srgb, currentColor 30%, transparent);
  border-radius: 5px;
  background: none;
  cursor: pointer;
}

.tick svg {
  width: 11px;
  height: 11px;
  fill: none;
  stroke: #04130c;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
}

.selected .tick {
  border-color: #42b883;
  background: #42b883;
}

.selected .tick svg {
  opacity: 1;
}

.title {
  flex: 1;
  line-height: 1.35;
}

.tag {
  flex: none;
  padding: 2px 6px;
  border-radius: 5px;
  font: 600 10px/1.3 ui-monospace, Menlo, Consolas, monospace;
}

.tag.bug {
  background: color-mix(in srgb, #ef4444 18%, transparent);
  color: #ef4444;
}

.tag.feature {
  background: color-mix(in srgb, #3b82f6 18%, transparent);
  color: #3b82f6;
}

.tag.chore {
  background: color-mix(in srgb, currentColor 10%, transparent);
}
</style>
