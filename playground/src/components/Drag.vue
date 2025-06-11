<script setup lang="ts">
  import { DnDOperations, useDraggable, useSelection } from '@vue-dnd-kit/core';
  import { computed } from 'vue';

  const props = defineProps<{
    source?: any[];
    index?: number;
  }>();

  const { elementRef, handleDragStart, isOvered } = useDraggable({
    data: computed(() => ({
      source: props.source,
      index: props.index,
    })),
    events: {
      onHover: (store) => {
        DnDOperations.applyTransfer(store);
      },
    },
  });

  const { handleToggleSelect, isSelected } = useSelection(elementRef);
</script>

<template>
  <div ref="elementRef">
    <div>
      <input
        type="checkbox"
        :checked="isSelected"
        @change="handleToggleSelect"
      />
      <span
        @pointerdown="handleDragStart"
        @keydown.space.prevent="handleDragStart"
        class="handle"
        role="button"
        tabindex="0"
        >::</span
      >
      <slot />
    </div>
    <hr v-if="isOvered" />
  </div>
</template>

<style>
  .handle {
    cursor: move;
  }
</style>
