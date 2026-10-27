<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Week from './Week.vue';
</script>

<template>
  <DnDProvider>
    <Week />
  </DnDProvider>
</template>
