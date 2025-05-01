<script setup lang="ts">
  import { ref } from 'vue';
  import Draggable from '../components/Draggable.vue';
  import { useDnDStore, useDroppable } from '@vue-dnd-kit/core';

  const dropped = ref(false);

  const { elementRef, isOvered } = useDroppable({
    events: {
      onDrop: () => (dropped.value = true),
    },
  });

  const { isDragging } = useDnDStore();
</script>

<template>
  <div>
    <Draggable
      v-if="!dropped"
      @end="dropped = false"
    >
      drag me to zone
    </Draggable>

    <div ref="elementRef">
      Drop in me

      <Transition name="circle-skeleton">
        <div
          v-if="isOvered && isDragging"
          class="circle-skeleton"
        />
      </Transition>

      <Draggable
        v-if="dropped"
        @end="dropped = false"
      >
        drag me to zone
      </Draggable>
    </div>
  </div>
</template>

<style>
  .circle-skeleton {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #000;
  }
  .circle-skeleton-leave-active {
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .circle-skeleton-enter-active {
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .circle-skeleton-enter-from {
    opacity: 0;
  }

  .circle-skeleton-leave-to {
    opacity: 0;
  }
</style>
