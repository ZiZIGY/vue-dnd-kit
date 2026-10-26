<script setup lang="ts">
import { reactive, shallowRef } from 'vue';
import { useDnDMonitor, type SortableDropEvent } from '@vue-dnd-kit/core';
import Column from './Column.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import type { Answer, Task } from './types';

const columns = reactive([
  {
    id: 'todo',
    title: 'To do',
    color: '#a1a1aa',
    tasks: [
      { id: 'changelog', title: 'Write the changelog' },
      { id: 'tag', title: 'Tag the release' },
      { id: 'announce', title: 'Announce it' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    color: '#42b883',
    confirm: true,
    tasks: [{ id: 'tests', title: 'Fix the flaky tests' }],
  },
]);

// The open question: the card it is about, and how to answer the waiting `onBeforeDrop`.
const question = shallowRef<{ title: string; resolve: (answer: Answer) => void } | null>(null);
const resumed = shallowRef(false);

/** Opens the dialog. The drop waits for the answer, the overlay where it was let go. */
const ask = (event: SortableDropEvent<Task>) =>
  new Promise<Answer>((resolve) => {
    resumed.value = false;
    question.value = { title: event.items[0]!.title, resolve };
  });

const answer = (value: Answer) => {
  question.value?.resolve(value);
  question.value = null;
};

// After "Keep dragging" the card follows the pointer with no button held: a click drops it.
useDnDMonitor({
  onDragResume() {
    resumed.value = true;
  },
  onDragEnd() {
    resumed.value = false;
  },
  onDragCancel() {
    resumed.value = false;
  },
});
</script>

<template>
  <div class="release">
    <div class="board">
      <Column v-for="column in columns" :key="column.id" :column="column" :ask="ask" />
    </div>
    <p v-if="resumed" class="hint resumed">Still dragging: click to drop, Esc to cancel</p>
    <p v-else class="hint">Cards moving into Done ask first</p>
    <ConfirmDialog v-if="question" :title="question.title" @answer="answer" />
  </div>
</template>

<style scoped>
.release {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.board {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 220px));
  gap: 14px;
  justify-content: center;
  width: 100%;
}

.hint {
  margin: 0;
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  text-align: center;
  opacity: 0.55;
}

.hint.resumed {
  color: #42b883;
  opacity: 1;
}
</style>
