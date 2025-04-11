<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';
  import { Component, shallowRef } from 'vue';

  interface IDraggableProps {
    tag?: keyof HTMLElementTagNameMap;
    container?: Component;
    data: any;
  }

  const { tag = 'div', } = defineProps<IDraggableProps>();

  const { elementRef, handleDragStart, isAllowed, isDragging, isOvered } =
    useDraggable({

    });

  const isHandlerUsedInSlot = shallowRef<boolean>(false);
  const slotHandleDragStart = (event: PointerEvent | KeyboardEvent) => {
    isHandlerUsedInSlot.value = true;
    handleDragStart(event);
  };
</script>

<template>
  <component
    ref="elementRef"
    :is="tag"
    class="dnd-kit-draggable"
    @pointerdown.self="(event: KeyboardEvent) => !isHandlerUsedInSlot && handleDragStart(event)"
    @keydown.space.self="(event: KeyboardEvent) => !isHandlerUsedInSlot && handleDragStart(event)"
  >
    <slot
      :handleDragStart="slotHandleDragStart"
      :isAllowed="isAllowed"
      :isDragging="isDragging"
      :isOvered="isOvered"
    />
  </component>
</template>

<style scoped>
  .dnd-kit-draggable {
    cursor: grab;
  }
</style>
