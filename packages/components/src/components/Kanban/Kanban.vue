<script setup lang="ts">
  import { IDnDStore } from '@vue-dnd-kit/core';
  import Droppable from '../Droppable.vue';

  const { tag = 'ul', groups = ['kanban-column'] } = defineProps<{
    tag?: keyof HTMLElementTagNameMap;
    groups?: string[];
  }>();

  const emit = defineEmits<{
    (e: 'drop' | 'hover' | 'leave', store: IDnDStore): void;
  }>();
</script>

<template>
  <Droppable
    :tag="tag"
    :groups="groups"
    class="dnd-kit-kanban"
    @drop="emit('drop', $event)"
    @hover="emit('hover', $event)"
    @leave="emit('leave', $event)"
  >
    <slot />
  </Droppable>
</template>

<style></style>
