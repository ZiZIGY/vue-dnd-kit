<script setup lang="ts">
  import { computed } from 'vue';
  import type { OverlayProps } from '@vue-dnd-kit/core';
  import { ICONS, cardOf } from './gallery';

  // One overlay for the whole multi-drag: `items` holds every dragged card, the grabbed one first.
  const props = defineProps<OverlayProps>();
  const cards = computed(() => props.items.map(cardOf));
  /** Sheets drawn behind the top card; more items only raise the count. */
  const sheets = computed(() => Math.min(props.items.length - 1, 3));
  const top = computed(() => cards.value[0]);
</script>

<template>
  <div
    class="stack-overlay"
    data-overlay-kind="stack"
    :data-count="items.length"
  >
    <span
      v-for="index in sheets"
      :key="index"
      class="sheet"
      data-testid="stack-sheet"
      :style="{ '--depth': index }"
    />
    <div class="top">
      <span class="icon">{{ top ? ICONS[top.kind] : '' }}</span>
      <span class="title">{{ top?.title }}</span>
      <span
        v-if="items.length > 1"
        class="others"
        >+ {{ cards.slice(1).map((card) => card?.title).join(', ') }}</span
      >
    </div>
    <span
      v-if="items.length > 1"
      class="count"
      data-testid="stack-count"
      >{{ items.length }}</span
    >
  </div>
</template>

<style scoped>
  .stack-overlay {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .sheet,
  .top {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    border-radius: 8px;
    background: #fff;
    border: 1px solid #c7d2fe;
  }

  /* Each sheet sits a little lower, to the right and turned. */
  .sheet {
    transform: translate(calc(var(--depth) * 5px), calc(var(--depth) * 5px)) rotate(calc(var(--depth) * 1.5deg));
    background: hsl(230 80% calc(98% - var(--depth) * 3%));
    box-shadow: 0 4px 10px -6px rgb(30 27 75 / 0.4);
  }

  .sheet:nth-of-type(1) {
    z-index: 3;
  }

  .sheet:nth-of-type(2) {
    z-index: 2;
  }

  .sheet:nth-of-type(3) {
    z-index: 1;
  }

  .top {
    z-index: 4;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 12px;
    border-color: #6366f1;
    box-shadow: 0 14px 28px -12px rgb(30 27 75 / 0.55);
  }

  .title {
    font-weight: 600;
  }

  .others {
    overflow: hidden;
    color: #6b7280;
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .count {
    position: absolute;
    z-index: 5;
    top: -10px;
    right: -10px;
    min-width: 24px;
    height: 24px;
    padding: 0 7px;
    box-sizing: border-box;
    border-radius: 12px;
    background: #4f46e5;
    color: #fff;
    font: 700 12px/24px system-ui, sans-serif;
    text-align: center;
  }
</style>
