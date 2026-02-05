<script setup lang="ts">
  defineProps<{
    index: number;
  }>();
</script>

<template>
  <div>
    Hello World: {{ index }}
  </div>
</template>