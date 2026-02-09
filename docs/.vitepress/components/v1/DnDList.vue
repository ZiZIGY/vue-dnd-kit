<script setup>
  import { ref, computed } from 'vue';
  import { useDroppable, DnDOperations } from '@vue-dnd-kit/core';
  import { useDnDStore } from '@vue-dnd-kit/core';
  import DraggableList from './DraggableList.vue';
  const items = ref([
    { id: 1, content: 'Item 1', color: '#3eaf7c' },
    { id: 2, content: 'Item 2', color: '#42b983' },
    { id: 3, content: 'Item 3', color: '#35495e' },
    { id: 4, content: 'Item 4', color: '#41b883' },
    { id: 5, content: 'Item 5', color: '#2c3e50' },
  ]);

  const { elementRef } = useDroppable({
    groups: ['list'],
    data: computed(() => ({
      source: items,
    })),
    events: {
      onDrop: DnDOperations.applyTransfer,
    },
  });
</script>

<template>
  <div
    ref="elementRef"
    class="dnd-list"
  >
    <TransitionGroup name="list">
      <DraggableList
        v-for="(item, index) in items"
        :key="item.id"
        :index="index"
        :source="items"
      >
        {{ item.content }}
      </DraggableList>
    </TransitionGroup>
  </div>
</template>

<style>
  .dnd-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .list-move {
    transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
</style>
