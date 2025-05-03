<script setup lang="ts">
  import Draggable from './Draggable.vue';
  import ExampleContainer from '../../ExampleContainer.vue';
  import { computed, ref } from 'vue';
  import { useDroppable, DnDOperations } from '@vue-dnd-kit/core';
  const firstColumn = ref([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ]);

  const secondColumn = ref([
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
  ]);

  const { elementRef: firstColumnRef } = useDroppable({
    data: {
      source: firstColumn.value,
    },
    events: {
      onDrop: DnDOperations.applyTransfer,
    },
  });

  const { elementRef: secondColumnRef } = useDroppable({
    data: {
      source: secondColumn.value,
    },
    events: {
      onDrop: DnDOperations.applyTransfer,
    },
  });
</script>

<template>
  <ExampleContainer>
    <div class="container">
      <div
        class="dropzone"
        ref="firstColumnRef"
      >
        <TransitionGroup name="list">
          <Draggable
            v-for="(item, index) in firstColumn"
            :key="item.id"
            :index="index"
            :source="firstColumn"
          >
            {{ item.name }}
          </Draggable>
        </TransitionGroup>
      </div>

      <div
        class="dropzone"
        ref="secondColumnRef"
      >
        <TransitionGroup name="list">
          <Draggable
            v-for="(item, index) in secondColumn"
            :key="item.id"
            :index="index"
            :source="secondColumn"
          >
            {{ item.name }}
          </Draggable>
        </TransitionGroup>
      </div>
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .list-move {
    transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .list-enter-active,
  .list-leave-active {
    transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }

  .list-leave-active {
    position: absolute;
    pointer-events: none;
  }

  .dropzone {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 1px dashed rgba(62, 175, 124, 0.3);
    border-radius: 6px;
    background-color: rgba(62, 175, 124, 0.1);
  }

  .is-overed {
    background-color: rgba(62, 175, 124, 0.2);
  }
</style>
