<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeBoundingBox, makeDroppable } from '../../external';

  const node = useTemplateRef('node');

  makeDroppable(node);

  makeBoundingBox(node, {
    axis: 'y',
    restrictToArea: true,
  });
</script>

<template>
  <div
    ref="node"
    class="zone"
  >
    <slot />
  </div>
</template>

<style scoped>
  .zone {
    user-select: none;
    touch-action: none;
    position: relative;
    padding: 1rem;
    background: rgba(30, 41, 59, 0.5);
    border-radius: 12px;
    border: 1px solid rgba(56, 189, 248, 0.3);
    min-height: 120px;
  }

  .top-placement,
  .bottom-placement,
  .left-placement,
  .right-placement,
  .center-placement {
    position: absolute;
    display: block;
    pointer-events: none;
  }

  .top-placement {
    inset: 0;
    margin: auto;
    text-align: center;
    transform: translateY(-50%);
  }
  .bottom-placement {
    inset: 0;
    margin: auto;
    text-align: center;
    transform: translateY(50%);
  }
  .left-placement {
    left: 0;
    top: 50%;
    transform: translateY(-50%) translateX(-100%);
  }
  .right-placement {
    right: 0;
    top: 50%;
    transform: translateY(-50%) translateX(100%);
  }
  .center-placement {
    inset: 0;
    margin: auto;
    text-align: center;
    opacity: 0.7;
  }
</style>
