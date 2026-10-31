<script setup lang="ts">
  import { computed } from 'vue';
  import type { OverlayProps } from '@vue-dnd-kit/core';
  import { seedOf } from './seeds';

  const props = defineProps<OverlayProps>();
  const seed = computed(() => seedOf(props.items[0]));
</script>

<template>
  <div
    class="seed-card"
    data-overlay-kind="card"
  >
    <span aria-hidden="true">{{ seed?.icon }}</span>
    {{ seed?.title }}
  </div>
</template>

<style scoped>
  .seed-card {
    display: flex;
    gap: 8px;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 0 12px;
    background: #fff;
    border: 1px solid #a3a3a3;
    border-radius: 8px;
    box-shadow: 0 12px 24px -10px rgb(0 0 0 / 0.4);
    rotate: 2deg;
  }
</style>
