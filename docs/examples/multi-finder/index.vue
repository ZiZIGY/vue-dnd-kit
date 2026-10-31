<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Finder from './Finder.vue';
</script>

<template>
  <!-- Every picked file gets a clone at pickup: they all go into the folder. -->
  <DnDProvider overlay-previews="all">
    <Finder />
  </DnDProvider>
</template>
