<script setup lang="ts">
  import { useDnD } from '@vue-dnd-kit/core';

  // Rendered inside the demo's provider: reads that provider's selection, not the app's.
  const { selection } = useDnD();
</script>

<template>
  <button
    type="button"
    data-testid="clear"
    @click="selection.clear()"
  >
    Clear selection
  </button>
</template>
