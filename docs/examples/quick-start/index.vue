<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import TaskList from './TaskList.vue';
</script>

<template>
  <!-- The provider goes around the components that drag (often the whole app). -->
  <DnDProvider>
    <TaskList />
  </DnDProvider>
</template>
