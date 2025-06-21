<script setup lang="ts"></script>

<template>
  <div class="tree-drag-handle">
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <circle
        cx="9"
        cy="5"
        r="1"
      />
      <circle
        cx="9"
        cy="12"
        r="1"
      />
      <circle
        cx="9"
        cy="19"
        r="1"
      />
      <circle
        cx="15"
        cy="5"
        r="1"
      />
      <circle
        cx="15"
        cy="12"
        r="1"
      />
      <circle
        cx="15"
        cy="19"
        r="1"
      />
    </svg>
  </div>
</template>

<style scoped>
  .tree-drag-handle {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    cursor: grab;
    border-radius: 4px;
    transition: all 0.2s ease;
    opacity: 0;
    margin-left: 8px;
  }

  .tree-drag-handle:hover {
    background-color: #e5e7eb;
    color: #6b7280;
    opacity: 1;
  }

  .tree-drag-handle:active {
    cursor: grabbing;
    transform: scale(0.95);
  }

  /* Показываем drag handle при наведении на родительский элемент */
  .tree-item-content:hover .tree-drag-handle {
    opacity: 1;
  }
</style>
