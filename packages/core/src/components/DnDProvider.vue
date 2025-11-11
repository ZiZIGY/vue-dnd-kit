<script setup lang="ts">
  import { createDnDProvider } from '../provider';

  const provider = createDnDProvider();
</script>

<template>
  <slot />

  <pre>{{ provider.entities.draggableMap }}</pre>
</template>

<style scoped>
  pre {
    position: fixed;
    height: 100svh;
    width: 300px;
    overflow: auto;
    top: 0;
    left: 0;
  }
</style>
