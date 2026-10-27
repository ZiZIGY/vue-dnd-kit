<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import PhotoGrid from './PhotoGrid.vue';
</script>

<template>
  <DnDProvider>
    <PhotoGrid />
  </DnDProvider>
</template>
