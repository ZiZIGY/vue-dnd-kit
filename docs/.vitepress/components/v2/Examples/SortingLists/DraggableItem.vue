<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { motion } from 'motion-v';
  import { makeDraggable } from '@vue-dnd-kit/core';
  import type { IPlacement } from '@vue-dnd-kit/core';

  interface Item {
    id: number;
    name: string;
  }

  const props = defineProps<{
    index: number;
    items: Item[];
  }>();

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  const { isDragging, isDragOver } = makeDraggable(itemRef, {}, () => [
    props.index,
    props.items,
  ]);

  const placement = computed<IPlacement | undefined>(() => isDragOver.value);
</script>

<template>
  <motion.div
    ref="itemRef"
    class="draggable"
    :class="{
      'is-dragging': isDragging,
    }"
    :initial="{
      scale: 0.9,
      y: -8,
      opacity: 0,
    }"
    :animate="{
      scale: 1,
      y: 0,
      opacity: 1,
    }"
  >
    <div
      v-if="placement?.top"
      class="indicator indicator--top"
      aria-hidden
    />
    <div
      v-if="placement?.bottom"
      class="indicator indicator--bottom"
      aria-hidden
    />
    <slot />
  </motion.div>
</template>

<style scoped>
  .draggable {
    position: relative;
    padding: 10px 16px;
    border: 1px solid #3eaf7c;
    border-radius: 6px;
    cursor: move;
    background-color: #3eaf7c;
    color: white;
    font-weight: 500;
    font-size: 14px;
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(62, 175, 124, 0.2);
    user-select: none;
    touch-action: none;
  }

  .is-dragging {
    opacity: 0 !important;
  }

  .indicator {
    position: absolute;
    left: 4px;
    right: 4px;
    height: 2px;
    background: #f97316;
    border-radius: 2px;
    pointer-events: none;
    z-index: 1;
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.4);
  }

  .indicator--top {
    top: -6px;
  }

  .indicator--bottom {
    bottom: -6px;
  }
</style>
