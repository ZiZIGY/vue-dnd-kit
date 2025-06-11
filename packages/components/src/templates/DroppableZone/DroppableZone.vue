<template>
  <div
    class="droppable-zone"
    :class="{
      'is-over': isOver,
      'is-active': isActive,
    }"
    ref="droppableRef"
  >
    <slot
      :isOver="isOver"
      :isActive="isActive"
    ></slot>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    id: string;
    data?: any;
    disabled?: boolean;
    accept?: string[];
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    data: () => ({}),
    accept: () => [],
  });

  defineEmits(['drop', 'dragEnter', 'dragLeave']);
</script>

<style scoped>
  .droppable-zone {
    padding: 16px;
    background-color: #f9f9f9;
    border: 2px dashed #ccc;
    border-radius: 8px;
    transition: background-color 0.2s, border-color 0.2s;
    min-height: 100px;
    display: flex;
    flex-direction: column;
  }

  .droppable-zone.is-active {
    background-color: #f0f8ff;
    border-color: #90caf9;
  }

  .droppable-zone.is-over {
    background-color: #e3f2fd;
    border-color: #42a5f5;
  }
</style>
