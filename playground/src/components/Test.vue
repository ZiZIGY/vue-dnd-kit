<script setup lang="ts">
  import { makeDraggable } from '@vue-dnd-kit/core';
  import { useTemplateRef } from 'vue';

  const draggableNode = useTemplateRef('draggableRef');

  const { source, index } = defineProps<{
    name: string;
    source: any[];
    index: number;
  }>();

  const { handleDragStart } = makeDraggable(
    draggableNode,
    {
      disabled: false,
      groups: ['test'],
    },
    () => [source, index]
  );
</script>

<template>
  <div
    ref="draggableRef"
    @pointerdown.stop="handleDragStart"
  >
    <div>Имя: {{ name }}</div>
  </div>
</template>
