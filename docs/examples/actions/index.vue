<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Queue from './Queue.vue';
</script>

<template>
  <!-- @vue-dnd-kit/actions moves the rows from code: buttons, a shuffle, a scripted drag. -->
  <DnDProvider>
    <Queue />
  </DnDProvider>
</template>
