<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import TouchStatus from './TouchStatus.vue';
  import TouchHandleRow from './TouchHandleRow.vue';
  import { createTasks } from './data';

  /** Drag by the handle only; a swipe anywhere else on an item scrolls the page. */
  const tasks = ref(createTasks('h', 30, 'Step'));
  const listRef = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(listRef, { id: 'touch-handle', items: tasks });
</script>

<template>
  <section class="touch-demo">
    <h2>Drag handle</h2>
    <p class="hint">Drag an item by ⠿. Swiping or long-pressing the rest of the item scrolls the page.</p>
    <TouchStatus />
    <ul
      ref="list"
      class="touch-list"
      data-testid="touch-handle-list"
    >
      <TouchHandleRow
        v-for="task in items"
        :key="task.id"
        :task="task"
      />
    </ul>
    <pre
      class="touch-order"
      data-testid="touch-handle-order"
      >{{ tasks.map((task) => task.id).join(',') }}</pre
    >
  </section>
</template>

<style scoped>
  .touch-demo {
    max-width: 480px;
    margin: 0 auto;
  }

  h2 {
    margin: 0 0 4px;
  }

  .hint {
    margin: 0 0 8px;
    color: var(--ui-text-muted);
  }

  .touch-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .touch-order {
    white-space: pre-wrap;
    word-break: break-all;
  }
</style>
