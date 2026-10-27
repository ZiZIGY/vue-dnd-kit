<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import NoteList from './NoteList.vue';
</script>

<template>
  <DnDProvider>
    <NoteList />
  </DnDProvider>
</template>
