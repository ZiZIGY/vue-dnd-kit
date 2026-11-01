<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Shop from './Shop.vue';
</script>

<template>
  <DnDProvider>
    <Shop />
  </DnDProvider>
</template>
