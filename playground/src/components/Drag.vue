<script setup lang="ts">
  import { useDraggable, useSelection } from '@vue-dnd-kit/core';

  const { elementRef, handleDragStart } = useDraggable({});
  const { handleToggleSelect, isSelected } = useSelection(elementRef);
</script>

<template>
  <div ref="elementRef">
    <input
      @change="handleToggleSelect"
      :checked="isSelected"
      type="checkbox"
    />
    <span
      @pointerdown="handleDragStart"
      @keydown.space="handleDragStart"
      tabindex="0"
      role="button"
    >
      ||
    </span>
    drag me
  </div>
</template>
