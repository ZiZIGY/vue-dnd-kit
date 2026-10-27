<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Flowchart from './Flowchart.vue';
</script>

<template>
  <DnDProvider>
    <Flowchart />
  </DnDProvider>
</template>
