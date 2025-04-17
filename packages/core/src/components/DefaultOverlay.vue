<script setup lang="ts">
  import { computed, CSSProperties } from 'vue';
  import { useDragContainer } from '../composables/useDragContainer';

  const { elementRef, pointerPosition, isDragging, draggingElements } =
    useDragContainer();

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
    v-if="isDragging"
    ref="elementRef"
    :style="computedStyle"
  >
    <div
      v-for="[_, element] in draggingElements"
      :key="element.id"
      v-html="element.initialHTML"
      :style="{
        width: `${element.initialRect?.width}px`,
        height: `${element.initialRect?.height}px`,
      }"
    />
  </div>
</template>
