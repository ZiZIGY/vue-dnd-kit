<script setup lang="ts">
  import { makeDroppable } from '../../external';
  import { makeSelectableArea } from '../../external/composables/makeSelectableArea';
  import { useTemplateRef } from 'vue';

  const props = defineProps<{
    groups?: string[];
    modifier?: { keys: string[]; method: 'every' | 'some' };
  }>();

  const node = useTemplateRef('node');

  const { isSelecting, style } = makeSelectableArea(node, {
    groups: props.groups ?? [],
    modifier: props.modifier ?? {
      keys: ['ControlLeft'],
      method: 'some',
    },
  });

  makeDroppable(node, {
    events: {
      onDrop(event) {
        console.log('dropped', event);
      },
    },
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
