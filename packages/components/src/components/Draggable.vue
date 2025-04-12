<script setup lang="ts" generic="T extends IUseDragOptions['data']">
  import { onMounted, onUnmounted, type Component } from 'vue';
  import { useDraggable, useSelection } from '@vue-dnd-kit/core';
  import { IDnDStore, ISensor, IUseDragOptions } from '@vue-dnd-kit/core/types';

  import { DraggableClassNames } from '../utils/classNames';

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
  } = defineProps<{
    tag?: keyof HTMLElementTagNameMap;
    container?: Component;
    data?: T;
    groups?: string[];
    keyboardMoveStep?: number;
    layer?: Component;
    sensorThrottle?: number;
    sensorSetup?: ISensor;
    preventRootDrag?: boolean;
  }>();

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

  onUnmounted(() => {
    if (!preventRootDrag)
      elementRef.value?.removeEventListener('pointerdown', handleDragStart);
  });
</script>

<template>
  <component
    ref="elementRef"
    :is="tag"
    :class="{
      [DraggableClassNames.DRAGGABLE]: true,
      [DraggableClassNames.DRAGGABLE_DISABLED]: isDragging,
      [DraggableClassNames.DRAGGABLE_ACTIVE]: isDragging,
      [DraggableClassNames.DRAGGABLE_SELECTED]: isSelected,
      [DraggableClassNames.DRAGGABLE_ALLOWED]: isAllowed,
      [DraggableClassNames.DRAGGABLE_OVERED]: isOvered,
    }"
    :disabled="isDragging"
    @pointerdown.self="preventRootDrag ?? handleDragStart"
    @keydown.space.self="preventRootDrag ?? handleDragStart"
  >
    <slot
      :handle-drag-start="handleDragStart"
      :data="data"
      :is-allowed="isAllowed"
      :is-dragging="isDragging"
      :is-overed="isOvered"
      :is-selected="isSelected"
      :is-parent-of-selected="isParentOfSelected"
      :handle-select="handleSelect"
      :handle-toggle-select="handleToggleSelect"
      :handle-unselect="handleUnselect"
    />
  </component>
</template>
