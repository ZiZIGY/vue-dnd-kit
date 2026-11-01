<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Desktop from './Desktop.vue';
</script>

<template>
  <!-- Every selected icon gets a clone at pickup: the overlay shows them all. -->
  <DnDProvider overlay-previews="all">
    <Desktop />
  </DnDProvider>
</template>
