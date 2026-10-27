<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Files from './Files.vue';
</script>

<template>
  <DnDProvider>
    <Files />
  </DnDProvider>
</template>
