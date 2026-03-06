<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable, makeAutoScroll } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import SortItem from './SortItem.vue';

  interface Item {
    id: number;
    name: string;
  }

  const props = defineProps<{
    items: Item[];
    onDrop: (e: IDragEvent) => void;
  }>();

  const listRef = useTemplateRef<HTMLElement>('listRef');

  makeDroppable(
    listRef,
    {
      events: {
        onDrop(e) {
          props.onDrop(e);
        },
      },
    },
    () => props.items
  );

  const { isScrolling } = makeAutoScroll(listRef, {
    threshold: 60,
    speed: 1.5,
  });
</script>

<template>
  <div
    ref="listRef"
    class="scroll-list"
    :class="{ 'is-scrolling': isScrolling }"
  >
    <TransitionGroup name="list">
      <SortItem
        v-for="(item, index) in items"
        :key="item.id"
        :index="index"
        :items="items"
      >
        {{ item.name }}
      </SortItem>
    </TransitionGroup>
  </div>
</template>

<style scoped>
  .scroll-list {
    height: 280px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    border: 1px dashed rgba(62, 175, 124, 0.35);
    border-radius: 8px;
    background: rgba(62, 175, 124, 0.06);
    transition: border-color 0.2s, box-shadow 0.2s;
    scrollbar-width: thin;
    scrollbar-color: rgba(62, 175, 124, 0.4) transparent;
  }

  .scroll-list.is-scrolling {
    border-color: var(--vp-c-brand-1);
    box-shadow: 0 0 0 2px rgba(62, 175, 124, 0.2);
  }

  .list-move {
    transition: transform 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .list-enter-active,
  .list-leave-active {
    transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  .list-leave-active {
    position: absolute;
    pointer-events: none;
  }
</style>
