<script setup lang="ts">
  import { ref, computed } from 'vue';

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
    ></div>
    <div class="example-content">
      <slot></slot>
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
    background-color: #0a0a0a;
  }

  .dot-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(
      rgba(255, 255, 255, 0.15) var(--dot-size),
      transparent var(--dot-size)
    );
    background-size: var(--dot-spacing) var(--dot-spacing);
    z-index: 1;
  }

  .example-content {
    background-color: rgba(20, 20, 20, 0.7);
    border-radius: 6px;
    padding: 24px;
    position: relative;
    z-index: 10;
    color: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(2px);
  }

  @keyframes to-top {
    0% {
      background-position: 0 100%;
    }
    100% {
      background-position: 0 0;
    }
  }
  @keyframes to-bottom {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 100%;
    }
  }
  @keyframes to-right {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 100% 0;
    }
  }
  @keyframes to-left {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
  @keyframes to-top-right {
    0% {
      background-position: 0 100%;
    }
    100% {
      background-position: 100% 0;
    }
  }
  @keyframes to-top-left {
    0% {
      background-position: 100% 100%;
    }
    100% {
      background-position: 0 0;
    }
  }
  @keyframes to-bottom-right {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 100% 100%;
    }
  }
  @keyframes to-bottom-left {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: 0 100%;
    }
  }

  .move {
    animation-duration: v-bind(durationFormSpeed);
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  .move-top {
    animation-name: to-top;
  }
  .move-bottom {
    animation-name: to-bottom;
  }
  .move-right {
    animation-name: to-right;
  }
  .move-left {
    animation-name: to-left;
  }
  .move-top-right {
    animation-name: to-top-right;
  }
  .move-top-left {
    animation-name: to-top-left;
  }
  .move-bottom-right {
    animation-name: to-bottom-right;
  }
  .move-bottom-left {
    animation-name: to-bottom-left;
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
