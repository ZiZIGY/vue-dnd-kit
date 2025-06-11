<template>
  <div
    class="draggable-card"
    :class="{ 'is-dragging': isDragging }"
    ref="draggableRef"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  interface Props {
    id: string;
    data?: any;
    disabled?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    data: () => ({}),
  });

  // Создаем ссылку на DOM элемент
  const draggableRef = ref<HTMLElement | null>(null);
</script>

<style scoped>
  .draggable-card {
    padding: 16px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: grab;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .draggable-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .draggable-card.is-dragging {
    opacity: 0.5;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    cursor: grabbing;
  }
</style>
