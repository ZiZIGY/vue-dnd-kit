<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Timeline from './Timeline.vue';
</script>

<template>
  <DnDProvider>
    <Timeline />
  </DnDProvider>
</template>
