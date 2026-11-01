<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Expenses from './Expenses.vue';
</script>

<template>
  <DnDProvider>
    <Expenses />
  </DnDProvider>
</template>
