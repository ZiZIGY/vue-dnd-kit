<script setup lang="ts">
  import { makeDraggable } from '../../../packages/core/src/external';
  import { computed, useTemplateRef } from 'vue';
  import type { IPlacement } from '../../../packages/core/src/external/types';

  const node = useTemplateRef<HTMLElement>('draggableRef');

  const { selected, isDragging, isDragOver } = makeDraggable(node as any, {
    groups: ['draggable'],
    dragHandle: '.drag-handle',
  });

  const placement = computed<IPlacement | undefined>(() => isDragOver.value);

  const emits = defineEmits<{
    test: [void];
  }>();
</script>

<template>
  <div
    ref="draggableRef"
    class="draggable"
    :class="{ 'is-dragging': isDragging }"
  >
    <div v-if="placement?.top" class="indicator top"></div>
    <div v-if="placement?.bottom" class="indicator bottom"></div>
    <div v-if="placement?.left" class="indicator left"></div>
    <div v-if="placement?.right" class="indicator right"></div>
    <input
      type="checkbox"
      v-model="selected"
    />
    <button class="drag-handle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        aria-label="Drag handle"
      >
        <circle
          cx="5"
          cy="6"
          r="1.5"
          fill="#fff"
        />
        <circle
          cx="5"
          cy="10"
          r="1.5"
          fill="#fff"
        />
        <circle
          cx="5"
          cy="14"
          r="1.5"
          fill="#fff"
        />
        <circle
          cx="11"
          cy="6"
          r="1.5"
          fill="#fff"
        />
        <circle
          cx="11"
          cy="10"
          r="1.5"
          fill="#fff"
        />
        <circle
          cx="11"
          cy="14"
          r="1.5"
          fill="#fff"
        />
      </svg>
    </button>

    <slot />
  </div>
</template>

<style scoped>
  .draggable {
    position: relative;
  }
  .drag-handle {
    touch-action: none;
    user-select: none;
    cursor: grab;
  }
  .drag-handle:active {
    cursor: grabbing;
  }
  .is-dragging {
    opacity: 0.5;
  }

  .indicator {
    position: absolute;
    background-color: red;
    pointer-events: none;
    z-index: 1;
  }
  .indicator.top,
  .indicator.bottom {
    left: 0;
    right: 0;
    height: 2px;
  }
  .indicator.top { top: 0; }
  .indicator.bottom { bottom: 0; }
  .indicator.left,
  .indicator.right {
    top: 0;
    bottom: 0;
    width: 2px;
  }
  .indicator.left { left: 0; }
  .indicator.right { right: 0; }
</style>
