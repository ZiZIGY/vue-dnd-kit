<script setup lang="ts">
  import { computed } from 'vue';
  import type { OverlayProps } from '@vue-dnd-kit/core';
  import { seedOf } from './seeds';

  // The tree's rows: `to` says where the drop would nest, so the overlay names the bed.
  const props = defineProps<OverlayProps>();
  const plant = computed(() => seedOf(props.items[0]));
  const where = computed(() => {
    const to = props.to;
    if (!to) return 'nowhere';
    return to.parentKey == null ? 'top level' : `into ${String(to.parentKey)}`;
  });
</script>

<template>
  <div
    class="bed-overlay"
    data-overlay-kind="plant"
    :data-parent="to?.parentKey ?? undefined"
    :data-depth="to?.depth"
  >
    <span>{{ plant?.icon }} {{ plant?.title }}</span>
    <small data-testid="plant-where">{{ where }}</small>
  </div>
</template>

<style scoped>
  .bed-overlay {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 12px;
    background: var(--ui-surface);
    border: 1px solid var(--ui-border-strong);
    border-radius: var(--ui-radius);
    box-shadow: var(--ui-shadow-overlay);
  }

  small {
    color: var(--ui-primary);
    font-family: var(--font-mono);
  }
</style>
