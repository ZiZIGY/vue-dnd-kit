<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import DropletOverlay from './DropletOverlay.vue';

  const emit = defineEmits<{ watered: [id: string] }>();
  const { isOver } = makeDroppable(useTemplateRef<HTMLElement>('el'), {
    id: 'water',
    // Over the water a seed becomes a droplet. Dropped, it doesn't fly anywhere: it
    // splashes where it is (the droplet's own animation, which the drop waits for).
    overlay: DropletOverlay,
    dropAnimation: false,
    onDrop: (event) => {
      emit('watered', String(event.active.id));
      event.source?.remove();
    },
  });
</script>

<template>
  <div
    ref="el"
    class="water"
    data-testid="zone-water"
    :data-over="isOver || undefined"
  >
    💧 Water
  </div>
</template>

<style scoped>
  .water {
    display: grid;
    place-items: center;
    width: 220px;
    height: 120px;
    /* Water: blue on either theme. */
    --water: #3b82f6;
    font-weight: 600;
    color: color-mix(in srgb, var(--water) 75%, var(--ui-text-highlighted));
    background: color-mix(in srgb, var(--water) 8%, var(--ui-bg));
    border: 2px dashed color-mix(in srgb, var(--water) 50%, var(--ui-bg));
    border-radius: var(--ui-radius-lg);
    transition: background-color 120ms;
  }

  .water[data-over] {
    background: color-mix(in srgb, var(--water) 18%, var(--ui-bg));
  }
</style>
