<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import ReadingList from './ReadingList.vue';
</script>

<template>
  <DnDProvider>
    <ReadingList />
  </DnDProvider>
</template>
