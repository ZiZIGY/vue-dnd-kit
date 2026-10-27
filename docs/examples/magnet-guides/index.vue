<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Slide from './Slide.vue';
</script>

<template>
  <DnDProvider>
    <Slide />
  </DnDProvider>
</template>
