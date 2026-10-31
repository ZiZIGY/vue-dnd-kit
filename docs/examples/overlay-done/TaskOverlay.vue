<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem } from '@vue-dnd-kit/core';

// The tasks' own overlay: the card, lifted.
const props = defineProps<{ items: DragItem[] }>();
const task = computed(() => props.items[0]?.item as { title: string; who: string; hue: number });
</script>

<template>
  <div class="task-overlay">
    <span class="check" aria-hidden="true">
      <svg viewBox="0 0 16 16"><path d="m4 8.5 2.5 2.5L12 5.5" /></svg>
    </span>
    <span class="title"><span class="text">{{ task.title }}</span></span>
    <span class="who" :style="{ '--hue': task.hue }">{{ task.who }}</span>
  </div>
</template>

<style scoped>
.task-overlay {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1.5px color-mix(in srgb, currentColor 18%, transparent),
    0 18px 32px -14px rgb(0 0 0 / 0.55);
  font-size: 13px;
  rotate: 1.5deg;
}

.check {
  display: grid;
  flex: none;
  place-items: center;
  width: 16px;
  height: 16px;
  margin-top: 1px;
  border: 1.5px solid color-mix(in srgb, currentColor 30%, transparent);
  border-radius: 50%;
}

.check svg {
  width: 11px;
  height: 11px;
  fill: none;
  stroke: #04130c;
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
}

.title {
  flex: 1;
  line-height: 1.35;
}

/* A line Done draws through each line of the title (see DoneOverlay). */
.text {
  background: linear-gradient(currentColor, currentColor) no-repeat 0 58% / 0 1.5px;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

.who {
  flex: none;
  padding: 2px 5px;
  border-radius: 6px;
  background: hsl(var(--hue) 70% 50% / 0.18);
  color: hsl(var(--hue) 60% 45%);
  font-size: 10px;
  font-weight: 700;
}
</style>
