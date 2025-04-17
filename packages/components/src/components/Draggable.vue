<script setup lang="ts">
  import { computed, type Component } from 'vue';
  import { useDraggable, useSelection } from '@vue-dnd-kit/core';
  import { IDnDStore, ISensor } from '@vue-dnd-kit/core/types';

  import { DraggableClassNames } from '../utils/classNames';

  const {
    tag = 'div',
    container,
    ...props
  } = defineProps<{
    tag?: keyof HTMLElementTagNameMap;
    container?: Component;
    data?: Record<string, any>;
    groups?: string[];
    keyboardMoveStep?: number;
    layer?: Component;
    sensorThrottle?: number;
    sensorSetup?: ISensor;
    preventRootDrag?: boolean;
    index?: number;
    source?: any[];
  }>();

  const emit = defineEmits<{
    (e: 'start' | 'end' | 'leave' | 'hover' | 'move', store: IDnDStore): void;
  }>();

  const { elementRef, handleDragStart, isAllowed, isDragging, isOvered } =
    useDraggable({
      container,
      data: computed(() => ({
        index: props.index,
        source: props.source,
        ...props.data,
      })),
      groups: props.groups,
      layer: props.layer,
      keyboard: {
        moveStep: props.keyboardMoveStep,
      },
      sensor: {
        throttle: props.sensorThrottle,
        setup: props.sensorSetup,
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
</script>

<template>
  <component
    ref="elementRef"
    :is="tag"
    :class="{
      [DraggableClassNames.DRAGGABLE]: true,
      [DraggableClassNames.DRAGGABLE_ACTIVE]: isDragging,
      [DraggableClassNames.DRAGGABLE_SELECTED]: isSelected,
      [DraggableClassNames.DRAGGABLE_ALLOWED]: isAllowed,
      [DraggableClassNames.DRAGGABLE_OVERED]: isOvered,
    }"
    :disabled="isDragging"
    @pointerdown.self="(event: PointerEvent) => !preventRootDrag && handleDragStart(event)"
    @keydown.space.self="
      (event: KeyboardEvent) => !preventRootDrag && handleDragStart(event)
    "
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
