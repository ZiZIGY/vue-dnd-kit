<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';
  import VirtualTable from '../components/VirtualTable.vue';
</script>

<template>
  <DnDProvider>
    <VirtualTable />
  </DnDProvider>
</template>
