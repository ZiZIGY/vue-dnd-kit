<script setup lang="ts">
import { provide, ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import MenuTree from './MenuTree.vue';
import { MENU, site } from './menu';

// Provided above the provider: its overlay renders under it, so the overlay sees it too.
provide(MENU, ref(site()));
</script>

<template>
  <DnDProvider>
    <MenuTree />
  </DnDProvider>
</template>
