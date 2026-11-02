<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import TaskTable from './TaskTable.vue';
</script>

<template>
  <!-- The row in hand: a table row can't have a shadow, so its overlay content has it. -->
  <DnDProvider overlay-class="overflow-hidden rounded-md bg-default shadow-xl ring ring-accented">
    <TaskTable />
  </DnDProvider>
</template>
