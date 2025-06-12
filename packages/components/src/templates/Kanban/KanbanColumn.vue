<script
  setup
  lang="ts"
  generic="T extends Record<string, unknown>, S extends any[]"
>
  import { DnDOperations, useDraggable, useDroppable } from '@vue-dnd-kit/core';
  import DragHandle from './DragHandle.vue';
  import { computed } from 'vue';

  const {
    groups = ['kanban-columns'],
    columns,
    columnIndex,
    bodyGroups = ['kanban-column-body'],
    bodySource,
    column,
  } = defineProps<{
    groups?: string[];
    columns: T[];
    columnIndex: number;
    bodyGroups?: string[];
    bodySource: S;
    column: T;
  }>();

  const { elementRef, handleDragStart, isDragging, isOvered } = useDraggable({
    groups,
    data: computed(() => ({
      source: columns,
      index: columnIndex,
    })),
  });

  const { elementRef: droppableRef, isOvered: isBodyOvered } = useDroppable({
    groups: bodyGroups,
    data: computed(() => ({
      source: bodySource,
    })),
    events: {
      onDrop: (store) => {
        DnDOperations.applyTransfer(store);
      },
    },
  });
</script>

<template>
  <li
    class="vue-dnd-kanban-column"
    :class="{
      'vue-dnd-kanban-column-dragging': isDragging,
      'vue-dnd-kanban-column-overed': isOvered,
    }"
    ref="elementRef"
  >
    <header class="vue-dnd-kanban-column-header">
      <DragHandle @pointerdown="handleDragStart" />
      <slot name="header">
        <h3 class="vue-dnd-kanban-column-title">{{ column.title }}</h3>
      </slot>
    </header>

    <ul
      ref="droppableRef"
      class="vue-dnd-kanban-column-body"
      :class="{ 'vue-dnd-kanban-column-body-overed': isBodyOvered }"
    >
      <slot :body-source="bodySource" />
      {{
        bodyGroups
      }}
    </ul>

    <footer class="vue-dnd-kanban-column-footer">
      <slot name="footer" />
    </footer>
  </li>
</template>
