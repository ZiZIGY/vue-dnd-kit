<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Trip from './Trip.vue';
</script>

<template>
  <DnDProvider>
    <Trip />
  </DnDProvider>
</template>
