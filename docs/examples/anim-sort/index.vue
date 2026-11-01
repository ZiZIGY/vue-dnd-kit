<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Hand from './Hand.vue';
</script>

<template>
  <DnDProvider>
    <Hand />
  </DnDProvider>
</template>
