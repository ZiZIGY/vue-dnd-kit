<script setup lang="ts">
  import { toRef, useTemplateRef } from 'vue';
  import { makeSortableList, type SortableListOptions } from '@vue-dnd-kit/core';
  import ActionRow from './ActionRow.vue';
  import type { Column, Task } from '../../types';

  const props = defineProps<{
    list: Column;
    other: Column;
    options?: Omit<SortableListOptions<Task>, 'items' | 'id' | 'group'>;
    report: (text: string) => void;
  }>();

  const el = useTemplateRef<HTMLElement>('el');
  const { items } = makeSortableList(el, {
    ...props.options,
    id: props.list.id,
    group: 'actions',
    items: toRef(props.list, 'tasks'),
  });
</script>

<template>
  <section>
    <h3>{{ list.title }}</h3>
    <ul
      ref="el"
      class="list action-list"
      :data-testid="list.id"
    >
      <ActionRow
        v-for="(task, index) in items"
        :key="task.id"
        :task="task"
        :index="index"
        :length="items.length"
        :other="other"
        :report="report"
      />
    </ul>
  </section>
</template>

<style scoped>
  .action-list {
    width: 400px;
  }
</style>
