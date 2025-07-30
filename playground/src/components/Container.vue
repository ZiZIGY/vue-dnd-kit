<script setup lang="ts">
  import { useDragContainer } from '@vue-dnd-kit/core';
  import { computed, CSSProperties } from 'vue';

  const { elementRef, pointerPosition } = useDragContainer();

  defineProps<{
    message: string;
  }>();

  const styles = computed<CSSProperties>(() => ({
    position: 'absolute',
    top: pointerPosition.current.value?.y + 'px',
    left: pointerPosition.current.value?.x + 'px',
  }));
</script>

<template>
  <div
    ref="elementRef"
    :style="styles"
  >
    {{ $props }} kek
  </div>
</template>
