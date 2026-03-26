<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';
  import VModelGroup from './VModelGroup.vue';
  import type { Item } from './VModelGroup.vue';

  const props = defineProps<{
    item: Item;
    index: number;
    items: Item[];
  }>();

  const el = useTemplateRef<HTMLElement>('el');

  const { isDragging, isDragOver } = makeDraggable(
    el,
    {
      groups: [props.item.children ? 'column' : 'task'],
      dragHandle: props.item.children ? '.item-row' : undefined,
    },
    () => [props.index, props.items]
  );
</script>

<template>
  <div
    ref="el"
    class="item"
    :class="{
      'item--dragging': isDragging,
      'item--column': item.children,
      'item--over-top': !item.children && isDragOver?.top,
      'item--over-bottom': !item.children && isDragOver?.bottom,
      'item--over-left': item.children && isDragOver?.left,
      'item--over-right': item.children && isDragOver?.right,
    }"
  >

    <div class="item-row">
      <span
        v-if="item.color && !item.children"
        class="dot"
        :style="{ background: item.color }"
      />
      <span class="label">{{ item.title }}</span>
      <span
        v-if="item.children"
        class="count"
      >{{ item.children.length }}</span>
    </div>

    <VModelGroup
      v-if="item.children"
      v-model="item.children"
      group="task"
    />
  </div>
</template>

<style scoped>
  .item {
    position: relative;
    border-radius: 6px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    user-select: none;
    transition: opacity 0.1s;
    overflow: hidden;
  }

  .item:not(.item--column) {
    cursor: grab;
  }

  .item:not(.item--column):hover {
    background: var(--vp-c-bg-mute);
  }

  /* Column style */
  .item--column {
    min-width: 180px;
    flex: 1;
  }

  .item--column > .item-row {
    cursor: grab;
    border-bottom: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg-soft);
    font-weight: 600;
  }

  .item--column > .item-row:hover {
    background: var(--vp-c-bg-mute);
  }

  .item--dragging {
    opacity: 0;
  }

  .item--over-top {
    box-shadow: 0 -2px 0 0 var(--vp-c-brand-1);
  }

  .item--over-bottom {
    box-shadow: 0 2px 0 0 var(--vp-c-brand-1);
  }

  .item--over-left {
    box-shadow: -2px 0 0 0 var(--vp-c-brand-1);
  }

  .item--over-right {
    box-shadow: 2px 0 0 0 var(--vp-c-brand-1);
  }

  .item-row {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.4rem 0.6rem;
    font-size: 0.82rem;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .label {
    flex: 1;
    color: var(--vp-c-text-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .count {
    font-size: 0.68rem;
    font-weight: 400;
    color: var(--vp-c-text-3);
    background: var(--vp-c-bg-mute);
    border-radius: 10px;
    padding: 1px 7px;
  }

</style>
