<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeSortableList, useDnD, type Key } from '@vue-dnd-kit/core';
import PhotoTile from './PhotoTile.vue';
import PhotoStack from './PhotoStack.vue';
import AlbumCard from './AlbumCard.vue';
import { ALBUMS, PHOTOS } from './photos';

const photos = ref(PHOTOS.map((photo) => ({ ...photo })));
const albums = ref(ALBUMS.map((album) => ({ ...album, photos: [...album.photos] })));
const byId = computed(() => new Map(photos.value.map((photo) => [photo.id, photo])));

const grid = useTemplateRef<HTMLElement>('grid');
const { items } = makeSortableList(grid, {
  items: photos,
  strategy: 'grid',
  // The other picked photos fly into the overlay: it shows them as a stack.
  multiple: 'stack',
  overlay: PhotoStack,
});

const { selection } = useDnD();
const picked = computed(() => selection.ids.size);

/** Adds the photos to the album, the new ones in front; the library keeps them. */
const add = (albumId: string, ids: Key[]) => {
  const album = albums.value.find((entry) => entry.id === albumId)!;
  const added = ids.map(String).filter((id) => !album.photos.includes(id));
  album.photos = [...added, ...album.photos];
  selection.clear();
};
</script>

<template>
  <div class="library">
    <section class="main">
      <header>
        <strong>Library</strong>
        <span v-if="picked" class="picked-count">
          {{ picked }} selected
          <button type="button" class="clear" @click="selection.clear()">Clear</button>
        </span>
        <span v-else class="tip">Click photos to select them</span>
      </header>
      <ul ref="grid" class="grid">
        <PhotoTile v-for="photo in items" :key="photo.id" :photo="photo" />
      </ul>
    </section>
    <aside class="albums">
      <span class="caption">Albums</span>
      <AlbumCard v-for="album in albums" :key="album.id" :album="album" :cover="byId.get(album.photos[0] ?? '')" @add="(ids) => add(album.id, ids)" />
    </aside>
  </div>
</template>

<style scoped>
.library {
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 14px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  font-size: 13px;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 28px;
  margin-bottom: 8px;
}

.picked-count {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #42b883;
  font-weight: 600;
}

.clear {
  padding: 3px 8px;
  border: 0;
  border-radius: 6px;
  background: color-mix(in srgb, currentColor 10%, transparent);
  color: inherit;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.tip {
  font-size: 12px;
  opacity: 0.55;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.albums {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.caption {
  margin: 6px 4px 4px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

@media (max-width: 560px) {
  .library {
    grid-template-columns: 1fr;
  }

  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
