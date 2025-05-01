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
      @pointerdown="handleDragStart"
      class="fill-container"
      :class="{ 'fill-container-active': isDragging }"
    >
      Drag me
    </div>
  </Transition>
</template>

<style scoped>
  .fill-container {
    padding: 20px;
    box-sizing: border-box;
    height: 100px;
    border-radius: 12px;
    background-color: red;
    display: flex;
    align-items: center;
    justify-content: center;
    clip-path: circle(150% at 50% 50%);
  }

  .fill-container-active {
    display: none;
  }

  .fill-enter-active {
    transition: 1s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .fill-enter-from {
    clip-path: circle(0% at 50% 50%);
  }
</style>
