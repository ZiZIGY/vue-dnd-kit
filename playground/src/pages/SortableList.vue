<script setup lang="ts">
  import { DnDOperations, useDroppable } from '@vue-dnd-kit/core';
  import Drag from 'src/components/Drag.vue';
  import { ref } from 'vue';

  const items = ref([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ]);

  const { elementRef } = useDroppable({
    events: {
      onDrop: (store) => {
        DnDOperations.applyTransfer(store);
      },
    },
  });
</script>

<template>
  <div ref="elementRef">
    <TransitionGroup name="sortable-list">
      <Drag
        v-for="(item, index) in items"
        :key="item.id"
        :source="items"
        :index="index"
      >
        {{ item.name }}
      </Drag>
    </TransitionGroup>
  </div>
</template>

<style>
  .sortable-list-move,
  .sortable-list-enter-active,
  .sortable-list-leave-active {
    transition: all 0.5s ease;
  }
  .sortable-list-enter-from,
  .sortable-list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
