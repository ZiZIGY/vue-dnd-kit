<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Bookmarks from './Bookmarks.vue';
</script>

<template>
  <DnDProvider>
    <Bookmarks />
  </DnDProvider>
</template>
