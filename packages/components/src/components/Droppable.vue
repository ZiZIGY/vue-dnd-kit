<script setup lang="ts">
  import type { IDnDStore } from '@vue-dnd-kit/core/types';
  import { useDroppable } from '@vue-dnd-kit/core';
  import { DroppableClassNames } from '../utils/classNames';

  const {
    tag = 'div',
    data,
    groups,
    source,
  } = defineProps<{
    tag?: keyof HTMLElementTagNameMap;
    data?: Record<string, any>;
    groups?: string[];
    source?: any[];
  }>();

  const emit = defineEmits<{
    (e: 'drop' | 'hover' | 'leave', store: IDnDStore): void;
  }>();

  const { elementRef, isAllowed, isOvered } = useDroppable({
    data: {
      source,
      ...data,
    },
    groups,
    events: {
      onDrop: (store) => emit('drop', store),
      onHover: (store) => emit('hover', store),
      onLeave: (store) => emit('leave', store),
    },
  });
</script>

<template>
  <component
    ref="elementRef"
    :is="tag"
    class="dnd-kit-droppable"
    :class="{
      [DroppableClassNames.DROPPABLE_DISABLED]: !isAllowed,
      [DroppableClassNames.DROPPABLE_ACTIVE]: isOvered,
    }"
  >
    <slot
      :is-allowed="isAllowed"
      :is-overed="isOvered"
    />
  </component>
</template>
