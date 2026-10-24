<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import type { Task } from '../types';

  // `size` must match the virtualizer's item size exactly (VueUse `itemHeight`).
  const props = defineProps<{ item: Task; size: number }>();
  const el = useTemplateRef<HTMLElement>('el');
  // A getter: virtual lists may hand this component another item.
  makeSortableItem(el, { id: () => props.item.id });
</script>

<template>
  <div
    ref="el"
    class="vrow"
    :data-id="item.id"
    :style="{ height: `${size}px` }"
  >
    {{ item.title }}
  </div>
</template>

<style scoped>
  .vrow {
    display: flex;
    align-items: center;
    padding: 0 12px;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
    cursor: grab;
  }
</style>
