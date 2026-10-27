<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import TokenScene from './TokenScene.vue';
import StateInspector from './StateInspector.vue';
</script>

<template>
  <DnDProvider>
    <div class="demo">
      <TokenScene />
      <StateInspector />
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
}
</style>
