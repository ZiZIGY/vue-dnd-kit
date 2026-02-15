<script setup lang="ts">
  import {
    makeDraggable,
    makeDroppable,
    useDnDProvider,
  } from '../../../packages/core/src/external';
  import { useTemplateRef } from 'vue';

  const node = useTemplateRef('droppableRef');

  const { state } = useDnDProvider();

  makeDraggable(node, {
    placementMargins: {
      bottom: 5,
      left: 5,
      right: 5,
      top: 5,
    },
  });

  const { isAllowed } = makeDroppable(node, {
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
    :class="{
      'is-allowed': isAllowed && state === 'dragging',
      'is-not-allowed': !isAllowed && state === 'dragging',
    }"
  >
    <slot />
    {{ isAllowed }}
  </div>
</template>

<style scoped>
  .droppable {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: border-color 0.3s ease;
  }
  .droppable.is-allowed {
    border-color: green;
  }
  .droppable.is-not-allowed {
    border-color: red;
  }
</style>
