<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';

  const props = defineProps<{ card: { id: string; n: number; hue: number } }>();
  makeSortableItem(useTemplateRef<HTMLElement>('el'), { item: () => props.card });
</script>

<template>
  <li
    ref="el"
    class="row card"
    :data-id="card.id"
    :style="{ '--hue': card.hue }"
  >
    <span class="swatch" />
    Card {{ card.n }}
  </li>
</template>

<style scoped>
  .card {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .swatch {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    background: hsl(var(--hue) 70% 60%);
  }
</style>
