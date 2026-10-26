<script setup lang="ts">
  /**
   * Content that comes into view: it rises, sharpens and fades in, once, the first time it
   * is on screen. `delay` staggers neighbours. Not for live demos: the filter it animates
   * would become the containing block of their fixed elements (selection boxes).
   */
  withDefaults(defineProps<{ as?: 'div' | 'p' | 'h2' | 'h3' | 'li' | 'span'; delay?: number; y?: number }>(), {
    as: 'div',
    delay: 0,
    y: 24,
  });
</script>

<template>
  <Motion
    :as="as"
    :initial="{ opacity: 0, y, filter: 'blur(6px)' }"
    :while-in-view="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
    :in-view-options="{ once: true, margin: '0px 0px -10% 0px' }"
    :transition="{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }"
  >
    <slot />
  </Motion>
</template>
