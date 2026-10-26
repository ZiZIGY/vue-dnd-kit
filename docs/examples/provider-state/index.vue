<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Tasks from './Tasks.vue';
import StatePanel from './StatePanel.vue';
</script>

<template>
  <!-- One provider: the list drags, the panel reads the drag. Neither imports the other. -->
  <DnDProvider>
    <div class="demo">
      <Tasks />
      <StatePanel />
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
}
</style>
