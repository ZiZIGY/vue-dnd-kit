<script setup lang="ts">
  import { computed } from 'vue';
  import type { OverlayProps } from '@vue-dnd-kit/core';
  import { cardOf } from './gallery';

  // Rendered by the provider's #overlay slot, for tasks only.
  const props = defineProps<OverlayProps>();
  const card = computed(() => cardOf(props.items[0]));
</script>

<template>
  <div
    class="task-overlay"
    data-overlay-kind="slot"
  >
    <span class="check">✓</span>
    <span class="title">{{ card?.title }}</span>
    <small>provider slot</small>
  </div>
</template>

<style scoped>
  .task-overlay {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 100%;
    padding: 0 12px;
    box-sizing: border-box;
    background: var(--ui-primary-soft);
    border: 2px solid var(--ui-primary);
    border-radius: var(--ui-radius);
    box-shadow: var(--ui-shadow-overlay);
  }

  .check {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border-radius: var(--ui-radius-sm);
    background: var(--ui-primary);
    color: var(--ui-on-primary);
    font-size: 12px;
  }

  .title {
    flex: 1;
    color: var(--ui-text-highlighted);
  }

  small {
    color: var(--ui-primary);
    font-family: var(--font-mono);
  }
</style>
