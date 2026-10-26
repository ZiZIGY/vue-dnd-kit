<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Palette from './Palette.vue';
</script>

<template>
  <DnDProvider>
    <Palette />
  </DnDProvider>
</template>
