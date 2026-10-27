<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import IssueTable from './IssueTable.vue';
</script>

<template>
  <DnDProvider>
    <IssueTable />
  </DnDProvider>
</template>
