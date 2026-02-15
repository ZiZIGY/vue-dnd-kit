<script setup lang="ts">
  import { makeDraggable } from '../../../packages/core/src/external';
  import { useTemplateRef } from 'vue';

  const node = useTemplateRef('draggableRef');

  const { selected, isDragging, isDragOver } = makeDraggable(node, {
    groups: ['draggable'],
    dragHandle: '.drag-handle',
  });
</script>

<template>
  <div
    ref="draggableRef"
    class="draggable"
    :class="{ 'is-dragging': isDragging }"
  >
    <div
      v-show="isDragOver?.top"
      class="top indicator"
    ></div>
    <input
      type="checkbox"
      v-model="selected"
    />
    <!-- drag handle -->
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
    <div
      v-show="isDragOver?.bottom"
      class="bottom indicator"
    ></div>
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
    margin-left: auto;
    margin-right: auto;
    position: absolute;
    height: 2px;
    inset: 0;
    background-color: red;
  }
  .indicator.top {
    margin-bottom: auto;
  }
  .indicator.bottom {
    margin-top: auto;
  }
</style>
