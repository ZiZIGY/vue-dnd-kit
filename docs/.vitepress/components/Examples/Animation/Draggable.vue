<script setup lang="ts">
  import { useDnDStore, useDraggable } from '@vue-dnd-kit/core';
  import CustomContainer from './CustomContainer.vue';
  import { computed, markRaw } from 'vue';

  const emit = defineEmits<{
    (e: 'end'): void;
  }>();

  const { elementRef, handleDragStart, isDragging } = useDraggable({
    container: markRaw(CustomContainer),
    events: {
      onEnd: () => emit('end'),
    },
  });

  const { activeContainer } = useDnDStore();

  const containerIsAnimating = computed(
    () =>
      activeContainer.animating.leave.value ||
      isDragging.value ||
      activeContainer.ref.value
  );
</script>

<template>
  <Transition name="fill">
    <div
      v-show="!containerIsAnimating"
      ref="elementRef"
      role="button"
      tabindex="0"
      @pointerdown="handleDragStart"
      @keydown.space="handleDragStart"
      class="fill-container"
      :class="{ 'fill-container-active': isDragging }"
    >
      <slot>Drag me</slot>
    </div>
  </Transition>
</template>

<style scoped>
  .fill-container {
    padding: 20px;
    box-sizing: border-box;
    height: 100px;
    border-radius: 8px;
    width: 100%;
    background-color: var(--vp-c-brand);
    color: white;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    user-select: none;
    touch-action: none;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    clip-path: circle(150% at 50% 50%);
  }

  .fill-container:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .fill-container:active {
    cursor: grabbing;
  }

  .fill-container-active {
    display: none;
  }

  .fill-enter-active {
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fill-enter-from {
    clip-path: circle(0% at 50% 50%);
  }
</style>
