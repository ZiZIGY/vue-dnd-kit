<script setup lang="ts">
  import VirtualTanstackDemo from './VirtualTanstackDemo.vue';
</script>

<template>
  <!-- 50k rows with TanStack Virtual (rfcs/0001-v3.md §12), instrumented for e2e/bench.spec.ts. -->
  <VirtualTanstackDemo
    :count="50_000"
    bench
  />
</template>
