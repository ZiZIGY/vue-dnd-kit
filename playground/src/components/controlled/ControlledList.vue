<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableList, type SortableListOptions } from '@vue-dnd-kit/core';
  import DemoItem from '../DemoItem.vue';
  import type { Card } from './store';

  const props = withDefaults(
    defineProps<{
      listId: string;
      title: string;
      /** A read-only source: the library never writes it. */
      source: () => readonly Card[];
      options?: Omit<SortableListOptions<Card>, 'items' | 'id'>;
    }>(),
    { options: () => ({}) },
  );

  const el = useTemplateRef<HTMLElement>('el');
  const { items, isOver, isAccepting } = makeSortableList(el, {
    ...props.options,
    id: props.listId,
    items: props.source,
  });
</script>

<template>
  <div>
    <h3>{{ title }}</h3>
    <ul
      ref="el"
      class="list"
      :data-testid="listId"
      :data-over="isOver || undefined"
      :data-accepting="isAccepting || undefined"
    >
      <DemoItem
        v-for="card in items"
        :key="card.id"
        :item="card"
      />
    </ul>
  </div>
</template>
