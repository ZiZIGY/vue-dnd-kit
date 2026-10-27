<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Blog from './Blog.vue';
</script>

<template>
  <DnDProvider>
    <Blog />
  </DnDProvider>
</template>
