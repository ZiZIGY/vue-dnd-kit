<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ card: { id: number; title: string; color: string; people: string[]; due: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.card });
</script>

<template>
  <li ref="el" class="card" :style="{ '--color': card.color }">
    <span class="cover" />
    <strong>{{ card.title }}</strong>
    <span class="meta">
      <span v-for="person in card.people" :key="person" class="avatar">{{ person }}</span>
      <span class="due">{{ card.due }}</span>
    </span>
  </li>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px 12px;
  border-radius: 12px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 10%, transparent),
    0 2px 4px -2px rgb(0 0 0 / 0.3);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.card:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* The slot left in the list: an empty, dashed place. */
.card[data-dnd-placeholder] {
  opacity: 1;
  background: none;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 22%, transparent);
}

.card[data-dnd-placeholder] > * {
  visibility: hidden;
}

/*
 * The copy in the overlay. Its root has `transition: none` set inline, so it moves
 * with keyframes. Only for people who don't ask for less motion.
 */
@media (prefers-reduced-motion: no-preference) {
  /* Picked up: it lifts and tilts. */
  [data-dnd-overlay='dragging'] .card {
    animation: lift 0.22s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }

  /* Let go: it lies flat again while it lands. */
  [data-dnd-overlay='dropping'] .card {
    animation: settle 0.25s ease-in forwards;
  }

  /* The slot opens where the card was. */
  .card[data-dnd-placeholder] {
    animation: open 0.2s ease-out;
  }
}

@keyframes lift {
  to {
    rotate: 3deg;
    scale: 1.04;
    box-shadow:
      0 0 0 1px color-mix(in srgb, currentColor 10%, transparent),
      0 22px 36px -14px rgb(0 0 0 / 0.6);
  }
}

@keyframes settle {
  from {
    rotate: 3deg;
    scale: 1.04;
    box-shadow:
      0 0 0 1px color-mix(in srgb, currentColor 10%, transparent),
      0 22px 36px -14px rgb(0 0 0 / 0.6);
  }
}

@keyframes open {
  from {
    scale: 0.94;
    opacity: 0;
  }
}

.cover {
  height: 6px;
  border-radius: 3px;
  background: var(--color);
}

strong {
  font-weight: 600;
}

.meta {
  display: flex;
  align-items: center;
  gap: 4px;
}

.avatar {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color) 22%, Canvas);
  font-size: 9px;
  font-weight: 700;
}

.due {
  margin-left: auto;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}
</style>
