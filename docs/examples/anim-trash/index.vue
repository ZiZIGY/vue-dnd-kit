<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Gallery from './Gallery.vue';
</script>

<template>
  <DnDProvider>
    <Gallery />
  </DnDProvider>
</template>
