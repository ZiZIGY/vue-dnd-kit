<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Moodboard from './Moodboard.vue';
import NoteGhost from './NoteGhost.vue';
</script>

<template>
  <DnDProvider>
    <Moodboard />
    <!--
      The overlay of every drag in the app that has none of its own. Notes get a ghost
      of their own; for photos the slot renders nothing, so they fall back to the clone.
    -->
    <template #overlay="{ items, status }">
      <NoteGhost v-if="items[0]?.type.includes('note')" :items="items" :status="status" />
    </template>
  </DnDProvider>
</template>
