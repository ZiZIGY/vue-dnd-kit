<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';

  /** The hero's deck: its own provider, so its drags never meet the page's examples. */
</script>

<template>
  <DnDProvider>
    <HomeDeckList />
  </DnDProvider>
</template>
