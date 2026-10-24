<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import TouchStatus from './TouchStatus.vue';
  import TouchRow from './TouchRow.vue';
  import { createTasks } from './data';

  /**
   * A long list on a phone: the page itself scrolls. Long-press anywhere on an item to
   * pick it up; a quick swipe scrolls. Holding the item at the top or bottom edge of
   * the screen scrolls the page (auto-scroll of the window).
   */
  const tasks = ref(createTasks('t', 40));
  const listRef = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(listRef, { id: 'touch-list', items: tasks });
</script>

<template>
  <section class="touch-demo">
    <h2>Long list</h2>
    <p class="hint">Long-press an item to drag it, swipe to scroll. Hold it at the screen edge to scroll the page.</p>
    <TouchStatus />
    <ul
      ref="list"
      class="touch-list"
      data-testid="touch-list"
    >
      <TouchRow
        v-for="task in items"
        :key="task.id"
        :task="task"
      />
    </ul>
    <pre
      class="touch-order"
      data-testid="touch-list-order"
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
    color: #4b5563;
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
