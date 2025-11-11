<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '../composables/makeDraggable';

  const { index } = defineProps<{
    index: number;
  }>();

  const node = useTemplateRef('node');

  const draggable = makeDraggable(node, {}, () => [index, []]);
</script>

<template>
  <div
    ref="node"
    @pointerdown="draggable.events.startDrag"
  >
    <slot /> index: {{ index }}
  </div>
</template>
