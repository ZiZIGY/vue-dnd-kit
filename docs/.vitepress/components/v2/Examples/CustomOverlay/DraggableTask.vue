<script setup lang="ts">
  import { markRaw, useTemplateRef } from 'vue';
  import { motion } from 'motion-v';
  import { makeDraggable } from '@vue-dnd-kit/core';
  import TaskOverlay from './TaskOverlay.vue';

  const props = defineProps<{
    id: string;
    label: string;
    priority: 'high' | 'medium' | 'low';
  }>();

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  const { isDragging } = makeDraggable(itemRef, {
    render: markRaw(TaskOverlay),
    data: () => ({ id: props.id, label: props.label, priority: props.priority }),
  });
</script>

<template>
  <motion.div
    ref="itemRef"
    class="task"
    :class="[`task--${props.priority}`, { 'task--dragging': isDragging }]"
    :initial="{ scale: 0.9, opacity: 0 }"
    :animate="{ scale: 1, opacity: isDragging ? 0 : 1 }"
    :transition="{ duration: 0.2 }"
  >
    <span class="task-icon">📋</span>
    <div class="task-body">
      <span class="task-label">{{ props.label }}</span>
      <span
        class="task-priority"
        :class="`priority--${props.priority}`"
      >{{ props.priority }}</span>
    </div>
  </motion.div>
</template>

<style scoped>
  .task {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    font-size: 0.875rem;
    cursor: grab;
    touch-action: none;
    user-select: none;
    background: rgba(59, 130, 246, 0.12);
    border: 1px solid rgba(59, 130, 246, 0.3);
    color: rgb(147, 197, 253);
  }

  .task:active { cursor: grabbing; }
  .task--dragging { opacity: 0; }

  .task-icon { font-size: 1rem; flex-shrink: 0; }

  .task-body {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    flex: 1;
  }

  .task-label { font-size: 0.8rem; font-weight: 500; }

  .task-priority {
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .priority--high { color: rgb(252, 165, 165); }
  .priority--medium { color: rgb(253, 230, 138); }
  .priority--low { color: rgb(134, 239, 172); }
</style>
