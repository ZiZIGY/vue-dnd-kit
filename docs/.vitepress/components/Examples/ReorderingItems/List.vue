<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import Draggable from './Draggable.vue';
  import { DnDOperations, useDroppable } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';

  const { elementRef, isOvered, isAllowed } = useDroppable({
    data: computed(() => ({
      source: items,
    })),
    events: {
      onDrop: (store, payload) => {
        DnDOperations.applyTransfer(store);
      },
    },
  });

  const items = ref([
    { id: crypto.randomUUID(), content: crypto.randomUUID() },
    { id: crypto.randomUUID(), content: crypto.randomUUID() },
    { id: crypto.randomUUID(), content: crypto.randomUUID() },
  ]);

  const addItem = () =>
    items.value.push({
      id: crypto.randomUUID(),
      content: crypto.randomUUID(),
    });

  const removeItem = (index: number) => items.value.splice(index, 1);
</script>

<template>
  <ExampleContainer>
    <button
      @click="addItem"
      class="add-item-button"
      >Add Item</button
    >
    <div
      class="list"
      ref="elementRef"
    >
      <TransitionGroup name="list">
        <Draggable
          v-for="(item, index) in items"
          :key="item.id"
          :source="items"
          :index="index"
        >
          <div class="item">
            {{ item.content }}
            <button @click="removeItem(index)">Remove</button>
          </div>
        </Draggable>
      </TransitionGroup>
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    position: relative;
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
    height: 0px;
  }
  .list-leave-active {
    position: absolute;
    pointer-events: none;
  }
  .add-item-button {
    margin-bottom: 12px;
    padding: 12px 16px;
    border-radius: 6px;
    background-color: #3eaf7c;
    color: white;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      background-color: #3eaf7c;
      transform: translateY(-2px);
    }
  }
</style>
