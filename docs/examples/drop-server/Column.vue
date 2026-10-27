<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import { board, saveMove } from './server';
import TaskCard from './TaskCard.vue';

const props = defineProps<{ id: string; title: string }>();

const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, {
  id: props.id,
  // A getter: the library never writes it. The drop is applied below, once saved.
  items: () => board[props.id]!,
  group: 'sprint',
  // The overlay waits where it was let go until this promise settles.
  onBeforeDrop: async (event) => {
    event.preventDefault();
    try {
      await saveMove(event.keys, event.to);
    } catch {
      // Nothing applied: the card flies back to where it was.
      return 'reject';
    }
    // Applied before the promise resolves: the card lands in its new place.
    for (const [id, tasks] of event.result) board[id] = tasks;
    return 'accept';
  },
});
</script>

<template>
  <section class="column" :class="{ over: isOver }">
    <h3>
      {{ title }}
      <span class="count">{{ items.length }}</span>
    </h3>
    <ul ref="list" class="cards">
      <TaskCard v-for="task in items" :key="task.id" :task="task" />
    </ul>
  </section>
</template>

<style scoped>
.column {
  padding: 10px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, transparent);
  transition: border-color 0.2s;
}

.column.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
}

h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

.count {
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 170px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
