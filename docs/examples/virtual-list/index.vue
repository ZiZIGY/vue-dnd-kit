<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import TaskList from './TaskList.vue';
</script>

<template>
  <DnDProvider>
    <TaskList />
  </DnDProvider>
</template>
