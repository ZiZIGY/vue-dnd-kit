<script setup lang="ts">
import { ref } from 'vue';
import type { Key } from '@vue-dnd-kit/core';
import Folder from './Folder.vue';
import type { DeskFile } from './types';

const files = ref<DeskFile[]>([
  { id: 'beach', name: 'beach.jpg', kind: 'image', size: '2.4 MB', place: 'desktop' },
  { id: 'report', name: 'report.pdf', kind: 'doc', size: '310 KB', place: 'desktop' },
  { id: 'peaks', name: 'peaks.png', kind: 'image', size: '1.8 MB', place: 'desktop' },
  { id: 'notes', name: 'notes.txt', kind: 'doc', size: '4 KB', place: 'desktop' },
]);

// Each folder takes one kind of file (its `accept` matches the files' `type`); the trash
// and the desktop take anything.
const folders = [
  { id: 'images', name: 'Images', accept: 'image' },
  { id: 'documents', name: 'Documents', accept: 'doc' },
  { id: 'trash', name: 'Trash', accept: '*' },
];

const filesIn = (place: string) => files.value.filter((file) => file.place === place);
const move = (id: Key, place: string) => {
  const file = files.value.find((item) => item.id === id);
  if (file) file.place = place;
};
</script>

<template>
  <div class="workspace">
    <Folder id="desktop" name="Desktop" accept="*" desktop :files="filesIn('desktop')" @drop="move" />
    <div class="folders">
      <Folder v-for="folder in folders" :key="folder.id" v-bind="folder" :files="filesIn(folder.id)" @drop="move" />
    </div>
  </div>
</template>

<style scoped>
.workspace {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 680px;
  margin: 0 auto;
}

.folders {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  align-items: start;
}

@media (max-width: 640px) {
  .folders {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
