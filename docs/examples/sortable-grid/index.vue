<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import AppGrid from './AppGrid.vue';
</script>

<template>
  <DnDProvider>
    <AppGrid />
  </DnDProvider>
</template>
