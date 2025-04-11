<script setup lang="ts">
  import { useDroppable } from '@vue-dnd-kit/core';

  const { elementRef, isOvered } = useDroppable({
    events: {
      onDrop: () => {
        console.log('drop');
      },
    },
  });
</script>

<template>
  <div
    ref="elementRef"
    :style="{ border: isOvered ? '1px solid red' : '1px solid black' }"
  >
    <slot />
  </div>
</template>

<style scoped>
  div {
    padding: 15px;
  }
</style>
