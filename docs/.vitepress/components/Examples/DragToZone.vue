<script setup lang="ts">
  import { useDraggable, useDroppable } from '@vue-dnd-kit/core';
  import ExampleContainer from '../ExampleContainer.vue';
  import { ref } from 'vue';

  const { elementRef, isDragging, handleDragStart } = useDraggable();

  const dropped = ref<boolean>(false);

  const { elementRef: droppableRef, isOvered } = useDroppable({
    events: {
      onDrop: () => {
        dropped.value = true;
      },
    },
  });
</script>

<template>
  <ExampleContainer>
    <div class="flex">
      <div
        v-if="!dropped"
        ref="elementRef"
        :class="{ dragging: isDragging }"
        class="draggable"
        @pointerdown="handleDragStart"
      >
        Drag me!
      </div>

      <div
        ref="droppableRef"
        :class="{ dropped, over: isOvered }"
        class="box"
      >
        {{ dropped ? 'Dropped!' : 'Drop here' }}
      </div>
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .flex {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .draggable {
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background-color: #000;

    transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .box {
    transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    padding: 16px;
    border-radius: 8px;
    border: 2px solid transparent;
  }

  .dragging {
    opacity: 0;
    height: 0px;
  }

  .dropped {
    background-color: #000;
    color: #fff;
  }
  .over {
    border: 2px solid #000;
    color: #fff;
  }
</style>
