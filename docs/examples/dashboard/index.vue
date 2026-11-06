<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Dashboard from './Dashboard.vue';
</script>

<template>
  <DnDProvider>
    <Dashboard />
  </DnDProvider>
</template>
