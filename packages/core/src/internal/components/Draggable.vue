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
    class="draggable-card"
    :class="{ 'draggable-card--over': isOvered }"
  >
    <div
      v-if="provider.hovered.draggable.get(node!)?.top"
      class="drop-indicator drop-indicator--top"
    />
    <div class="draggable-card__inner">
      <slot name="handle" />
      <div class="draggable-card__content">
        <slot />
      </div>
    </div>
    <div
      v-if="provider.hovered.draggable.get(node!)?.bottom"
      class="drop-indicator drop-indicator--bottom"
    />
  </div>
</template>

<style>
  .draggable-card {
    user-select: none;
    touch-action: none;
    position: relative;
    background: #334155;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .draggable-card--over {
    background: #475569;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .draggable-card__inner {
    display: flex;
    align-items: center;
    min-height: 44px;
    padding: 8px 12px;
  }

  .draggable-card__content {
    flex: 1;
    min-width: 0;
  }

  .drop-indicator {
    position: absolute;
    left: 8px;
    right: 8px;
    height: 2px;
    background: #38bdf8;
    border-radius: 1px;
    pointer-events: none;
    z-index: 1;
    box-shadow: 0 0 8px #38bdf8;
  }

  .drop-indicator--top {
    top: 0;
  }

  .drop-indicator--bottom {
    bottom: 0;
  }
</style>
