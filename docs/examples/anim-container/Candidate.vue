<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ person: { id: string; name: string; role: string; hue: number } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.person });

const initials = computed(() =>
  props.person.name
    .split(' ')
    .map((word) => word[0])
    .join(''),
);
</script>

<template>
  <li ref="el" class="candidate">
    <span class="avatar" :style="{ background: `hsl(${person.hue} 60% 45%)` }">{{ initials }}</span>
    <span class="text">
      <strong>{{ person.name }}</strong>
      <small>{{ person.role }}</small>
    </span>
  </li>
</template>

<style scoped>
.candidate {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 9%, transparent),
    0 2px 4px -2px rgb(0 0 0 / 0.25);
  cursor: grab;
  user-select: none;
}

.candidate:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

[data-dnd-overlay] .candidate {
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 9%, transparent),
    0 18px 30px -12px rgb(0 0 0 / 0.55);
}

/* The dragged card's own element, left as its slot: a glowing, empty place. */
.candidate[data-dnd-placeholder] {
  opacity: 1;
  background: color-mix(in srgb, #42b883 10%, Canvas);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 55%, transparent);
}

.candidate[data-dnd-placeholder] > * {
  visibility: hidden;
}

@media (prefers-reduced-motion: no-preference) {
  /* Opens where it appears, then breathes until the card lands. */
  .candidate[data-dnd-placeholder] {
    animation:
      open 0.2s ease-out,
      breathe 1.2s ease-in-out 0.2s infinite;
  }
}

@keyframes open {
  from {
    scale: 0.92;
    opacity: 0;
  }
}

@keyframes breathe {
  50% {
    background: color-mix(in srgb, #42b883 18%, Canvas);
  }
}

.avatar {
  display: grid;
  flex: none;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

.text {
  display: flex;
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
</style>
