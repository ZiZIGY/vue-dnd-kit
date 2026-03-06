<script setup lang="ts">
  import { useTemplateRef, onMounted } from 'vue';
  import { motion } from 'motion-v';
  import { makeDraggable, useDnDProvider } from '@vue-dnd-kit/core';

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  const { isDragging } = makeDraggable(itemRef);

  const provider = useDnDProvider();

  onMounted(() => {
    console.log(itemRef.value);
    console.log(provider.entities);
  });
</script>

<template>
  <motion.div
    ref="itemRef"
    class="draggable-item"
    :initial="{
      scale: 0.5,
    }"
    :animate="{
      scale: 1,
    }"
    :style="{
      opacity: isDragging ? 0 : 1,
    }"
  >
    <slot>Drag me</slot>
  </motion.div>
</template>

<style scoped>
  .draggable-item {
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    background-color: var(--vp-c-brand-1);
    color: var(--vp-c-bg);
    cursor: grab;
    user-select: none;
    font-weight: 500;
    display: inline-block;
  }

  .draggable-item:active {
    cursor: grabbing;
  }
</style>
