<script setup lang="ts">
  /**
   * A short green light running along a rule. Place it over the rule: a 1px strip
   * (`absolute inset-y-0 -left-px w-px` for a vertical one, `inset-x-0 -top-px h-px` across).
   */
  withDefaults(defineProps<{ axis?: 'x' | 'y'; delay?: string }>(), { axis: 'y', delay: '0s' });
</script>

<template>
  <span
    aria-hidden="true"
    class="pointer-events-none absolute z-10 overflow-hidden max-md:hidden"
  >
    <span
      class="absolute"
      :class="
        axis === 'y'
          ? 'inset-x-0 top-0 h-1/5 animate-beam-y bg-linear-to-b from-transparent via-(--color-accent) to-transparent'
          : 'inset-y-0 left-0 w-1/5 animate-beam-x bg-linear-to-r from-transparent via-(--color-accent) to-transparent'
      "
      :style="{ animationDelay: delay }"
    />
  </span>
</template>
