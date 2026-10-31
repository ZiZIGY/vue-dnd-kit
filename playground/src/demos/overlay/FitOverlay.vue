<script setup lang="ts">
  import { computed, shallowRef, useTemplateRef } from 'vue';
  import { useResizeObserver } from '@vueuse/core';
  import type { OverlayProps } from '@vue-dnd-kit/core';
  import { cardOf } from './gallery';

  // Fills the overlay box (width/height 100%), so it takes whatever size the box has:
  // the target slot with `overlayFit: 'slot'`, the source with `'source'`.
  const props = defineProps<OverlayProps>();
  const card = computed(() => cardOf(props.items[0]));

  const el = useTemplateRef<HTMLElement>('el');
  const size = shallowRef('');
  useResizeObserver(el, () => {
    if (el.value) size.value = `${el.value.offsetWidth} × ${el.value.offsetHeight}`;
  });
</script>

<template>
  <div
    ref="el"
    class="fit-overlay"
    data-overlay-kind="fit"
  >
    <strong>{{ card?.title }}</strong>
    <code>{{ size }}</code>
  </div>
</template>

<style scoped>
  .fit-overlay {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    height: 100%;
    padding: 0 12px;
    box-sizing: border-box;
    overflow: hidden;
    background: #eef2ff;
    border: 2px solid #6366f1;
    border-radius: 8px;
    box-shadow: 0 12px 24px -10px rgb(30 27 75 / 0.45);
  }

  code {
    color: #4f46e5;
    font-size: 11px;
    white-space: nowrap;
  }
</style>
