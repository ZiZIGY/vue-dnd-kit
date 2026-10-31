<script setup lang="ts">
import { computed } from 'vue';
import type { DnDStatus, DragItem } from '@vue-dnd-kit/core';

// Done's overlay wraps the task's own (its default slot): the check fills in, a line
// crosses the title, and a task that arrives from another column gets confetti on drop.
// The drop waits for the confetti to settle.
const props = defineProps<{ items: DragItem[]; status: DnDStatus }>();
const arrives = computed(() => (props.items[0]?.data as { column: string } | undefined)?.column !== 'done');

const COLORS = ['#42b883', '#f59e0b', '#3b82f6', '#ec4899', '#a855f7'];
const BITS = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  const reach = 46 + (i % 3) * 14;
  return {
    '--x': `${Math.cos(angle) * reach}px`,
    '--y': `${Math.sin(angle) * reach - 10}px`,
    '--turn': `${(i % 2 ? 1 : -1) * (180 + i * 20)}deg`,
    background: COLORS[i % COLORS.length],
  };
});
</script>

<template>
  <div class="done" :class="{ arrives }">
    <slot />
    <span v-if="status === 'dropping' && arrives" class="confetti" aria-hidden="true">
      <i v-for="(bit, i) in BITS" :key="i" :style="bit" />
    </span>
  </div>
</template>

<style scoped>
.done {
  position: relative;
  width: 100%;
  height: 100%;
}

/* The task's own overlay, inside: its check fills in and a line crosses its title. */
.done :deep(.check) {
  border-color: #42b883;
  background: #42b883;
  animation: fill 0.25s ease-out;
}

.done :deep(.check svg) {
  opacity: 1;
}

.done :deep(.text) {
  background-size: 100% 1.5px;
  animation: strike 0.3s ease-out;
}

.done :deep(.task-overlay) {
  box-shadow:
    0 0 0 1.5px #42b883,
    0 18px 32px -14px rgb(0 0 0 / 0.55);
}

.confetti {
  position: absolute;
  top: 50%;
  left: 50%;
}

.confetti i {
  position: absolute;
  width: 6px;
  height: 9px;
  border-radius: 1px;
  animation: burst 0.65s cubic-bezier(0.15, 0.7, 0.3, 1) forwards;
}

@keyframes fill {
  from {
    scale: 0.4;
  }
}

@keyframes strike {
  from {
    background-size: 0 1.5px;
  }
}

@keyframes burst {
  from {
    translate: 0 0;
    rotate: 0deg;
    opacity: 1;
  }

  to {
    translate: var(--x) var(--y);
    rotate: var(--turn);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .confetti {
    display: none;
  }
}
</style>
