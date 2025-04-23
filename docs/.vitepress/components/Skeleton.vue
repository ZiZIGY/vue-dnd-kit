<template>
  <div
    class="skeleton"
    :style="{ width, height }"
  >
    <div class="skeleton-shimmer"></div>
  </div>
</template>

<script setup>
  defineProps({
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '40px',
    },
  });
</script>

<style scoped>
  .skeleton {
    position: relative;
    overflow: hidden;
    background-color: rgba(62, 175, 124, 0.1);
    border-radius: 6px;
    border: 1px dashed rgba(62, 175, 124, 0.3);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .skeleton-shimmer {
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
