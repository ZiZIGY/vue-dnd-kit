<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Player from './Player.vue';
</script>

<template>
  <DnDProvider>
    <Player />
  </DnDProvider>
</template>
