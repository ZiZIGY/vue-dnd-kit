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
    background: var(--ui-primary-soft);
    border: 2px solid var(--ui-primary);
    border-radius: var(--ui-radius);
    box-shadow: var(--ui-shadow-overlay);
  }

  code {
    color: var(--ui-primary);
    font-size: 11px;
    white-space: nowrap;
  }
</style>
