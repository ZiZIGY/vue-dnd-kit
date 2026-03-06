<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import DraggableItem from './DraggableItem.vue';

  interface Item {
    id: number;
    name: string;
  }

  const props = defineProps<{
    items: Item[];
    onDrop?: (e: IDragEvent) => void;
  }>();

  const columnRef = useTemplateRef<HTMLElement>('columnRef');

  makeDroppable(
    columnRef,
    {
      events: {
        onDrop(e) {
          props.onDrop?.(e);
        },
      },
    },
    () => props.items
  );
</script>

<template>
  <div
    ref="columnRef"
    class="dropzone"
  >
    <TransitionGroup name="list">
      <DraggableItem
        v-for="(item, index) in items"
        :key="item.id"
        :index="index"
        :items="items"
      >
        {{ item.name }}
      </DraggableItem>
    </TransitionGroup>
  </div>
</template>

<style scoped>
  .dropzone {
    position: relative;
    width: 100%;
    min-height: 80px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    border: 1px dashed rgba(62, 175, 124, 0.3);
    border-radius: 6px;
    background-color: rgba(62, 175, 124, 0.08);
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
    left: 0;
    right: 0;
    pointer-events: none;
  }
</style>

