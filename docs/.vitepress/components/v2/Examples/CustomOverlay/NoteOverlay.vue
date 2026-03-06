<script setup lang="ts">
  import { computed } from 'vue';
  import { useDnDProvider } from '@vue-dnd-kit/core';

  const { entities } = useDnDProvider();

  const draggingData = computed(() => {
    const [node] = entities.draggingMap.keys();
    if (!node) return null;
    return entities.draggableMap.get(node)?.data?.() as {
      text: string;
      color: string;
    } | null;
  });
</script>

<template>
  <div
    class="note-overlay"
    :class="`note--${draggingData?.color}`"
  >
    <span class="note-icon">📝</span>
    <span class="note-text">{{ draggingData?.text }}</span>
    *Custom to!*
  </div>
</template>

<style scoped>
  .note-overlay {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.875rem;
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 2px 2px 0 rgba(0, 0, 0, 0.2);
    min-width: 130px;
    cursor: grabbing;
    transform: rotate(2deg);
  }

  .note--amber {
    background: rgba(251, 191, 36, 0.25);
    border: 1px solid rgba(251, 191, 36, 0.5);
  }

  .note--rose {
    background: rgba(251, 113, 133, 0.2);
    border: 1px solid rgba(251, 113, 133, 0.45);
  }

  .note--teal {
    background: rgba(45, 212, 191, 0.18);
    border: 1px solid rgba(45, 212, 191, 0.4);
  }

  .note-icon {
    font-size: 1rem;
    flex-shrink: 0;
  }

  .note-text {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--vp-c-text-1);
    white-space: nowrap;
  }
</style>
