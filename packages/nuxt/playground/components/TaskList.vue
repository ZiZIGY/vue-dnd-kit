<script setup lang="ts">
import type { Task } from '~/types';

const tasks = ref<Task[]>(
  Array.from({ length: 6 }, (_, index) => ({ id: `t${index + 1}`, title: `Task ${index + 1}` })),
);
const lastDrop = ref('');

// Composables and their types are auto-imported by the module.
const options: SortableListOptions<Task> = {
  items: tasks,
  onDrop: (event: SortableDropEvent<Task>) => {
    lastDrop.value = `${event.keys.join(', ')} → ${event.to.index}`;
  },
};
const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), options);
const { isSelecting, style } = makeSelectionArea(useTemplateRef<HTMLElement>('area'));
const { selection } = useDnD();
</script>

<template>
  <div
    ref="area"
    class="area"
  >
    <ul
      ref="list"
      class="list"
      data-testid="list"
    >
      <TaskItem
        v-for="task in items"
        :key="task.id"
        :task="task"
      />
    </ul>
    <div
      v-if="isSelecting"
      class="band"
      :style="style"
    />
    <p data-testid="order">
      {{ tasks.map((task) => task.id).join(',') }}
    </p>
    <p>Selected: {{ [...selection.ids].join(', ') || 'none' }}</p>
    <p v-if="lastDrop">
      Last drop: {{ lastDrop }}
    </p>
  </div>
</template>
