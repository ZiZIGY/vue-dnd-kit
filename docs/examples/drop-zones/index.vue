<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Workspace from './Workspace.vue';
</script>

<template>
  <DnDProvider>
    <Workspace />
  </DnDProvider>
</template>
