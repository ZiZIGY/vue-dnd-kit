<script setup lang="tsx">
  import { useTemplateRef } from 'vue';
  import { makeDraggable } from '../../external/composables/makeDraggable';
  import type { IDragActivation } from '../../external/types';


  const props = defineProps<{
    index: number;
    dragHandle?: string;
    activation?: IDragActivation;
    groups?: string[];
  }>();

  const node = useTemplateRef('node');

  makeDraggable(node, {
    ...props,
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
