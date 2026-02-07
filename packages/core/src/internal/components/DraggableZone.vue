<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDraggable, makeDroppable, useDnDProvider } from '../../external';

  const node = useTemplateRef('node');

  makeDraggable(node, {
    placementMargins: { top: 5, right: 5, bottom: 5, left: 5 },
  });
  makeDroppable(node);
</script>

<template>
  <div ref="node">
    <slot />
  </div>
</template>

<style scoped>
  div {
    user-select: none;
    touch-action: none;
    position: relative;
    padding: 5px;
    border: 1px solid red;
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
