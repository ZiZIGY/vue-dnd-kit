<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import ShapeBoard from './ShapeBoard.vue';
</script>

<template>
  <DnDProvider>
    <ShapeBoard />
  </DnDProvider>
</template>
