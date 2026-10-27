<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ card: { id: string; rank: string; suit: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.card });
</script>

<template>
  <div ref="el" class="card" :class="{ red: '♥♦'.includes(card.suit) }" :aria-label="card.id">
    <span class="rank">{{ card.rank }}</span>
    <span class="suit">{{ card.suit }}</span>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  display: grid;
  place-items: center;
  width: 64px;
  height: 90px;
  border-radius: 8px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 14%, transparent),
    0 4px 10px -6px rgb(0 0 0 / 0.5);
  cursor: grab;
  user-select: none;
}

.card.red > * {
  color: #ef4444;
}

.card:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

[data-dnd-overlay] .card {
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 14%, transparent),
    0 18px 30px -12px rgb(0 0 0 / 0.6);
}

/* The empty spot it lands on. */
.card[data-dnd-placeholder] {
  opacity: 1;
  background: none;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 50%, transparent);
}

.card[data-dnd-placeholder] > * {
  visibility: hidden;
}

.rank {
  position: absolute;
  top: 6px;
  left: 8px;
  font: 700 13px/1 Georgia, 'Times New Roman', serif;
}

.suit {
  font-size: 30px;
  line-height: 1;
}
</style>
