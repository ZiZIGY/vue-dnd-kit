<script setup lang="ts">
import { reactive } from 'vue';
import { DnDProvider, type SortablePutContext } from '@vue-dnd-kit/core';
import RefList from './RefList.vue';

const lists = reactive([
  {
    id: 'sprint',
    title: 'Sprint',
    group: { name: 'work' },
    tasks: [
      { id: 'login', title: 'Fix the login', urgent: true },
      { id: 'search', title: 'Search filters' },
      { id: 'avatars', title: 'Upload avatars' },
      { id: 'invoices', title: 'PDF invoices' },
    ],
  },
  {
    id: 'icebox',
    title: 'Icebox',
    // Urgent tasks can't go on ice.
    group: { name: 'work', put: ({ types }: SortablePutContext) => !types.includes('urgent') },
    tasks: [{ id: 'themes', title: 'Custom themes' }],
  },
]);
</script>

<template>
  <DnDProvider>
    <div class="lists">
      <RefList v-for="list in lists" :key="list.id" :list="list" />
    </div>
  </DnDProvider>
</template>

<style scoped>
.lists {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
