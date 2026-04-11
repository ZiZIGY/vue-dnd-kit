<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';
  import type { IPlacement } from '@vue-dnd-kit/core';
  import type { TaskItem } from './VModelGroup.vue';

  const props = defineProps<{
    item: TaskItem;
    index: number;
    items: TaskItem[];
  }>();

  const el = useTemplateRef<HTMLElement>('el');
  const { isDragging, isDragOver } = makeDraggable(el, { groups: ['item'] }, () => [props.index, props.items]);
  const placement = computed<IPlacement | undefined>(() => isDragOver.value);
</script>

<template>
  <div
    ref="el"
    class="task-item"
    :class="{ 'task-item--dragging': isDragging }"
    :style="{ '--c': item.color }"
  >
    <div
      v-if="placement?.top"
      class="ind ind--top"
    />
    <div
      v-if="placement?.bottom"
      class="ind ind--bottom"
    />
    <span
      class="dot"
      :style="{ background: item.color }"
    />
    <span class="label">{{ item.label }}</span>
  </div>
</template>

<style scoped>
  .task-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.35rem 0.6rem;
    border-radius: 6px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    cursor: grab;
    font-size: 0.8rem;
    transition: opacity 0.1s;

    /* See Mobile & Touch section */
    touch-action: none;
    user-select: none;
  }

  .task-item:hover {
    background: var(--vp-c-bg-mute);
  }

  .task-item--dragging {
    opacity: 0;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .label {
    color: var(--vp-c-text-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  }

  .ind--top { top: -2px; }
  .ind--bottom { bottom: -2px; }
</style>
