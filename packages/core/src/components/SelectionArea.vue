<script setup lang="ts">
  import { makeSelectableArea } from '../composables/makeSelectableArea';
  import { useTemplateRef } from 'vue';

  const node = useTemplateRef('node');

  const { isSelecting, style } = makeSelectableArea(node, {
    modifier: {
      keys: ['ControlLeft'],
      method: 'some'
    }
  });
</script>

<template>
  <div
    ref="node"
    class="selection-area-container"
  >
    <slot />

    <div
      v-if="isSelecting"
      :style
    />
  </div>
</template>

<style scoped>
  .selection-area-container {
    position: relative;
    padding: 1.25rem;
    background-color: rgba(0, 0, 0, 0.4);
  }

</style>
