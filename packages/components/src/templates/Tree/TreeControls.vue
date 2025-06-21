<script setup lang="ts">
  interface Props {
    expanded?: boolean;
    hasChildren?: boolean;
    onArrowClick?: () => void;
    onDragStart?: (event: PointerEvent) => void;
  }

  const {
    expanded = false,
    hasChildren = false,
    onArrowClick,
    onDragStart,
  } = defineProps<Props>();
</script>

<template>
  <div class="tree-controls">
    <div
      class="tree-arrow"
      @click="onArrowClick"
    >
      <svg
        v-if="hasChildren"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        :class="{ expanded: expanded }"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
      <div
        v-else
        class="tree-item-dot"
      ></div>
    </div>

    <div
      class="tree-drag-handle"
      @pointerdown="onDragStart"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle
          cx="9"
          cy="5"
          r="1"
        />
        <circle
          cx="9"
          cy="12"
          r="1"
        />
        <circle
          cx="9"
          cy="19"
          r="1"
        />
        <circle
          cx="15"
          cy="5"
          r="1"
        />
        <circle
          cx="15"
          cy="12"
          r="1"
        />
        <circle
          cx="15"
          cy="19"
          r="1"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
  .tree-controls {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-right: 8px;
  }

  .tree-arrow {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    transition: color 0.2s ease;
    cursor: pointer;
    padding: 2px;
    border-radius: 4px;
  }

  .tree-arrow:hover {
    background-color: #d1d5db;
    color: #374151;
  }

  svg {
    transition: transform 0.2s ease;
  }

  svg.expanded {
    transform: rotate(90deg);
  }

  .tree-item-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: currentColor;
  }

  .tree-drag-handle {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    cursor: grab;
    border-radius: 4px;
    transition: all 0.2s ease;
    touch-action: none;
  }

  .tree-drag-handle:hover {
    background-color: #e5e7eb;
    color: #6b7280;
    opacity: 1;
  }

  .tree-drag-handle:active {
    cursor: grabbing;
    transform: scale(0.95);
  }
</style>
