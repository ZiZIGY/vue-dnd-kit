<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Desktop from './Desktop.vue';
</script>

<template>
  <DnDProvider>
    <Desktop />
  </DnDProvider>
</template>
