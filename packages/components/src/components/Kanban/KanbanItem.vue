<script setup lang="ts">
  import Draggable from '../Draggable.vue';

  const {
    tag = 'li',
    groups = ['kanban-item'],
    preventRootDrag = true,
  } = defineProps<{
    tag?: keyof HTMLElementTagNameMap;
    groups?: string[];
    preventRootDrag?: boolean;
    source: any[];
    index: number;
    data?: Record<string, any>;
  }>();
</script>

<template>
  <Draggable
    :tag="tag"
    :groups="groups"
    :prevent-root-drag="preventRootDrag"
    v-slot="{
      data,
      handleDragStart,
      handleSelect,
      handleToggleSelect,
      handleUnselect,
      isAllowed,
      isDragging,
      isOvered,
      isSelected,
      isParentOfSelected,
    }"
    :data="data"
    :source="source"
    :index="index"
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
  </Draggable>
</template>
