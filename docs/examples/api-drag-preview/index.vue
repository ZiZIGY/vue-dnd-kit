<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import MediaList from './MediaList.vue';

const media = (kind: 'photo' | 'video', n: number, hue: number) => ({ id: `${kind[0]}${n}`, kind, hue });
const library = ref([
  media('photo', 1, 200),
  media('photo', 2, 30),
  media('video', 1, 280),
  media('photo', 3, 140),
  media('photo', 4, 340),
  media('video', 2, 90),
  media('photo', 5, 250),
  media('photo', 6, 10),
]);
const album = ref([media('photo', 7, 170)]);
</script>

<template>
  <DnDProvider>
    <div class="demo">
      <MediaList id="library" v-model="library" title="Library" :columns="4" />
      <!-- Takes photos only: over it with a video, `accepted` is false. -->
      <MediaList id="album" v-model="album" title="Album · photos" :columns="3" photos-only />
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  align-content: flex-start;
  gap: 14px;
  /* Room above the lists for the overlay's caption, and below for the album to grow into:
     the lists never move under the pointer. */
  min-height: 300px;
  padding-top: 24px;
}
</style>
