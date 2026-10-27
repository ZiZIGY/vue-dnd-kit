<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Browser from './Browser.vue';
</script>

<template>
  <DnDProvider>
    <Browser />
  </DnDProvider>
</template>
