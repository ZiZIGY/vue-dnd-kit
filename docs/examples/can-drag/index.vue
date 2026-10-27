<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Checklist from './Checklist.vue';
</script>

<template>
  <DnDProvider>
    <Checklist />
  </DnDProvider>
</template>
