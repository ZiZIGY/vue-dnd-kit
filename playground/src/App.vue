<script setup lang="ts">
  import { useDraggable } from '@vue-dnd-kit/core';
  import Container from './components/Container.vue';
  import { markRaw } from 'vue';
  const { elementRef, handleDragStart } = useDraggable({
    container: markRaw(Container),
    containerProps: {
      message: 'kek',
    },
  });
</script>

<template>
  <div
    ref="elementRef"
    class="draggable"
    @pointerdown="handleDragStart"
  >
    wwww
  </div>
</template>

<style>
  pre {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1000;
    height: 100vh;
    overflow: auto;
  }
  .sortable-container {
    max-width: 500px;
    margin: 0 auto;
  }

  .add-task-btn {
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-weight: 500;
  }

  .add-task-btn:hover {
    background-color: #2563eb;
  }

  .task-transition-group {
    position: relative;
  }

  .task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .task-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .task-status {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    background-color: #f3f4f6;
  }

  .remove-btn {
    background-color: #ef4444;
    color: white;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }

  .remove-btn:hover {
    background-color: #dc2626;
  }

  /* TransitionGroup animations */
  .task-list-enter-active,
  .task-list-leave-active {
    transition: all 0.5s ease;
  }

  .task-list-enter-from {
    opacity: 0;
    transform: translateY(-30px);
  }

  .task-list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .task-list-move {
    transition: transform 0.5s ease;
  }
</style>
