<script setup lang="tsx">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '../composables/makeDraggable';
  import type { IDragActivation } from '../types';

  const props = defineProps<{
    index: number;
    dragHandle?: string;
    activation?: IDragActivation;
  }>();

  const node = useTemplateRef('node');

  makeDraggable(node, {
    dragHandle: props.dragHandle,
  });
</script>

<template>
  <div ref="node">
    <slot />
  </div>
</template>

<style scoped>
  div {
    user-select: none;
    touch-action: none;
  }
</style>
