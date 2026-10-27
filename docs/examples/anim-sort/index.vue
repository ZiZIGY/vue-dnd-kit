<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Ranking from './Ranking.vue';
</script>

<template>
  <DnDProvider>
    <Ranking />
  </DnDProvider>
</template>
