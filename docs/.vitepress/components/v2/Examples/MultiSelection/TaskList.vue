<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable, makeSelectionArea } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import TaskItem from './TaskItem.vue';

  interface Task {
    id: number;
    name: string;
  }

  const props = defineProps<{ tasks: Task[] }>();
  const emit = defineEmits<{ (e: 'sort', items: Task[]): void }>();

  const listRef = useTemplateRef<HTMLElement>('listRef');

  const { isSelecting, style: selectionStyle } = makeSelectionArea(listRef, {
    modifier: {
      keys: ['ControlLeft', 'ControlRight'],
      method: 'some',
    },
  });

  makeDroppable(
    listRef,
    {
      events: {
        onDrop(e: IDragEvent) {
          const r = e.helpers.suggestSort('vertical');
          if (!r) return;
          emit('sort', r.sourceItems as Task[]);
        },
      },
    },
    () => props.tasks
  );
</script>

<template>
  <div
    ref="listRef"
    class="list"
  >
    <div
      v-if="isSelecting"
      class="selection-rect"
      :style="selectionStyle"
    />

    <TransitionGroup name="task">
      <TaskItem
        v-for="(task, index) in tasks"
        :key="task.id"
        :index="index"
        :items="tasks"
        :task="task"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
  .list {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    border: 2px dashed rgba(62, 175, 124, 0.25);
    border-radius: 10px;
    min-height: 80px;
    background-color: rgba(62, 175, 124, 0.03);
  }

  .selection-rect {
    border: 1.5px solid var(--vp-c-brand-1);
    background-color: rgba(62, 175, 124, 0.1);
    border-radius: 4px;
    z-index: 10;
  }

  .task-move {
    transition: transform 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .task-enter-active,
  .task-leave-active {
    transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .task-enter-from,
  .task-leave-to {
    opacity: 0;
    transform: translateY(-8px) scale(0.97);
  }

  .task-leave-active {
    position: absolute;
    left: 0.75rem;
    right: 0.75rem;
    pointer-events: none;
  }
</style>
