<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem } from '@vue-dnd-kit/core';

// The messages' own overlay: the subject of the grabbed one, and how many go along.
const props = defineProps<{ items: DragItem[] }>();
const subject = computed(() => (props.items[0]?.data as { subject: string }).subject);
</script>

<template>
  <!-- The box has the row's size, centered on the cursor: the chip sits in its middle. -->
  <div class="chip-box">
    <span class="chip">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
      <span class="subject">{{ subject }}</span>
      <span v-if="items.length > 1" class="count">{{ items.length }}</span>
    </span>
  </div>
</template>

<style scoped>
.chip-box {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
}

.chip {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 240px;
  padding: 8px 12px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 12%, transparent),
    0 14px 28px -12px rgb(0 0 0 / 0.5);
  font-size: 13px;
  font-weight: 500;
}

svg {
  flex: none;
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.6;
}

.subject {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.count {
  flex: none;
  min-width: 18px;
  padding: 2px 6px;
  border-radius: 99px;
  background: #42b883;
  color: #04130c;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
}
</style>
