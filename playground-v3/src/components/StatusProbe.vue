<script setup lang="ts">
  import { useDnD } from '@vue-dnd-kit/core';

  // Must render inside the provider whose state it shows.
  const { status } = useDnD();
</script>

<template>
  <pre data-testid="status">{{ status }}</pre>
</template>
