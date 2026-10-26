<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Board from './Board.vue';
</script>

<template>
  <DnDProvider>
    <Board />
  </DnDProvider>
</template>
