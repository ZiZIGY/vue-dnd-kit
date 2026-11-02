<script setup lang="ts">
  import type { OverlayProps } from '@vue-dnd-kit/core';

  /**
   * A digit in hand: straightened up and lifted, green over the slot that takes it, red over
   * one that doesn't. It lands straight where it is taken, and tilted back where it came from.
   */
  const props = defineProps<OverlayProps>();
  const digit = computed(() => props.active.data as { glyph: string; tilt: number });
  const tone = computed(() => (!props.over || props.over.id === 'paper' ? '' : props.accepted ? 'fit' : 'misfit'));
  const pose = computed(() =>
    props.status === 'dropping' ? { rotate: props.over?.accepted ? 0 : digit.value.tilt, scale: 1 } : { rotate: -4, scale: 1.08 },
  );
</script>

<template>
  <div
    class="overlay"
    :class="tone"
  >
    <Motion
      as="span"
      class="glyph"
      :initial="{ rotate: digit.tilt, scale: 1 }"
      :animate="pose"
      :transition="{ type: 'spring', stiffness: 380, damping: 24 }"
      >{{ digit.glyph }}</Motion
    >
  </div>
</template>

<style scoped>
  /* The box is the digit's (0.9em high): the glyph takes its size from it. */
  .overlay {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    container-type: size;
    color: var(--ui-text-highlighted);
    cursor: grabbing;
  }

  .glyph {
    font-size: calc(100cqh / 0.9);
    font-weight: 700;
    line-height: 1;
    filter: drop-shadow(0 18px 22px rgb(0 0 0 / 0.3));
    transition: color 0.2s;
  }

  .fit .glyph {
    color: var(--ui-primary);
  }

  .misfit .glyph {
    color: #f43f5e;
  }
</style>
