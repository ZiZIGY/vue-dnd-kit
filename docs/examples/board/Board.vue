<script setup lang="ts">
import { ref, shallowRef, useTemplateRef } from 'vue';
import { makeSortableList, useDnD, useDnDMonitor, type SortableDropEvent } from '@vue-dnd-kit/core';
import Column from './Column.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import Trash from './Trash.vue';
import type { Answer, Task } from './types';

const columns = ref([
  {
    id: 'todo',
    title: 'To do',
    color: '#a1a1aa',
    cards: [
      { id: 'vdk-21', title: 'Drag handles for table rows', tag: 'Feature' },
      { id: 'vdk-24', title: 'Overlay jumps on scroll', tag: 'Bug' },
      { id: 'vdk-25', title: 'Write the migration guide', tag: 'Docs' },
    ],
  },
  {
    id: 'doing',
    title: 'In progress',
    color: '#f59e0b',
    limit: 3,
    cards: [
      { id: 'vdk-18', title: 'Keyboard sorting', tag: 'Feature' },
      { id: 'vdk-19', title: 'Empty state artwork', tag: 'Design' },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    color: '#a855f7',
    limit: 2,
    cards: [
      { id: 'vdk-15', title: 'Faster auto-scroll', tag: 'Feature' },
      { id: 'vdk-16', title: 'Focus ring after a drop', tag: 'Bug' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    color: '#42b883',
    confirm: true,
    cards: [{ id: 'vdk-12', title: 'Sortable trees', tag: 'Feature' }],
  },
]);

const el = useTemplateRef<HTMLElement>('el');
// The columns are a sortable list too, side by side: drag a column by its header.
const { items } = makeSortableList(el, { items: columns, strategy: 'horizontal' });

// The open question about cards moving into Done, and how to answer the waiting drop.
const question = shallowRef<{ cards: Task[]; resolve: (answer: Answer) => void } | null>(null);
const ask = (event: SortableDropEvent<Task>) =>
  new Promise<Answer>((resolve) => {
    question.value = { cards: event.items, resolve };
  });
const answer = (value: Answer) => {
  question.value?.resolve(value);
  question.value = null;
};

const { selection } = useDnD();
// After "Keep dragging" the card follows the pointer with no button held: a click drops it.
const resumed = ref(false);
useDnDMonitor({
  onDragResume: () => (resumed.value = true),
  onDragEnd: () => (resumed.value = false),
  onDragCancel: () => (resumed.value = false),
});
</script>

<template>
  <div class="board">
    <header class="toolbar">
      <div class="intro">
        <strong>Sprint 24</strong>
        <span v-if="resumed" class="hint resumed">Still dragging: click to drop, Esc to cancel</span>
        <span v-else-if="selection.ids.size" class="hint">
          {{ selection.ids.size }} selected
          <button type="button" class="clear" @click="selection.clear()">Clear</button>
        </span>
        <span v-else class="hint">Ctrl/Cmd-click cards to select several</span>
      </div>
      <Trash />
    </header>
    <div ref="el" class="columns">
      <Column v-for="column in items" :key="column.id" :column="column" :ask="ask" />
    </div>
    <ConfirmDialog v-if="question" :cards="question.cards" @answer="answer" />
  </div>
</template>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 700px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 16px;
}

.intro {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.intro strong {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.hint {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 18px;
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}

.hint.resumed {
  color: #42b883;
  opacity: 1;
}

.clear {
  padding: 2px 7px;
  border: 0;
  border-radius: 6px;
  background: color-mix(in srgb, currentColor 10%, transparent);
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.clear:focus-visible {
  outline: 2px solid #42b883;
}

/* Side by side; on a narrow screen the board scrolls sideways, as boards do. */
.columns {
  display: grid;
  grid-auto-columns: minmax(152px, 1fr);
  grid-auto-flow: column;
  gap: 10px;
  overflow-x: auto;
}
</style>
