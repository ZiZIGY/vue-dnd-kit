<script setup lang="ts">
  import { computed } from 'vue';
  import { useDnD } from '@vue-dnd-kit/core';

  /** Session state for the phone demos, plus a bar that fills during a long press. */
  const { status, activation, isAutoScrolling, active } = useDnD();
  const progress = computed(() => activation.progress.value);
</script>

<template>
  <p class="touch-status">
    <span>status: <output data-testid="status">{{ status }}</output></span>
    <span>active: <output data-testid="active">{{ active?.id ?? '' }}</output></span>
    <span>press: <output data-testid="progress">{{ progress.toFixed(2) }}</output></span>
    <span>auto-scroll: <output data-testid="autoscrolling">{{ isAutoScrolling }}</output></span>
  </p>
  <!-- Fills while a finger is held on an item; `pointer-events: none` keeps it out of hit-testing. -->
  <div
    class="press-bar"
    data-testid="press-bar"
    :class="{ pressing: status === 'activating' }"
    :style="{ transform: `scaleX(${status === 'activating' ? progress : 0})` }"
  />
</template>

<style scoped>
  .touch-status {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    margin: 0 0 8px;
    font-size: 12px;
    color: var(--ui-text-muted);
  }

  .touch-status output {
    font-variant-numeric: tabular-nums;
    color: var(--ui-text-highlighted);
  }

  .press-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
    height: 4px;
    background: var(--ui-primary);
    transform-origin: left center;
    pointer-events: none;
  }
</style>
