<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Mailbox from './Mailbox.vue';
</script>

<template>
  <!-- The mailbox reads the selection with `useDnD()`: it renders inside the provider. -->
  <DnDProvider>
    <Mailbox />
  </DnDProvider>
</template>
