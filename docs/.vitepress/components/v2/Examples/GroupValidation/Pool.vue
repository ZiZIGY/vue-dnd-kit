<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSelectionArea } from '@vue-dnd-kit/core';
  import DraggableItem from './DraggableItem.vue';

  interface Task {
    id: string;
    group: string;
    label: string;
    color: 'blue' | 'purple';
  }

  const props = defineProps<{ tasks: Task[] }>();

  const poolRef = useTemplateRef<HTMLElement>('poolRef');

  const { isSelecting, style: selectionStyle } = makeSelectionArea(poolRef, {
    modifier: { keys: ['ControlLeft', 'ControlRight'], method: 'some' },
  });
</script>

<template>
  <div
    ref="poolRef"
    class="pool"
  >
    <div
      v-if="isSelecting"
      class="selection-rect"
      :style="selectionStyle"
    />
    <TransitionGroup name="item">
      <DraggableItem
        v-for="(task, i) in props.tasks"
        :key="task.id"
        :id="task.id"
        :index="i"
        :items="props.tasks"
        :group="task.group"
        :label="task.label"
        :color="task.color"
      />
    </TransitionGroup>
    <span
      v-if="props.tasks.length === 0"
      class="empty"
    >All tasks moved</span>
  </div>
</template>

<style scoped>
  .pool {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    min-height: 2rem;
    padding: 0.25rem;
    border-radius: 8px;
  }

  .selection-rect {
    border: 1.5px solid rgba(62, 175, 124, 0.7);
    background-color: rgba(62, 175, 124, 0.08);
    border-radius: 4px;
    z-index: 10;
  }

  .empty {
    font-size: 0.75rem;
    color: var(--vp-c-text-3);
    font-style: italic;
    padding: 0.25rem;
  }

  .item-move { transition: transform 0.22s cubic-bezier(0.165, 0.84, 0.44, 1); }
  .item-enter-active, .item-leave-active { transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1); }
  .item-enter-from, .item-leave-to { opacity: 0; transform: scale(0.93) translateY(-4px); }
</style>
