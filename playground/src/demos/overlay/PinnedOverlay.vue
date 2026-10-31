<script setup lang="ts">
  import { computed } from 'vue';
  import type { OverlayProps } from '@vue-dnd-kit/core';
  import { ICONS, cardOf } from './gallery';

  // List-level overlay (`makeSortableList({ overlay })`): every item of the list without one of its own.
  const props = defineProps<OverlayProps>();
  const card = computed(() => cardOf(props.items[0]));
</script>

<template>
  <div
    class="pinned-overlay"
    data-overlay-kind="list"
  >
    <span class="icon">{{ card ? ICONS[card.kind] : '' }}</span>
    <span class="title">{{ card?.title }}</span>
    <span class="tag">pinned</span>
  </div>
</template>

<style scoped>
  .pinned-overlay {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 100%;
    padding: 0 12px;
    box-sizing: border-box;
    /* Inverted: dark on a light page, light on a dark one. */
    background: var(--ui-text-highlighted);
    color: var(--ui-text-inverted);
    border-radius: var(--ui-radius);
    box-shadow: var(--ui-shadow-overlay);
  }

  .icon {
    opacity: 0.7;
  }

  .title {
    flex: 1;
    font-weight: 600;
  }

  .tag {
    padding: 1px 8px;
    border-radius: var(--ui-radius-sm);
    background: #f59e0b;
    color: #111827;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
  }
</style>
