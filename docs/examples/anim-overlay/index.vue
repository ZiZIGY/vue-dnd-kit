<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import CardList from './CardList.vue';
</script>

<template>
  <DnDProvider>
    <CardList />
  </DnDProvider>
</template>
