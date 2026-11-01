<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeSortableList, type DnDEvent } from '@vue-dnd-kit/core';
import Photo from './Photo.vue';
import TrashBin from './TrashBin.vue';

interface PhotoItem {
  id: string;
  file: string;
  emoji: string;
  hue: number;
}

const photos = ref<PhotoItem[]>([
  { id: 'p1', file: 'IMG_2041.jpg', emoji: '🌅', hue: 20 },
  { id: 'p2', file: 'IMG_2042.jpg', emoji: '🏔️', hue: 210 },
  { id: 'p3', file: 'IMG_2043.jpg', emoji: '🌊', hue: 195 },
  { id: 'p4', file: 'IMG_2047.jpg', emoji: '🌲', hue: 140 },
  { id: 'p5', file: 'IMG_2051.jpg', emoji: '🌇', hue: 35 },
  { id: 'p6', file: 'IMG_2052.jpg', emoji: '🏝️', hue: 170 },
  { id: 'p7', file: 'IMG_2058.jpg', emoji: '🌌', hue: 260 },
  { id: 'p8', file: 'IMG_2060.jpg', emoji: '🌄', hue: 330 },
]);

const grid = useTemplateRef<HTMLElement>('grid');
const { items } = makeSortableList(grid, { items: photos, strategy: 'grid' });

/** The deleted photos, each with the place it had: Undo puts the last one back there. */
const deleted = ref<{ photo: PhotoItem; index: number }[]>([]);
const last = computed(() => deleted.value[deleted.value.length - 1]);

const remove = (event: DnDEvent) => {
  const index = photos.value.findIndex((photo) => photo.id === event.active.id);
  deleted.value.push({ photo: photos.value[index]!, index });
  event.source?.remove();
};

const undo = () => {
  const { photo, index } = deleted.value.pop()!;
  photos.value.splice(index, 0, photo);
};
</script>

<template>
  <div class="gallery">
    <ul ref="grid" class="photos">
      <Photo v-for="photo in items" :key="photo.id" :photo="photo" />
    </ul>
    <div class="side">
      <TrashBin @drop="remove" />
      <p v-if="last" class="toast" role="status">
        {{ last.photo.file }} deleted
        <button type="button" @click="undo">Undo</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: 1fr 150px;
  gap: 16px;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
}

.photos {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin: 0;
  padding: 7px 7px 7px 10px;
  border-radius: 9px;
  background: color-mix(in srgb, currentColor 8%, Canvas);
  font-size: 12px;
}

.toast button {
  padding: 4px 8px;
  border: 0;
  border-radius: 6px;
  background: #42b883;
  color: #04130c;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

@media (prefers-reduced-motion: no-preference) {
  .toast {
    animation: toast 0.25s ease-out;
  }
}

@keyframes toast {
  from {
    opacity: 0;
    translate: 0 6px;
  }
}

@media (max-width: 520px) {
  .gallery {
    grid-template-columns: 1fr;
  }

  .photos {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
