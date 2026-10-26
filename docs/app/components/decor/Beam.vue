<script setup lang="ts">
  /** A light pulse running along a 1px track: the system is alive. Place it on a positioned track. */
  withDefaults(defineProps<{ axis?: 'x' | 'y'; duration?: number; delay?: number; length?: number }>(), {
    axis: 'x',
    duration: 5,
    delay: 0,
    length: 25,
  });
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 overflow-hidden"
  >
    <div
      class="absolute"
      :class="axis === 'x' ? 'inset-y-0 left-0 animate-beam-x' : 'inset-x-0 top-0 animate-beam-y'"
      :style="{
        [axis === 'x' ? 'width' : 'height']: `${length}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        background: `linear-gradient(to ${axis === 'x' ? 'right' : 'bottom'}, transparent, var(--ui-text-highlighted), transparent)`,
      }"
    />
  </div>
</template>
