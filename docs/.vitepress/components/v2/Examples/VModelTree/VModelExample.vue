<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import VModelGroup from './VModelGroup.vue';
  import type { Item } from './VModelGroup.vue';

  const makeBoard = (): Item[] => [
    {
      id: 'todo',
      title: 'To Do',
      children: [
        { id: 't1', title: 'Design mockups', color: '#3b82f6' },
        { id: 't2', title: 'Write specs', color: '#3b82f6' },
        { id: 't3', title: 'Setup CI', color: '#3b82f6' },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      children: [
        { id: 't4', title: 'Implement DnD', color: '#f97316' },
        { id: 't5', title: 'Review PR #42', color: '#f97316' },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      children: [
        { id: 't6', title: 'Project setup', color: '#22c55e' },
      ],
    },
  ];

  const board = ref<Item[]>(makeBoard());
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <div class="wrapper">
        <div class="board-header">
          <span class="board-title">Kanban — v-model recursive</span>
          <button
            class="reset-btn"
            @click="board = makeBoard()"
          >Reset</button>
        </div>

        <p class="board-hint">
          Drag tasks between columns · drag column headers to reorder columns
        </p>

        <!-- One array, one component — columns are items with children -->
        <VModelGroup
          v-model="board"
          direction="horizontal"
          group="column"
        />
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .board-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .board-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--vp-c-text-2);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .board-hint {
    font-size: 0.72rem;
    color: var(--vp-c-text-3);
    margin: 0;
  }

  .reset-btn {
    font-size: 0.65rem;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    border: 1px solid rgba(148, 163, 184, 0.3);
    background: rgba(148, 163, 184, 0.08);
    color: var(--vp-c-text-2);
    cursor: pointer;
    transition: background 0.15s;
  }

  .reset-btn:hover {
    background: rgba(148, 163, 184, 0.16);
  }
</style>
