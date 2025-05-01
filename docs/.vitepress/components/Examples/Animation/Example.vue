<script setup lang="ts">
  import { ref } from 'vue';
  import Draggable from './Draggable.vue';
  import { useDnDStore, useDroppable } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';

  const dropped = ref(false);

  const { elementRef, isOvered } = useDroppable({
    events: {
      onDrop: () => (dropped.value = true),
    },
  });

  const { isDragging } = useDnDStore();
</script>

<template>
  <ExampleContainer>
    <div class="animation-example">
      <Draggable
        v-if="!dropped"
        @end="dropped = false"
        class="source-draggable"
      >
        Drag me to zone
      </Draggable>

      <div
        ref="elementRef"
        class="drop-zone"
        :class="{ 'is-overed': isOvered && isDragging }"
      >
        <span class="drop-zone-label">Drop here</span>

        <Transition name="circle-skeleton">
          <div
            v-if="isOvered && isDragging"
            class="circle-skeleton"
          />
        </Transition>

        <Draggable
          v-if="dropped"
          @end="dropped = false"
          class="target-draggable"
        >
          Drag me back
        </Draggable>
      </div>
    </div>
  </ExampleContainer>
</template>

<style>
  .animation-example {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 40px;
    padding: 20px;
  }

  .drop-zone {
    height: 200px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s ease;
  }

  .drop-zone-label {
    margin-bottom: 20px;
    font-weight: 500;
    color: #666;
  }

  .is-overed {
    border-color: var(--vp-c-brand);
    background-color: rgba(var(--vp-c-brand-rgb), 0.05);
    transform: scale(1.03);
  }

  .circle-skeleton {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: rgba(var(--vp-c-brand-rgb), 0.15);
    border: 2px dashed var(--vp-c-brand);
    position: absolute;
  }

  .circle-skeleton-leave-active,
  .circle-skeleton-enter-active {
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .circle-skeleton-enter-from,
  .circle-skeleton-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }

  .source-draggable {
    align-self: flex-start;
  }

  .target-draggable {
    margin-top: 20px;
  }
</style>
