<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Triage from './Triage.vue';
</script>

<template>
  <DnDProvider>
    <Triage />
  </DnDProvider>
</template>
