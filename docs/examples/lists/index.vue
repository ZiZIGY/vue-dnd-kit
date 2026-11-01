<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import HomeScreen from './HomeScreen.vue';
</script>

<template>
  <DnDProvider>
    <HomeScreen />
  </DnDProvider>
</template>
