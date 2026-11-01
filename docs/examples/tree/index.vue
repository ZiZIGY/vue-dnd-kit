<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Inventory from './Inventory.vue';
</script>

<template>
  <DnDProvider>
    <Inventory />
  </DnDProvider>
</template>
