<script setup lang="ts">
  import { useDraggable, useSelection } from '@vue-dnd-kit/core';
  import { type Component } from 'vue';
  const { layer } = defineProps<{
    layer?: Component;
  }>();

  const { elementRef, handleDragStart } = useDraggable({
    layer,
  });

  const { handleToggleSelect, isSelected } = useSelection(elementRef);
</script>

<template>
  <div
    ref="elementRef"
    class="draggable"
  >
    <div class="draggable-actions">
      <div
        class="drag-handle"
        role="button"
        tabindex="0"
        aria-label="Drag handle"
        @pointerdown="handleDragStart"
      >
        ⋮⋮
      </div>
      <input
        :checked="isSelected"
        type="checkbox"
        @change="handleToggleSelect"
      />
    </div>
    <slot />
  </div>
</template>

<style scoped>
  .draggable {
    padding: 10px 16px;
    border: 1px solid #3eaf7c;
    border-radius: 6px;
    cursor: move;
    background-color: #3eaf7c;
    font-weight: 500;
    font-size: 14px;
    justify-content: space-between;
    transition: all 0.2s ease;
    display: inline-flex;
    box-shadow: 0 2px 4px rgba(62, 175, 124, 0.2);
    user-select: none;
    touch-action: none;
  }
  .draggable-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
  }
</style>
