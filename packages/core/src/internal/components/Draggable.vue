<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeDraggable } from '../../external/composables/makeDraggable';
  import type { IDragActivation } from '../../external/types';
  import { useDnDProvider } from '../../external';

  const props = defineProps<{
    index: number;
    dragHandle?: string;
    activation?: IDragActivation;
    groups?: string[];
    source: any[];
  }>();

  const node = useTemplateRef('node');

  makeDraggable(node, { ...props }, () => [props.index, props.source]);

  const provider = useDnDProvider();

  const isOvered = computed(() => {
    if (!node.value) return false;
    return provider.hovered.draggable.has(node.value);
  });
</script>

<template>
  <div
    ref="node"
    :style="{ background: isOvered ? 'red' : '' }"
  >
    <span
      v-if="provider.hovered.draggable.get(node!)?.top"
      class="top-placement"
      >top</span
    >
    <slot />
    <span
      v-if="provider.hovered.draggable.get(node!)?.bottom"
      class="bottom-placement"
      >bottom</span
    >
  </div>
</template>

<style scoped>
  div {
    user-select: none;
    touch-action: none;
    position: relative;
    padding: 5px;
  }

  .top-placement {
    position: absolute;
    margin: auto;
    inset: 0;
    display: block;
    text-align: center;
    transform: translateY(-50%);
    pointer-events: none;
  }
  .bottom-placement {
    position: absolute;
    margin: auto;
    inset: 0;
    display: block;
    text-align: center;
    transform: translateY(50%);
    pointer-events: none;
  }
</style>
