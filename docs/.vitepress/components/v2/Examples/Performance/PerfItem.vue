<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';
  import type { IPlacement } from '@vue-dnd-kit/core';

  export interface PerfItemData {
    id: number;
    label: string;
    color: string;
  }

  const props = defineProps<{
    index: number;
    items: PerfItemData[];
    item: PerfItemData;
  }>();

  const el = useTemplateRef<HTMLElement>('el');
  const { isDragging, isDragOver } = makeDraggable(
    el,
    { id: String(props.item.id) },
    () => [props.index, props.items]
  );
  const placement = computed<IPlacement | undefined>(() => isDragOver.value);
</script>

<template>
  <div
    ref="el"
    class="perf-item"
    :class="{ dragging: isDragging }"
    :style="{ '--accent': item.color }"
  >
    <div
      v-if="placement?.top"
      class="ind ind--top"
    />
    <div
      v-if="placement?.bottom"
      class="ind ind--bottom"
    />
    <span class="stripe" />
    <span class="label">{{ item.label }}</span>
    <span class="num">{{ item.id }}</span>
  </div>
</template>

<style scoped>
  .perf-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    border-radius: 6px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    cursor: grab;
    user-select: none;
    font-size: 0.8125rem;
    transition: opacity 0.1s;
    box-sizing: border-box;
    width: 100%;
  }
  .perf-item.dragging {
    opacity: 0;
  }
  .stripe {
    width: 3px;
    height: 20px;
    border-radius: 2px;
    background: var(--accent);
    flex-shrink: 0;
  }
  .label {
    flex: 1;
    color: var(--vp-c-text-1);
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .num {
    color: var(--vp-c-text-3);
    font-size: 0.72rem;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }
  .ind {
    position: absolute;
    left: 4px;
    right: 4px;
    height: 2px;
    background: var(--vp-c-brand-1);
    pointer-events: none;
    z-index: 1;
    border-radius: 2px;
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent);
  }
  .ind--top {
    top: -2px;
  }
  .ind--bottom {
    bottom: -2px;
  }
</style>
