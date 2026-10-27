<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import OrgTree from './OrgTree.vue';
</script>

<template>
  <DnDProvider>
    <OrgTree />
  </DnDProvider>
</template>
