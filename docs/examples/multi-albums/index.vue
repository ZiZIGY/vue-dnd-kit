<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Library from './Library.vue';
</script>

<template>
  <DnDProvider>
    <Library />
  </DnDProvider>
</template>
