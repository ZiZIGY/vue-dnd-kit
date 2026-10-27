<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Planner from './Planner.vue';
</script>

<template>
  <DnDProvider>
    <Planner />
  </DnDProvider>
</template>
