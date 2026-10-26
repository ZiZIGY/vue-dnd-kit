<script setup lang="ts">
  /** A blueprint background, faded by a mask so it recedes from the text. Decorative only. */
  const props = withDefaults(
    defineProps<{
      variant?: 'dots' | 'grid' | 'hatch' | 'cross' | 'glow';
      fade?: 'none' | 'radial' | 'left' | 'right' | 'top' | 'bottom' | 'top-right';
    }>(),
    { variant: 'dots', fade: 'radial' },
  );

  const PAPER = { dots: 'dot-paper', grid: 'grid-paper', hatch: 'hatch-paper', cross: 'cross-paper', glow: 'glow-paper' };
  const MASK = {
    none: '',
    radial: 'mask-show-radial',
    left: 'mask-show-left',
    right: 'mask-show-right',
    top: 'mask-show-top',
    bottom: 'mask-show-bottom',
    'top-right': 'mask-show-top-right',
  };
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0"
    :class="MASK[props.fade]"
  >
    <div
      class="absolute inset-0"
      :class="PAPER[props.variant]"
    />
  </div>
</template>
