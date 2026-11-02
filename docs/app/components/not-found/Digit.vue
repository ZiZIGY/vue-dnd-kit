<script setup lang="ts">
  import { makeDraggable } from '@vue-dnd-kit/core';
  import DigitOverlay from './DigitOverlay.vue';

  /** A digit of the 404, to pick up and put back. In hand, DigitOverlay draws it. */
  const props = defineProps<{ digit: { id: string; glyph: string; tilt: number } }>();
  const el = useTemplateRef<HTMLElement>('el');
  const { isDragging } = makeDraggable(el, {
    id: () => props.digit.id,
    label: () => `digit ${props.digit.glyph}`,
    type: 'digit',
    data: () => ({ glyph: props.digit.glyph, tilt: props.digit.tilt }),
    overlay: DigitOverlay,
  });
</script>

<template>
  <!-- Its tilt is on the glyph: the box the drag measures stays upright. -->
  <div
    ref="el"
    :data-digit="digit.id"
    class="digit"
    :class="{ dragging: isDragging }"
  >
    <span
      class="glyph"
      :style="{ rotate: `${digit.tilt}deg` }"
      >{{ digit.glyph }}</span
    >
  </div>
</template>

<style scoped>
  /* The size of a slot (Slot.vue), in the digits' font size. */
  .digit {
    display: grid;
    place-items: center;
    width: 0.66em;
    height: 0.9em;
    border-radius: 2px;
    color: var(--ui-text-highlighted);
    cursor: grab;
    user-select: none;
  }

  .digit:focus-visible {
    outline: 2px solid var(--ui-primary);
    outline-offset: 6px;
  }

  .glyph {
    font-weight: 700;
    line-height: 1;
    transition: color 0.4s;
  }

  /* Where it was picked up from. */
  .dragging {
    opacity: 0.12;
  }
</style>
