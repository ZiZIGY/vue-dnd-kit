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
    background: #ecfdf5;
    border: 2px solid #10b981;
    border-radius: 8px;
    box-shadow: 0 12px 24px -10px rgb(6 95 70 / 0.5);
  }

  .check {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: #10b981;
    color: #fff;
    font-size: 12px;
  }

  .title {
    flex: 1;
  }

  small {
    color: #047857;
  }
</style>
