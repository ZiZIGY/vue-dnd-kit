<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Palette from './Palette.vue';
import Sheet from './Sheet.vue';
</script>

<template>
  <!-- The palette and the page are lists of one group: copies go from one to the other. -->
  <DnDProvider>
    <div class="builder">
      <Palette />
      <Sheet />
    </div>
  </DnDProvider>
</template>

<style scoped>
.builder {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
}
</style>
