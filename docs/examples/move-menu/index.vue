<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Planner from './Planner.vue';
</script>

<template>
  <!-- The ⋯ menus move rows with @vue-dnd-kit/actions. -->
  <DnDProvider>
    <Planner />
  </DnDProvider>
</template>
