<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Mailbox from './Mailbox.vue';
</script>

<template>
  <DnDProvider>
    <Mailbox />
  </DnDProvider>
</template>
