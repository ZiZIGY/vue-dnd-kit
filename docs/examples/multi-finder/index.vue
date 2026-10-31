<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Finder from './Finder.vue';
</script>

<template>
  <DnDProvider>
    <Finder />
  </DnDProvider>
</template>
