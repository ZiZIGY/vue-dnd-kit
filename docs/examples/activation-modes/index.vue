<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Inbox from './Inbox.vue';
</script>

<template>
  <DnDProvider>
    <Inbox />
  </DnDProvider>
</template>
