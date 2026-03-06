<script setup lang="ts">
  import { computed } from 'vue';
  import { useDnDProvider } from '@vue-dnd-kit/core';

  const { entities } = useDnDProvider();

  const draggingData = computed(() => {
    const [node] = entities.draggingMap.keys();
    if (!node) return null;
    return entities.draggableMap.get(node)?.data?.() as {
      label: string;
      priority: string;
    } | null;
  });
</script>

<template>
  <div class="task-overlay">
    <div class="task-icon">📋</div>
    <div class="task-content">
      <span class="task-label">{{ draggingData?.label }}</span>
      <span
        class="task-priority"
        :class="`priority--${draggingData?.priority}`"
        >{{ draggingData?.priority }}</span
      >
      *Custom overlay content! You can render anything*
    </div>
  </div>
</template>

<style scoped>
  .task-overlay {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 1rem;
    background: rgba(59, 130, 246, 0.2);
    border: 1px solid rgba(59, 130, 246, 0.5);
    border-radius: 10px;
    backdrop-filter: blur(8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    min-width: 160px;
    cursor: grabbing;
  }

  .task-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .task-content {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .task-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: rgb(191, 219, 254);
    white-space: nowrap;
  }

  .task-priority {
    font-size: 0.62rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .priority--high {
    color: rgb(252, 165, 165);
  }
  .priority--medium {
    color: rgb(253, 230, 138);
  }
  .priority--low {
    color: rgb(134, 239, 172);
  }
</style>
