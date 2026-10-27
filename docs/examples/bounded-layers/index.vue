<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Layers from './Layers.vue';
</script>

<template>
  <DnDProvider>
    <Layers />
  </DnDProvider>
</template>
