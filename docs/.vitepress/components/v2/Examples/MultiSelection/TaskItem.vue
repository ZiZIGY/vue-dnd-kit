<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';
  import type { IPlacement } from '@vue-dnd-kit/core';

  interface Task {
    id: number;
    name: string;
  }

  const props = defineProps<{
    index: number;
    items: Task[];
    task: Task;
  }>();

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  const { isDragging, isDragOver, selected } = makeDraggable(
    itemRef,
    { dragHandle: '.handle' },
    () => [props.index, props.items]
  );

  const placement = computed<IPlacement | undefined>(() => isDragOver.value);
</script>

<template>
  <div
    ref="itemRef"
    class="task"
    :class="{ 'task--dragging': isDragging, 'task--selected': selected }"
  >
    <div
      v-if="placement?.top"
      class="indicator indicator--top"
    />
    <div
      v-if="placement?.bottom"
      class="indicator indicator--bottom"
    />

    <input
      v-model="selected"
      type="checkbox"
      class="checkbox"
      aria-label="Select task"
    />

    <span class="name">{{ task.name }}</span>

    <button
      class="handle"
      aria-label="Drag handle"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="currentColor"
        aria-hidden="true"
      >
        <circle cx="4" cy="3.5" r="1.1" />
        <circle cx="4" cy="7" r="1.1" />
        <circle cx="4" cy="10.5" r="1.1" />
        <circle cx="9" cy="3.5" r="1.1" />
        <circle cx="9" cy="7" r="1.1" />
        <circle cx="9" cy="10.5" r="1.1" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
  .task {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 0.75rem;
    border-radius: 8px;
    background-color: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    transition: background-color 0.15s, border-color 0.15s, opacity 0.15s;
  }

  .task--selected {
    background-color: rgba(62, 175, 124, 0.1);
    border-color: rgba(62, 175, 124, 0.4);
  }

  .task--dragging {
    opacity: 0.35;
  }

  .checkbox {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    accent-color: var(--vp-c-brand-1);
    cursor: pointer;
  }

  .name {
    flex: 1;
    font-size: 0.875rem;
    color: var(--vp-c-text-1);
  }

  .handle {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 0.2rem;
    border-radius: 4px;
    border: none;
    background: transparent;
    color: var(--vp-c-text-3);
    cursor: grab;
    transition: color 0.15s;

    /* See Mobile & Touch section */
    touch-action: none;
    user-select: none;
  }

  .handle:active {
    cursor: grabbing;
  }

  .handle:hover {
    color: var(--vp-c-text-2);
  }

  .indicator {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--vp-c-brand-1);
    border-radius: 1px;
    pointer-events: none;
  }

  .indicator--top {
    top: -1px;
  }

  .indicator--bottom {
    bottom: -1px;
  }
</style>
