<script setup lang="ts">
  import { ref } from 'vue';
  import Draggable from './Draggable.vue';
  import Droppable from './Droppable.vue';
  import DragOverlay from '../../../packages/core/src/components/DragOverlay.vue';

  const isDropped = ref(false);
</script>

<template>
  <div class="dnd-demo">
    <div>
      <Transition name="fade">
        <Draggable
          @end="isDropped = false"
          v-if="!isDropped"
        >
          drop me in zone
        </Draggable>
      </Transition>
    </div>

    <Droppable @drop="isDropped = true">
      <div>drop zone</div>
      <Transition name="fade">
        <Draggable
          v-if="isDropped"
          @end="isDropped = false"
        >
          drop me from zone
        </Draggable>
      </Transition>
    </Droppable>
    <DragOverlay />
  </div>
</template>

<style scoped>
  .dnd-demo {
    padding-top: 100px;
    display: flex;
    justify-content: space-between;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }
</style>
