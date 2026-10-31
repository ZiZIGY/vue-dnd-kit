<script setup lang="ts">
  import { computed } from 'vue';
  import type { OverlayProps } from '@vue-dnd-kit/core';
  import { seedOf } from './seeds';

  const props = defineProps<OverlayProps>();
  const seed = computed(() => seedOf(props.items[0]));
</script>

<template>
  <div
    class="seed-chip"
    data-overlay-kind="chip"
  >
    <span>{{ seed?.icon }} {{ seed?.title }}</span>
  </div>
</template>

<style scoped>
  .seed-chip {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
  }

  span {
    padding: 4px 10px;
    font-size: 13px;
    color: var(--ui-on-primary);
    background: var(--ui-primary);
    border-radius: var(--ui-radius-sm);
    box-shadow: var(--ui-shadow-overlay);
  }
</style>
