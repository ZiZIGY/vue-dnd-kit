<script setup lang="ts">
  import { useDragContainer } from '@vue-dnd-kit/core';
  import { computed, CSSProperties } from 'vue';

  defineProps<{
    text: string;
    anotherProp: number;
  }>();

  const { elementRef, pointerPosition } = useDragContainer();

  const computedStyle = computed<CSSProperties>(() => ({
    transform: `translate3d(${
      (pointerPosition.current.value?.x ?? 0) -
      (pointerPosition.offset.pixel.value?.x ?? 0)
    }px, ${
      (pointerPosition.current.value?.y ?? 0) -
      (pointerPosition.offset.pixel.value?.y ?? 0)
    }px, 0)`,
    zIndex: 1000,
    position: 'fixed',
    top: 0,
    left: 0,
    transition: '0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
  }));
</script>

<template>
  <div
    ref="elementRef"
    :style="computedStyle"
  >
    {{ $props }}
  </div>
</template>
