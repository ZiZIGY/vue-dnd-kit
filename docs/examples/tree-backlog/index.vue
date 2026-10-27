<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Roadmap from './Roadmap.vue';
import Backlog from './Backlog.vue';
</script>

<template>
  <DnDProvider>
    <div class="planner">
      <Roadmap />
      <Backlog />
    </div>
  </DnDProvider>
</template>

<style scoped>
.planner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 260px));
  justify-content: center;
  gap: 14px;
  width: 100%;
}
</style>
