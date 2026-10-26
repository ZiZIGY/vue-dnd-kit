<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';
  import type { ExampleFile } from '#examples';

  /**
   * The file tabs of an example, which you can drag into another order: a provider of their
   * own, so they never meet the demo's drags. Enter opens a tab; Space picks it up.
   */
  const files = defineModel<ExampleFile[]>('files', { required: true });
  const active = defineModel<string>('active', { required: true });
  const KEYBOARD = { keys: { start: ['Space'], drop: ['Space'] } };
</script>

<template>
  <DnDProvider :keyboard="KEYBOARD">
    <ExampleTabList
      v-model:files="files"
      v-model:active="active"
    />
  </DnDProvider>
</template>
