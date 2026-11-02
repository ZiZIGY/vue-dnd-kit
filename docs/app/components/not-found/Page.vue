<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';

  /**
   * The 404: the page's number fallen apart, to put back together; the lost page itself, to
   * drag somewhere that exists; and the log of all of it. One provider: the log hears every drag.
   */
  const route = useRoute();
  provideNotFoundLog(route.path);
</script>

<template>
  <DnDProvider>
    <NotFoundPuzzle />
    <NotFoundLost />
    <NotFoundLog />
  </DnDProvider>
</template>
