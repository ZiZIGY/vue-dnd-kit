<script setup lang="ts">
  import { computed } from 'vue';
  import type { OverlayProps } from '@vue-dnd-kit/core';
  import { cardOf } from './gallery';

  // Item-level overlay for photos: a polaroid instead of the flat row.
  const props = defineProps<OverlayProps>();
  const card = computed(() => cardOf(props.items[0]));
</script>

<template>
  <div
    class="photo-overlay"
    data-overlay-kind="photo"
    :style="{ '--hue': card?.hue ?? 210 }"
  >
    <span class="picture" />
    <span class="caption">{{ card?.title }}</span>
  </div>
</template>

<style scoped>
  .photo-overlay {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 100%;
    padding: 5px;
    box-sizing: border-box;
    background: var(--ui-surface);
    border-radius: var(--ui-radius-sm);
    box-shadow:
      0 0 0 1px var(--ui-border-accented),
      var(--ui-shadow-overlay);
    transform: rotate(1.5deg);
  }

  .picture {
    align-self: stretch;
    aspect-ratio: 4 / 3;
    border-radius: 2px;
    background:
      radial-gradient(circle at 70% 30%, rgb(255 255 255 / 0.7) 0 12%, transparent 13%),
      linear-gradient(160deg, hsl(var(--hue) 75% 62%), hsl(calc(var(--hue) + 60) 70% 40%));
  }

  .caption {
    font: italic 13px Georgia, serif;
    color: var(--ui-text-muted);
  }
</style>
