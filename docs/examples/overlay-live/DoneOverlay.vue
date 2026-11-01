<script setup lang="ts">
import { computed } from 'vue';
import type { DnDStatus, DragItem } from '@vue-dnd-kit/core';

// Done's overlay, while a ticket it takes is over it: it wraps the ticket's own (its
// default slot) in a stamp, and a ticket from another column gets confetti on drop. The
// drop waits for the confetti to settle.
const props = defineProps<{ items: DragItem[]; status: DnDStatus }>();
const arrives = computed(() => (props.items[0]?.data as { column: string }).column !== 'Done');

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
  <div class="done">
    <slot />
    <span class="stamp">Shipped</span>
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

/* On the card's top edge, left: a copy's badge takes the right. */
.stamp {
  position: absolute;
  top: -9px;
  left: 10px;
  padding: 2px 7px;
  border: 1.5px solid #42b883;
  border-radius: 6px;
  background: Canvas;
  color: #42b883;
  font: 700 10px/1.2 ui-monospace, Menlo, Consolas, monospace;
  text-transform: uppercase;
  rotate: -8deg;
  animation: stamp 0.25s cubic-bezier(0.2, 0.8, 0.3, 1.3);
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

@keyframes stamp {
  from {
    scale: 1.8;
    opacity: 0;
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
  .stamp {
    animation: none;
  }

  .confetti {
    display: none;
  }
}
</style>
