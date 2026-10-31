<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem, type SortablePosition } from '@vue-dnd-kit/core';
  import { useDnDActions } from '@vue-dnd-kit/actions';
  import type { Column, Task } from '../../types';

  const props = defineProps<{
    task: Task;
    index: number;
    length: number;
    other: Column;
    /** Shows what an action did. A function, not an event: a row moved to the other list is a new one by then. */
    report: (text: string) => void;
  }>();

  const el = useTemplateRef<HTMLElement>('el');
  makeSortableItem(el, { id: () => props.task.id });

  // Each row has its own: `moveItem` calls of the whole provider still run one by one.
  const { moveItem, startDrag } = useDnDActions();

  const move = async (label: string, to: SortablePosition) => {
    const { id } = props.task;
    const { report } = props;
    report(`${id} ${label}: ${(await moveItem(id, to)) ? 'moved' : 'refused'}`);
  };

  /** Picks the item up for the keyboard: the arrows, Space/Enter and Escape take over. */
  const pickUp = () => {
    if (startDrag(props.task.id, { type: 'keyboard' })) props.report(`${props.task.id}: picked up`);
  };
</script>

<template>
  <li
    ref="el"
    class="row action-row"
    :data-id="task.id"
  >
    <span class="title">{{ task.title }}</span>
    <span class="tools">
      <button
        aria-label="Up"
        :disabled="index === 0"
        @click="move('up', { index: index - 1 })"
      >
        ↑
      </button>
      <button
        aria-label="Down"
        :disabled="index === length - 1"
        @click="move('down', { index: index + 1 })"
      >
        ↓
      </button>
      <button
        aria-label="To the top"
        :disabled="index === 0"
        @click="move('top', { index: 0 })"
      >
        ⤒
      </button>
      <button
        :aria-label="`To ${other.title}`"
        @click="move(`to ${other.id}`, { list: other.id, index: 0 })"
      >
        → {{ other.title }}
      </button>
      <button
        aria-label="Move with keys"
        @click="pickUp"
      >
        ⌨
      </button>
    </span>
  </li>
</template>

<style scoped>
  .action-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .tools {
    display: flex;
    gap: 4px;
  }

  .tools button {
    min-width: 28px;
    height: 28px;
    padding: 0 6px;
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius-sm);
    background: var(--ui-bg-muted);
    color: var(--ui-text);
    cursor: pointer;
  }

  .tools button:hover:not(:disabled) {
    background: var(--ui-bg-elevated);
  }

  .tools button:disabled {
    color: var(--ui-text-dimmed);
    cursor: default;
  }
</style>
