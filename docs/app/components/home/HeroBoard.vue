<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';

  /** The hero's live demo: a 3×3 sortable grid of tiles on the blueprint. */
</script>

<template>
  <DnDProvider>
    <HomeHeroGrid />
  </DnDProvider>
</template>
