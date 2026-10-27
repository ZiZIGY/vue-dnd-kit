<script setup lang="ts">
import { reactive } from 'vue';
import { DnDProvider, type Key } from '@vue-dnd-kit/core';
import FileChip from './FileChip.vue';
import Zone from './Zone.vue';
import { FILES } from './files';

/** Which zone each file is in. */
const where = reactive<Record<string, string>>(Object.fromEntries(FILES.map((file) => [file.id, 'desk'])));
const filesIn = (zone: string) => FILES.filter((file) => where[file.id] === zone);
const move = (zone: string, file: Key) => (where[String(file)] = zone);
</script>

<template>
  <DnDProvider>
    <div class="zones">
      <Zone title="Desktop" rule="takes anything" class="desk" @drop="move('desk', $event)">
        <FileChip v-for="file in filesIn('desk')" :key="file.id" :file="file" />
      </Zone>
      <Zone title="Images" rule="accept: 'image'" accept="image" @drop="move('images', $event)">
        <FileChip v-for="file in filesIn('images')" :key="file.id" :file="file" />
      </Zone>
      <Zone title="Media" rule="accept: ['image', 'audio']" :accept="['image', 'audio']" @drop="move('media', $event)">
        <FileChip v-for="file in filesIn('media')" :key="file.id" :file="file" />
      </Zone>
      <Zone title="Archive" rule="disabled: true" disabled @drop="move('archive', $event)" />
    </div>
  </DnDProvider>
</template>

<style scoped>
.zones {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  width: min(720px, 100%);
}

.desk {
  grid-column: 1 / -1;
}

@media (max-width: 560px) {
  .zones {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
