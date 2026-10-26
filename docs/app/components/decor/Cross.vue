<script setup lang="ts">
  /**
   * A "+" where two rules of the frame meet. Place it in a `relative` box, on one of its corners.
   * Phones have no room around the frame for it.
   */
  withDefaults(defineProps<{ at?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }>(), { at: 'bottom-left' });

  const PLACES = {
    'top-left': '-top-[6px] -left-[6px]',
    'top-right': '-top-[6px] -right-[6px]',
    'bottom-left': '-bottom-[6px] -left-[6px]',
    'bottom-right': '-bottom-[6px] -right-[6px]',
  };
</script>

<template>
  <span
    aria-hidden="true"
    class="pointer-events-none absolute z-10 size-[11px] max-sm:hidden text-(--ui-text-dimmed) before:absolute before:inset-x-0 before:top-[5px] before:h-px before:bg-current after:absolute after:inset-y-0 after:left-[5px] after:w-px after:bg-current"
    :class="PLACES[at]"
  />
</template>
