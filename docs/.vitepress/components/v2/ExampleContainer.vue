<script setup lang="ts">
  import { computed } from 'vue';

  const {
    speed = 20,
    direction = 'top-right',
    dotSize = 1,
    dotSpacing = 20,
  } = defineProps<{
    direction?:
      | 'top'
      | 'bottom'
      | 'right'
      | 'left'
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
      | 'bottom-left';
    speed?: number;
    dotSize?: number;
    dotSpacing?: number;
  }>();

  const durationFormSpeed = computed(() => `${speed}s`);
  const moveClass = computed(() => `move move-${direction}`);
</script>

<template>
  <div class="example-container">
    <div
      class="dot-background"
      :class="moveClass"
      :style="{
        '--dot-size': `${dotSize}px`,
        '--dot-spacing': `${dotSpacing}px`,
      }"
    />
    <div class="example-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .example-container {
    margin: 24px 0;
    padding: 32px;
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    background-color: var(--vp-sidebar-bg-color);
  }

  .dot-background {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      var(--vp-c-text-1) var(--dot-size),
      transparent var(--dot-size)
    );
    background-size: var(--dot-spacing) var(--dot-spacing);
    z-index: 1;
    box-shadow: inset 0 0 25px 10px rgba(0, 0, 0, 0.25);
  }

  .example-content {
    background-color: var(--vp-c-bg-soft);
    border-radius: 6px;
    padding: 24px;
    position: relative;
    z-index: 10;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(2px);
  }

  .move {
    animation-duration: v-bind(durationFormSpeed);
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  .move-top-right {
    animation-name: to-top-right;
  }
  @keyframes to-top-right {
    0% {
      background-position: 0 100%;
    }
    100% {
      background-position: 100% 0;
    }
  }

  @media (max-width: 640px) {
    .example-container {
      padding: 20px;
    }
    .example-content {
      padding: 16px;
    }
  }
</style>
