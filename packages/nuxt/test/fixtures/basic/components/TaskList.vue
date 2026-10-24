<script setup lang="ts">
const tasks = ref(['a', 'b', 'c'].map((id) => ({ id })));
// Auto-imported composables and types.
const options: SortableListOptions<{ id: string }> = { items: tasks };
const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), options);
const { isSelecting, style } = makeSelectionArea(useTemplateRef<HTMLElement>('area'));
const { status } = useDnD();
</script>

<template>
  <div
    ref="area"
    data-testid="area"
  >
    <ul ref="list">
      <TaskItem
        v-for="task in items"
        :key="task.id"
        :task-id="task.id"
      />
    </ul>
    <div
      v-if="isSelecting"
      :style="style"
    />
    <p data-testid="status">
      {{ status }}
    </p>
  </div>
</template>
