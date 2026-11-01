<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Backlog from './Backlog.vue';
import type { Task } from './TaskRow.vue';

// In priority order: the array is the backlog.
const tasks = ref<Task[]>([
  { id: 1, title: 'Login fails on Safari', tag: 'bug' },
  { id: 2, title: 'Dark mode for settings', tag: 'feature' },
  { id: 3, title: 'Document the export API', tag: 'docs' },
  { id: 4, title: 'Crash when the list is empty', tag: 'bug' },
  { id: 5, title: 'Keyboard shortcuts', tag: 'feature' },
  { id: 6, title: 'Typo in the pricing page', tag: 'docs' },
  { id: 7, title: 'Slow search with 10k rows', tag: 'bug' },
  { id: 8, title: 'Share a board by link', tag: 'feature' },
]);
</script>

<template>
  <DnDProvider>
    <Backlog v-model="tasks" />
  </DnDProvider>
</template>
