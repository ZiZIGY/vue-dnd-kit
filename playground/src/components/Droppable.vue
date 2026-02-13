<script setup lang="ts">
  import { makeDroppable } from '../../../packages/core/src/external';
  import { useTemplateRef } from 'vue';

  const node = useTemplateRef('droppableRef');

  makeDroppable(node, {
    groups: ['droppable'],
    events: {
      onEnter: (e) => console.log('enter', e.dropZonePayload),
      onDrop: (e) => console.log('drop', e.payload),
      onLeave: (e) => console.log('leave', e.dropZonePayload),
    },
  });
</script>

<template>
  <div
    ref="droppableRef"
    class="droppable"
  >
    <slot />
  </div>
</template>

<style scoped>
  .droppable {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
