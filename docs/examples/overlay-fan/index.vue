<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Shelf from './Shelf.vue';
</script>

<template>
  <DnDProvider>
    <Shelf />
  </DnDProvider>
</template>
