<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import AreaDesk from './AreaDesk.vue';
</script>

<template>
  <!-- One provider for everything: the area changes the rules only for the drags that start in it. -->
  <DnDProvider>
    <AreaDesk />
  </DnDProvider>
</template>
