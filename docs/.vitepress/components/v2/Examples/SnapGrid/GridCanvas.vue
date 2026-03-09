<script setup lang="ts">
  const props = defineProps<{
    stepX: number;
    stepY: number;
  }>();
</script>

<template>
  <div
    class="canvas"
    :style="{ '--gx': `${props.stepX}px`, '--gy': `${props.stepY}px` }"
  >
    <slot />
  </div>
</template>

<style scoped>
  .canvas {
    position: relative;
    min-height: 240px;
    border-radius: 8px;
    border: 1px solid rgba(148, 163, 184, 0.2);
    background-color: var(--vp-c-bg);
    background-image:
      linear-gradient(rgba(62, 175, 124, 0.15) 1px, transparent 1px),
      linear-gradient(90deg, rgba(62, 175, 124, 0.15) 1px, transparent 1px);
    background-size: var(--gx) var(--gy);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
