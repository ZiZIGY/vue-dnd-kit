<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import SensorDesk from './SensorDesk.vue';
</script>

<template>
  <DnDProvider>
    <SensorDesk />
  </DnDProvider>
</template>
