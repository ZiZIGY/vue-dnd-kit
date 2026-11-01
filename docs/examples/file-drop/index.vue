<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import AvatarDrop from './AvatarDrop.vue';
import Attachments from './Attachments.vue';
</script>

<template>
  <DnDProvider>
    <div class="form">
      <AvatarDrop />
      <Attachments />
    </div>
  </DnDProvider>
</template>

<style scoped>
.form {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  gap: 16px;
}
</style>
