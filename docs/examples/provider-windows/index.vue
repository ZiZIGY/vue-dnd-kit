<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Library from './Library.vue';
</script>

<template>
  <!-- One provider for the page and the popup: the popup shows part of this app. -->
  <DnDProvider>
    <Library />
  </DnDProvider>
</template>
