<script setup lang="ts">
  import { ref } from 'vue';
  import TouchStatus from './TouchStatus.vue';
  import TouchKanbanColumn from './TouchKanbanColumn.vue';
  import { createTasks, type TouchColumn } from './data';

  /**
   * A phone kanban: one column per screen in a horizontal scroller with scroll snapping.
   * Long-press a card, hold it at the left or right screen edge to scroll to the
   * neighbouring column, or at the top or bottom of a column to scroll the column.
   */
  const columns = ref<TouchColumn[]>([
    { id: 'todo', title: 'To do', tasks: createTasks('a', 16, 'Card') },
    { id: 'doing', title: 'Doing', tasks: createTasks('b', 3, 'Card') },
    { id: 'done', title: 'Done', tasks: [] },
  ]);
</script>

<template>
  <!-- Full screen, like a kanban app: the playground nav would take a third of a phone screen. -->
  <section class="touch-kanban">
    <header>
      <a
        href="#sortable"
        class="back"
        >‹ Demos</a
      >
      <h2>Kanban</h2>
    </header>
    <div class="status-row">
      <TouchStatus />
    </div>
    <div
      class="kanban-board"
      data-testid="board-scroller"
    >
      <TouchKanbanColumn
        v-for="column in columns"
        :key="column.id"
        :column="column"
      />
    </div>
    <pre
      class="state"
      data-testid="board"
      >{{
        columns.map((column) => `${column.id}:${column.tasks.map((task) => task.id).join(',')}`).join(' | ')
      }}</pre
    >
  </section>
</template>

<style scoped>
  .touch-kanban {
    position: fixed;
    inset: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    background: var(--stage);
  }

  header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px 0;
  }

  h2 {
    margin: 0;
    font-size: 18px;
  }

  .back {
    color: var(--ui-primary);
    text-decoration: none;
  }

  .status-row {
    padding: 4px 12px 0;
  }

  /*
   * One column per screen: each column is as wide as the board, and the board snaps to
   * columns. The edges of the board are the edges of the screen, where holding a card
   * scrolls to the neighbouring column.
   */
  .kanban-board {
    display: grid;
    flex: 1;
    grid-auto-columns: 100%;
    grid-auto-flow: column;
    grid-template-rows: minmax(0, 1fr);
    min-height: 0;
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
  }

  .kanban-board > :deep(.touch-column) {
    margin: 8px 12px 12px;
    scroll-snap-align: center;
    scroll-snap-stop: always;
  }

  .state {
    margin: 0;
    padding: 4px 12px 8px;
    font-size: 11px;
    white-space: pre-wrap;
    word-break: break-all;
  }
</style>
