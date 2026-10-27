<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import CallScreen from './CallScreen.vue';
</script>

<template>
  <DnDProvider>
    <CallScreen />
  </DnDProvider>
</template>
