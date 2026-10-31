<script setup lang="ts">
  import { toRef, useTemplateRef } from 'vue';
  import { makeSortableList, type DnDEvent, type SortableStrategy } from '@vue-dnd-kit/core';
  import CombineItem from './CombineItem.vue';
  import type { Entry, EntryList } from '../types';

  const props = defineProps<{ list: EntryList; strategy: SortableStrategy }>();
  const el = useTemplateRef<HTMLElement>('el');
  const { items } = makeSortableList(el, {
    id: props.list.id,
    items: toRef(props.list, 'entries'),
    group: props.list.id,
    strategy: () => props.strategy,
  });

  // Dropped into a group: the tasks leave the list (`e.source.remove()`, as for a trash
  // zone) and join the group's children, in the order they had in the list.
  const dropInto = (group: Entry, event: DnDEvent) => {
    const ids = new Set(event.active.ids);
    const moved = props.list.entries.filter((entry) => ids.has(entry.id));
    group.children!.push(...moved.map(({ id, title }) => ({ id, title })));
    event.source?.remove();
  };
</script>

<template>
  <ul
    ref="el"
    class="list"
    :class="strategy"
    :data-testid="list.id"
  >
    <CombineItem
      v-for="entry in items"
      :key="entry.id"
      :entry="entry"
      @into="dropInto(entry, $event)"
    />
  </ul>
</template>

<style scoped>
  .list.grid {
    display: grid;
    grid-template-columns: repeat(4, 100px);
    width: auto;
  }

  .list.grid > li {
    height: 64px;
  }
</style>
