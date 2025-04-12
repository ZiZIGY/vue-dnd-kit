<script setup lang="ts">
  import { onMounted, type Component } from 'vue';
  import { useDraggable, useSelection } from '@vue-dnd-kit/core';
  import { IDnDStore, ISensor } from '@vue-dnd-kit/core/types';

  interface IDraggableProps {
    tag?: keyof HTMLElementTagNameMap;
    container?: Component;
    data?: any;
    groups?: string[];
    keyboardMoveStep?: number;
    layer?: Component;
    sensorThrottle?: number;
    sensorSetup?: ISensor;
    preventRootDrag?: boolean;
  }

  const {
    tag = 'div',
    container,
    data,
    groups,
    keyboardMoveStep,
    layer,
    sensorThrottle,
    sensorSetup,
    preventRootDrag,
  } = defineProps<IDraggableProps>();

  const emit = defineEmits<{
    (e: 'start' | 'end' | 'leave' | 'hover' | 'move', store: IDnDStore): void;
  }>();

  const { elementRef, handleDragStart, isAllowed, isDragging, isOvered } =
    useDraggable({
      container,
      data,
      groups,
      layer,
      keyboard: {
        moveStep: keyboardMoveStep,
      },
      sensor: {
        throttle: sensorThrottle,
        setup: sensorSetup,
      },
      events: {
        onStart: (store) => emit('start', store),
        onLeave: (store) => emit('leave', store),
        onHover: (store) => emit('hover', store),
        onMove: (store) => emit('move', store),
        onEnd: (store) => emit('end', store),
      },
    });

  const {
    isSelected,
    handleSelect,
    handleToggleSelect,
    handleUnselect,
    isParentOfSelected,
  } = useSelection(elementRef);

  onMounted(() => {
    if (!preventRootDrag)
      elementRef.value?.addEventListener('pointerdown', handleDragStart);
  });
</script>

<template>
  <component
    ref="elementRef"
    :is="tag"
    class="dnd-kit-draggable"
    :class="{
      'dnd-kit-draggable-disabled': isDragging,
      'dnd-kit-draggable-active': isDragging,
      'dnd-kit-draggable-selected': isSelected,
    }"
    :disabled="isDragging"
  >
    <slot
      :handleDragStart="handleDragStart"
      :isAllowed="isAllowed"
      :isDragging="isDragging"
      :isOvered="isOvered"
      :isSelected="isSelected"
      :isParentOfSelected="isParentOfSelected"
      :handleSelect="handleSelect"
      :handleToggleSelect="handleToggleSelect"
      :handleUnselect="handleUnselect"
    />
  </component>
</template>
