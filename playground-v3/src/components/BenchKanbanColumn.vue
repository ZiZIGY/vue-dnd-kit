<script setup lang="ts">
  import { useTemplateRef, type ShallowRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import SortableRow from './SortableRow.vue';
  import { trackReorders } from '../bench';
  import type { Task } from '../types';

  const props = defineProps<{
    column: { id: string; tasks: ShallowRef<Task[]> };
    bench: NonNullable<Window['__bench']>;
  }>();
  const listRef = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(listRef, {
    id: props.column.id,
    items: props.column.tasks,
    group: 'bench-board',
  });
  trackReorders(props.bench, items);
</script>

<template>
  <div class="scroller">
    <ul
      ref="list"
      class="list"
      :data-testid="`bench-${column.id}`"
    >
      <SortableRow
        v-for="task in items"
        :key="task.id"
        :item="task"
      />
    </ul>
  </div>
</template>

<style scoped>
  .scroller {
    height: 640px;
    overflow: auto;
    flex: none;
  }

  .list {
    width: 200px;
  }
</style>
