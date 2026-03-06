<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import TaskList from './TaskList.vue';

  interface Task {
    id: number;
    name: string;
  }

  const tasks = ref<Task[]>([
    { id: 1, name: 'Homepage redesign' },
    { id: 2, name: 'Fix navigation bug' },
    { id: 3, name: 'Write unit tests' },
    { id: 4, name: 'Update documentation' },
    { id: 5, name: 'Deploy to staging' },
  ]);
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <div class="demo">
        <div class="hint">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          Use <kbd>Ctrl</kbd> + drag to rubber-band select items, or click checkboxes.
          Then drag any selected item to move them all.
        </div>

        <TaskList
          :tasks="tasks"
          @sort="tasks = $event"
        />
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .demo {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .hint {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--vp-c-text-2);
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    background-color: rgba(148, 163, 184, 0.07);
    border: 1px solid rgba(148, 163, 184, 0.15);
    flex-wrap: wrap;
  }

  kbd {
    display: inline-flex;
    align-items: center;
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-family: var(--vp-font-family-mono);
    background-color: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: var(--vp-c-text-1);
  }
</style>
