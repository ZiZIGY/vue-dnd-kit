<script setup lang="ts">
  import { toRef, useTemplateRef } from 'vue';
  import { makeSortableItem, makeSortableList } from '@vue-dnd-kit/core';
  import DemoItem from './DemoItem.vue';
  import type { Column } from '../types';

  const props = defineProps<{ column: Column }>();
  const el = useTemplateRef<HTMLElement>('el');
  const handle = useTemplateRef<HTMLElement>('handle');
  const cards = useTemplateRef<HTMLElement>('cards');

  // The column is an item of the columns list (dragged by its header)...
  makeSortableItem(el, { id: () => props.column.id, handle });
  // ...and holds a card list of its own, in another group.
  const { items, isAccepting } = makeSortableList(cards, {
    id: `${props.column.id}-cards`,
    items: toRef(props.column, 'tasks'),
    group: 'board',
  });
</script>

<template>
  <li
    ref="el"
    class="column"
    :data-id="column.id"
  >
    <header
      ref="handle"
      :data-testid="`${column.id}-header`"
    >
      {{ column.title }}
    </header>
    <ul
      ref="cards"
      :data-testid="`${column.id}-cards`"
      :data-accepting="isAccepting || undefined"
    >
      <DemoItem
        v-for="task in items"
        :key="task.id"
        :item="task"
      />
    </ul>
  </li>
</template>
