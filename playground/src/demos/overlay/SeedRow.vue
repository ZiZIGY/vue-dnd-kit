<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import type { Seed } from './seeds';

  const props = defineProps<{ seed: Seed; depth?: number }>();
  makeSortableItem(useTemplateRef<HTMLElement>('el'), { item: () => props.seed });
</script>

<template>
  <li
    ref="el"
    class="seed-row"
    :data-id="seed.id"
    :style="depth ? { marginLeft: `${depth * 20}px` } : undefined"
  >
    <span aria-hidden="true">{{ seed.icon }}</span>
    {{ seed.title }}
  </li>
</template>

<style scoped>
  .seed-row {
    display: flex;
    gap: 8px;
    align-items: center;
    height: 40px;
    padding: 0 12px;
    background: var(--ui-surface);
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius);
    cursor: grab;
    user-select: none;
  }
</style>
