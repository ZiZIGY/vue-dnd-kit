<script setup lang="ts">
  import { IKanbanColumn } from 'src/types';
  import Draggable from '../Draggable.vue';
  import Droppable from '../Droppable.vue';
  import { type Component } from 'vue';
  import { IDnDStore } from '@vue-dnd-kit/core';
  import { ISensor } from '@vue-dnd-kit/core/types';

  const {
    tag = 'li',
    title,
    preventRootDrag = true,
    groups = ['kanban-column'],
    bodyGroups = ['kanban-item'],
    bodyTag = 'ul',
  } = defineProps<{
    tag?: keyof HTMLElementTagNameMap;
    title?: string;
    preventRootDrag?: boolean;
    groups?: string[];
    source: IKanbanColumn[];
    index: number;
    container?: Component;
    keyboardMoveStep?: number;
    layer?: Component;
    data?: Record<string, any>;
    sensorThrottle?: number;
    sensorSetup?: ISensor;
    bodyGroups?: string[];
    bodyTag?: keyof HTMLElementTagNameMap;
  }>();

  const emit = defineEmits<{
    (
      e: 'start' | 'end' | 'leave' | 'hover' | 'move' | 'drop',
      store: IDnDStore
    ): void;
  }>();
</script>

<template>
  <Draggable
    :tag="tag"
    class="dnd-kit-kanban-column"
    :prevent-root-drag="preventRootDrag"
    :groups="groups"
    @start="emit('start', $event)"
    @end="emit('end', $event)"
    @leave="emit('leave', $event)"
    @hover="emit('hover', $event)"
    @move="emit('move', $event)"
    :container="container"
    v-slot="{
      handleDragStart,
      isAllowed,
      data,
      handleSelect,
      handleToggleSelect,
      isDragging,
      handleUnselect,
      isOvered,
      isParentOfSelected,
      isSelected,
    }"
    :data="data"
    :source="source"
    :index="index"
    :keyboard-move-step="keyboardMoveStep"
    :layer="layer"
    :sensor-throttle="sensorThrottle"
    :sensor-setup="sensorSetup"
  >
    <div class="dnd-kit-kanban-column-header">
      <slot
        name="header"
        :title="title"
        :handle-drag-start="handleDragStart"
        :is-allowed="isAllowed"
        :data="data"
        :handle-select="handleSelect"
        :handle-toggle-select="handleToggleSelect"
        :is-dragging="isDragging"
        :handle-unselect="handleUnselect"
        :is-overed="isOvered"
        :is-parent-of-selected="isParentOfSelected"
        :is-selected="isSelected"
      >
        <span>{{ title }} {{ index }}</span>
      </slot>
    </div>
    <Droppable
      :groups="bodyGroups"
      :tag="bodyTag"
      @drop="emit('drop', $event)"
      :source="source[index].items"
      class="dnd-kit-kanban-column-body"
    >
      <slot
        :handle-drag-start="handleDragStart"
        :is-allowed="isAllowed"
        :data="data"
        :handle-select="handleSelect"
        :handle-toggle-select="handleToggleSelect"
        :is-dragging="isDragging"
        :handle-unselect="handleUnselect"
        :is-overed="isOvered"
        :is-parent-of-selected="isParentOfSelected"
        :is-selected="isSelected"
      />
    </Droppable>

    <slot
      name="footer"
      :handle-drag-start="handleDragStart"
      :is-allowed="isAllowed"
      :data="data"
      :handle-select="handleSelect"
      :handle-toggle-select="handleToggleSelect"
      :is-dragging="isDragging"
      :handle-unselect="handleUnselect"
      :is-overed="isOvered"
      :is-parent-of-selected="isParentOfSelected"
      :is-selected="isSelected"
    />
  </Draggable>
</template>
