<script setup lang="ts">
  import { toRef, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import TouchRow from './TouchRow.vue';
  import type { TouchColumn } from './data';

  const props = defineProps<{ column: TouchColumn }>();
  const listRef = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(listRef, {
    id: props.column.id,
    items: toRef(props.column, 'tasks'),
    group: 'touch-board',
  });
</script>

<template>
  <section
    class="touch-column"
    :data-testid="`column-${column.id}`"
  >
    <h3>
      {{ column.title }} <small>{{ column.tasks.length }}</small>
    </h3>
    <!-- The column scrolls vertically on its own; the list fills it, so an empty column is a target too. -->
    <div
      class="column-scroller"
      :data-testid="`scroller-${column.id}`"
    >
      <ul
        ref="list"
        class="cards"
        :data-testid="`list-${column.id}`"
      >
        <TouchRow
          v-for="task in items"
          :key="task.id"
          :task="task"
        />
      </ul>
    </div>
  </section>
</template>

<style scoped>
  .touch-column {
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 8px;
    background: var(--ui-bg-muted);
    border-radius: var(--ui-radius-lg);
    box-shadow: inset 0 0 0 1px var(--ui-border);
  }

  h3 {
    margin: 4px 4px 8px;
    font-size: 15px;
  }

  h3 small {
    color: var(--ui-text-muted);
    font-family: var(--font-mono);
    font-weight: 400;
  }

  .column-scroller {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    /*
     * Vertical only: `overflow-y: auto` makes this a scroll container on both axes, and
     * `contain` on x would stop a sideways swipe from reaching the board.
     */
    overscroll-behavior-y: contain;
    border-radius: 8px;
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
