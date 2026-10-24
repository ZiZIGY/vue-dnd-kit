<script setup lang="ts">
  import { useTemplateRef, type Ref } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import SortableRow from './SortableRow.vue';
  import type { Task } from '../types';

  // Root component of the app mounted inside the shadow root: receives the host app's ref.
  const props = defineProps<{ tasks: Ref<Task[]> }>();
  const listRef = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(listRef, { items: props.tasks, id: 'shadow-list' });
</script>

<template>
  <div
    class="scroller"
    data-testid="shadow-scroller"
  >
    <ul
      ref="list"
      class="list"
      data-testid="shadow-list"
    >
      <SortableRow
        v-for="task in items"
        :key="task.id"
        :item="task"
      />
    </ul>
  </div>
</template>
