<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';
  import VirtualList from '../components/VirtualList.vue';
  import VirtualTable from '../components/VirtualTable.vue';
</script>

<template>
  <DnDProvider>
    <div class="d-flex flex-wrap align-start ga-8">
      <VirtualList />
      <VirtualTable />
    </div>
  </DnDProvider>
</template>
