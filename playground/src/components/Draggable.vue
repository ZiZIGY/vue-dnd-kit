<script setup lang="ts" generic="T">
  import { makeDraggable } from '../../../packages/core/src/external';
  import { useTemplateRef } from 'vue';

  const props = defineProps<{
    index: number;
    items: T[];
  }>();

  const node = useTemplateRef<HTMLElement>('draggableRef');

  const { selected, isDragging } = makeDraggable(
    node,
    {
      groups: ['draggable'],
      dragHandle: '.drag-handle',
    },
    () => [props.index, props.items]
  );
</script>

<template>
  <div
    ref="draggableRef"
    class="draggable"
    :class="{ 'is-dragging': isDragging }"
  >
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
  .indicator.top {
    top: 0;
  }
  .indicator.bottom {
    bottom: 0;
  }
  .indicator.left,
  .indicator.right {
    top: 0;
    bottom: 0;
    width: 2px;
  }
  .indicator.left {
    left: 0;
  }
  .indicator.right {
    right: 0;
  }
</style>
