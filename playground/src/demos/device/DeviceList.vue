<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import DeviceRow from './DeviceRow.vue';
  import { createTasks } from '../touch/data';

  /** A sortable list of a device check. `prefix` keeps its ids unique on the page. */
  const props = withDefaults(
    defineProps<{
      prefix: string;
      count: number;
      variant?: 'plain' | 'rich' | 'handle';
      group?: string;
      label?: string;
    }>(),
    { variant: 'plain', group: undefined, label: 'Item' },
  );

  const tasks = ref(createTasks(props.prefix, props.count, props.label));
  const list = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(list, { id: `device-${props.prefix}`, items: tasks, group: props.group });
</script>

<template>
  <ul
    ref="list"
    class="device-list"
    :data-testid="`list-${prefix}`"
  >
    <DeviceRow
      v-for="task in items"
      :key="task.id"
      :task="task"
      :variant="variant"
    />
  </ul>
</template>

<style scoped>
  .device-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 68px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
