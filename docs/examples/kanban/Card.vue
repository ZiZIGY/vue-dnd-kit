<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import type { Candidate } from './candidates';

const props = defineProps<{ card: Candidate }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.card });
</script>

<template>
  <li ref="el" class="card">
    <span class="avatar" :style="{ '--hue': card.hue }" aria-hidden="true">{{ card.name[0] }}</span>
    <span class="text">
      <strong>{{ card.name }}</strong>
      <small>{{ card.role }}</small>
    </span>
    <span class="score" :aria-label="`${card.score} of 5`">
      <i v-for="star in 5" :key="star" :class="{ on: star <= card.score }" />
    </span>
  </li>
</template>

<style scoped>
.card {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 4px 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 9%, transparent),
    0 2px 4px -2px rgb(0 0 0 / 0.25);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.card:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

[data-dnd-overlay] .card {
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 12%, transparent),
    0 16px 28px -14px rgb(0 0 0 / 0.55);
  rotate: 1.5deg;
}

/* The slot the dragged card will land in. */
.card[data-dnd-placeholder] {
  opacity: 1;
}

.card[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1.5px dashed color-mix(in srgb, currentColor 30%, transparent);
  border-radius: inherit;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.avatar {
  display: grid;
  grid-row: span 2;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, hsl(var(--hue) 70% 62%), hsl(calc(var(--hue) + 40) 60% 42%));
  color: #fff;
  font-weight: 700;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.text small {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.6;
}

.score {
  display: flex;
  gap: 3px;
}

.score i {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  background: color-mix(in srgb, currentColor 15%, transparent);
}

.score i.on {
  background: #f59e0b;
}
</style>
