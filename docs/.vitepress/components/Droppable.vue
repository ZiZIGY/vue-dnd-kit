<script setup>
  import { useDroppable } from '@vue-dnd-kit/core';

  const emit = defineEmits(['drop']);

  const { elementRef, isOvered, isAllowed } = useDroppable({
    groups: ['example'],
    events: {
      onDrop: () => emit('drop'),
    },
  });
</script>

<template>
  <div
    ref="elementRef"
    class="droppable"
    :class="{ 'is-overed': isOvered, 'is-allowed': isAllowed }"
  >
    <slot />
  </div>
</template>

<style scoped>
  .droppable {
    padding: 20px;
    max-width: 400px;
    width: 100%;
    border: 1px solid var(--vp-c-bg-soft);
    border-radius: 6px;
    cursor: pointer;
    background-color: var(--vp-c-bg-soft);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-height: 300px;
    height: 300px;
    transition: transform 0.3s ease;
    overflow: hidden;
  }
  .is-allowed {
    transform: scale(1.1);
  }
  .is-overed {
    background-color: var(--vp-c-default-soft);
    border-color: #3eaf7c;
    transform: scale(1);
  }
  .is-allowed::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(62, 175, 124, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
