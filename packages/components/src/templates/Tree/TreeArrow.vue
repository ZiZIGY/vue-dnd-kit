<script setup lang="ts">
  interface Props {
    expanded?: boolean;
    onArrowClick?: () => void;
  }

  const { expanded = false, onArrowClick } = defineProps<Props>();
</script>

<template>
  <div class="tree-item-icon">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      :class="{ expanded: expanded }"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  </div>
</template>

<style scoped>
  .tree-item-icon {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    transition: color 0.2s ease;
    cursor: pointer;
    padding: 2px;
    border-radius: 4px;
  }

  .tree-item-icon:hover {
    background-color: #d1d5db;
    color: #374151;
  }

  svg {
    transition: transform 0.2s ease;
  }

  svg.expanded {
    transform: rotate(90deg);
  }
</style>
